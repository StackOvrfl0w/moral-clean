import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { env } from "@/config/env";
import { mockBlogPosts } from "@/lib/seed-data";
import type { BlogCardData, BlogPost, Database } from "@/lib/types";

const PUBLIC_CACHE_SECONDS = 900;
const BLOG_CARD_COLUMNS =
  "id,slug,title,excerpt,cover_image_url,published_at";

type GetAllPostsOptions = {
  page?: string | number;
  limit?: number;
};

type GetAllPostsResult = {
  posts: BlogCardData[];
  totalCount: number;
  page: number;
  pageCount: number;
  limit: number;
};

function createPublicClient() {
  if (!env.supabaseUrl?.trim() || !env.supabaseAnonKey?.trim()) {
    return null;
  }

  return createSupabaseClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function normalizePage(page?: string | number) {
  const value = Number(page ?? 1);
  return Number.isFinite(value) && value >= 1 ? Math.floor(value) : 1;
}

function normalizeLimit(limit?: number) {
  const value = Number(limit ?? 9);
  return Number.isFinite(value)
    ? Math.max(1, Math.min(24, Math.floor(value)))
    : 9;
}

function getSeedPublishedPosts() {
  return mockBlogPosts
    .filter((post) => post.published)
    .sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));
}

async function queryAllPosts(
  page: number,
  limit: number,
): Promise<GetAllPostsResult> {
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
  const { data, error, count } = await supabase
    .from("blog_posts")
    .select(BLOG_CARD_COLUMNS, { count: "exact" })
    .eq("published", true)
    .order("published_at", { ascending: false })
    .range(from, from + limit - 1);

  if (error) {
    console.error("Unable to load published articles:", error.message);
    throw new Error("Unable to load published articles");
  }

  const totalCount = count ?? 0;
  const pageCount = Math.max(1, Math.ceil(totalCount / limit));

  return {
    posts: (data ?? []) as BlogCardData[],
    totalCount,
    page: Math.min(page, pageCount),
    pageCount,
    limit,
  };
}

const getCachedAllPosts = unstable_cache(
  queryAllPosts,
  ["published-blog-list-v2"],
  { revalidate: PUBLIC_CACHE_SECONDS, tags: ["blog"] },
);

export function getAllPosts(
  options: GetAllPostsOptions = {},
): Promise<GetAllPostsResult> {
  return getCachedAllPosts(
    normalizePage(options.page),
    normalizeLimit(options.limit),
  );
}

async function queryPostBySlug(slug: string): Promise<BlogPost | null> {
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

  if (error) throw new Error("Unable to load article");
  return data ?? null;
}

const getCachedPostBySlug = unstable_cache(
  queryPostBySlug,
  ["published-blog-post-v2"],
  { revalidate: PUBLIC_CACHE_SECONDS, tags: ["blog"] },
);

export const getPostBySlug = cache(getCachedPostBySlug);

async function queryRelatedPosts(currentSlug: string, limit: number) {
  const supabase = createPublicClient();

  if (!supabase) {
    return getSeedPublishedPosts()
      .filter((post) => post.slug !== currentSlug)
      .slice(0, limit);
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select(BLOG_CARD_COLUMNS)
    .eq("published", true)
    .neq("slug", currentSlug)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error("Unable to load related articles");
  return (data ?? []) as BlogCardData[];
}

const getCachedRelatedPosts = unstable_cache(
  queryRelatedPosts,
  ["published-blog-related-v2"],
  { revalidate: PUBLIC_CACHE_SECONDS, tags: ["blog"] },
);

export function getRelatedPosts(currentSlug: string, limit = 3) {
  return getCachedRelatedPosts(
    currentSlug,
    Math.max(1, Math.min(12, Math.floor(limit))),
  );
}

async function queryPublishedPostSlugs() {
  const supabase = createPublicClient();
  if (!supabase) return getSeedPublishedPosts().map((post) => post.slug);

  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("published", true);

  if (error) throw new Error("Unable to load published article URLs");
  return (data ?? []).map((post) => post.slug);
}

export const getPublishedPostSlugs = unstable_cache(
  queryPublishedPostSlugs,
  ["published-blog-slugs-v2"],
  { revalidate: PUBLIC_CACHE_SECONDS, tags: ["blog"] },
);
