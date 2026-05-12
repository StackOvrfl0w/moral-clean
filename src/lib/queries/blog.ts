import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { mockBlogPosts } from "@/lib/seed-data";
import type { BlogPost, Database } from "@/lib/types";

type GetAllPostsOptions = {
  page?: string | number;
  limit?: number;
};

type GetAllPostsResult = {
  posts: BlogPost[];
  totalCount: number;
  page: number;
  pageCount: number;
  limit: number;
};

function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
  );
}

function createPublicClient() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

function normalizePage(page?: string | number) {
  const value = Number(page ?? 1);

  if (!Number.isFinite(value) || value < 1) {
    return 1;
  }

  return Math.floor(value);
}

function getSeedPublishedPosts() {
  return mockBlogPosts
    .filter((post) => post.published)
    .sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));
}

export async function getAllPosts(
  options: GetAllPostsOptions = {},
): Promise<GetAllPostsResult> {
  const limit = options.limit ?? 9;
  const page = normalizePage(options.page);
  const supabase = createPublicClient();

  if (!supabase) {
    const allPosts = getSeedPublishedPosts();
    const totalCount = allPosts.length;
    const pageCount = Math.max(1, Math.ceil(totalCount / limit));
    const safePage = Math.min(page, pageCount);
    const start = (safePage - 1) * limit;

    return {
      posts: allPosts.slice(start, start + limit),
      totalCount,
      page: safePage,
      pageCount,
      limit,
    };
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const { data, error, count } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact" })
    .eq("published", true)
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error || !data || data.length === 0) {
    const allPosts = getSeedPublishedPosts();
    const totalCount = allPosts.length;
    const pageCount = Math.max(1, Math.ceil(totalCount / limit));
    const safePage = Math.min(page, pageCount);
    const start = (safePage - 1) * limit;

    return {
      posts: allPosts.slice(start, start + limit),
      totalCount,
      page: safePage,
      pageCount,
      limit,
    };
  }

  const totalCount = count ?? data.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / limit));

  return {
    posts: data,
    totalCount,
    page: Math.min(page, pageCount),
    pageCount,
    limit,
  };
}

export async function getPostBySlug(slug: string) {
  const supabase = createPublicClient();

  if (!supabase) {
    return getSeedPublishedPosts().find((post) => post.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) {
    return getSeedPublishedPosts().find((post) => post.slug === slug) ?? null;
  }

  return data;
}

export async function getRelatedPosts(currentSlug: string, limit = 3) {
  const supabase = createPublicClient();

  if (!supabase) {
    return getSeedPublishedPosts()
      .filter((post) => post.slug !== currentSlug)
      .slice(0, limit);
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .neq("slug", currentSlug)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error || !data || data.length === 0) {
    return getSeedPublishedPosts()
      .filter((post) => post.slug !== currentSlug)
      .slice(0, limit);
  }

  return data;
}

export async function getPublishedPostSlugs() {
  const supabase = createPublicClient();

  if (!supabase) {
    return getSeedPublishedPosts().map((post) => post.slug);
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("published", true);

  if (error || !data || data.length === 0) {
    return getSeedPublishedPosts().map((post) => post.slug);
  }

  return data.map((post) => post.slug);
}
