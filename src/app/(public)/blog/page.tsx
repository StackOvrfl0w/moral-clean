import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BlogCard } from "@/components/blog/BlogCard";
import { NewsletterStrip } from "@/components/blog/NewsletterStrip";
import { Button } from "@/components/ui/button";
import { getAllPosts } from "@/lib/queries/blog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read industry insights, cleaning equipment guides, and maintenance tips from the Moral Clean team.",
  openGraph: {
    title: "Blog | Moral Clean",
    description:
      "Read industry insights, cleaning equipment guides, and maintenance tips from the Moral Clean team.",
  },
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
};

const POSTS_PER_PAGE = 9;

const fallbackImage = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f8fafc"/>
      <stop offset="1" stop-color="#e0f2fe"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <circle cx="1320" cy="170" r="190" fill="#0ea5e9" opacity="0.16"/>
  <circle cx="260" cy="760" r="250" fill="#0a2540" opacity="0.08"/>
  <rect x="340" y="240" width="920" height="400" rx="30" fill="#fff" opacity="0.9"/>
</svg>
`)}`;

function getParam(
  searchParams: Record<string, string | string[] | undefined> | undefined,
  key: string,
) {
  const value = searchParams?.[key];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function normalizePage(page?: string) {
  const value = Number(page ?? 1);
  if (!Number.isFinite(value) || value < 1) {
    return 1;
  }
  return Math.floor(value);
}

function formatDate(value: string | null) {
  if (!value) {
    return "Date unavailable";
  }

  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function createPageHref(page: number) {
  return page <= 1 ? "/blog" : `/blog?page=${page}`;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const page = normalizePage(getParam(searchParams, "page"));
  const result = await getAllPosts({ page, limit: POSTS_PER_PAGE });
  const showFeatured = result.totalCount >= 4 && result.posts.length > 0;
  const featuredPost = showFeatured ? result.posts[0] : null;
  const gridPosts = featuredPost ? result.posts.slice(1) : result.posts;
  const pages = Array.from({ length: result.pageCount }, (_, index) => index + 1);

  return (
    <>
      <section className="bg-muted py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Insights & Guides
          </p>
          <h1 className="font-display text-5xl font-extrabold text-primary lg:text-6xl">
            The Moral Clean Blog
          </h1>
          <p className="mt-5 text-base text-muted-foreground sm:text-lg">
            Practical insights for facility managers and cleaning professionals
            on equipment, maintenance, and operational standards.
          </p>
        </div>
      </section>

      {featuredPost ? (
        <section className="bg-background py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <article className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
              <div className="grid lg:grid-cols-2">
                <div className="relative min-h-[280px]">
                  <Image
                    src={featuredPost.cover_image_url || fallbackImage}
                    alt={featuredPost.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="p-7 lg:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {formatDate(featuredPost.published_at)}
                  </p>
                  <h2 className="mt-4 text-3xl lg:text-4xl">{featuredPost.title}</h2>
                  <p className="mt-4 overflow-hidden text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                    {featuredPost.excerpt ||
                      "Read practical guidance from the Moral Clean team."}
                  </p>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent"
                  >
                    Read article
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </section>
      ) : null}

      <section className="bg-background py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl">Latest Articles</h2>

          {gridPosts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {gridPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-border bg-muted/60 p-10 text-center text-sm text-muted-foreground">
              No posts available yet.
            </div>
          )}

          {result.pageCount > 1 ? (
            <nav className="mt-10 flex flex-wrap items-center justify-center gap-2">
              {result.page > 1 ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={createPageHref(result.page - 1)}>Previous</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
              )}

              {pages.map((pageNumber) => (
                <Button
                  key={pageNumber}
                  asChild={pageNumber !== result.page}
                  size="sm"
                  variant={pageNumber === result.page ? "default" : "outline"}
                >
                  {pageNumber === result.page ? (
                    <span>{pageNumber}</span>
                  ) : (
                    <Link href={createPageHref(pageNumber)}>{pageNumber}</Link>
                  )}
                </Button>
              ))}

              {result.page < result.pageCount ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={createPageHref(result.page + 1)}>Next</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              )}
            </nav>
          ) : null}
        </div>
      </section>

      <NewsletterStrip />
    </>
  );
}
