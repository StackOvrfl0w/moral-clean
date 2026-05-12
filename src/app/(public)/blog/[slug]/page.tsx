import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { SVGProps } from "react";
import { Home, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";

import { BlogCard } from "@/components/blog/BlogCard";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { Separator } from "@/components/ui/separator";
import {
  getPostBySlug,
  getPublishedPostSlugs,
  getRelatedPosts,
} from "@/lib/queries/blog";

export const revalidate = 3600;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

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

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.8 8.9H3.5V20h3.3V8.9ZM5.2 4a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM20.5 13.8c0-3.1-1.7-5.1-4.4-5.1-1.7 0-2.8.9-3.3 1.8V8.9H9.6V20h3.3v-5.8c0-1.6.8-2.5 2.1-2.5 1.2 0 2 .8 2 2.5V20h3.5v-6.2Z" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.25 3h2.99l-6.53 7.46L22.4 21h-6.03l-4.72-6.17L6.25 21H3.25l6.99-8L3 3h6.18l4.27 5.67L18.25 3Zm-1.06 16.18h1.66L8.28 4.73H6.5l10.69 14.45Z" />
    </svg>
  );
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

function readingTime(content: string) {
  const plainText = content.replace(/<[^>]*>/g, " ");
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post || !post.published) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: post.meta_title || post.title,
    description:
      post.meta_description ||
      post.excerpt ||
      "Read practical guidance from the Moral Clean team.",
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.meta_title || post.title,
      description:
        post.meta_description ||
        post.excerpt ||
        "Read practical guidance from the Moral Clean team.",
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : undefined,
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getPublishedPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post || !post.published) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.slug, 3);
  const authorName = post.author_name || "The Moral Clean Team";
  const minutes = readingTime(post.content);
  const imageUrl = post.cover_image_url || fallbackImage;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: [imageUrl],
    description: post.excerpt || "Read practical guidance from the Moral Clean team.",
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Moral Clean",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
      url: siteUrl,
    },
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="bg-muted py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-primary">
              <Home className="size-4" aria-hidden="true" />
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="hover:text-primary">
              Blog
            </Link>
            <span aria-hidden="true">/</span>
            <span>{post.title}</span>
          </nav>
        </div>
      </section>

      <section className="bg-background py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {formatDate(post.published_at)}
          </p>
          <h1 className="mt-4 font-display text-5xl font-extrabold text-primary">
            {post.title}
          </h1>
          <p className="mt-5 text-xl text-muted-foreground">
            {post.excerpt || "Practical guidance from the Moral Clean team."}
          </p>

          <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex size-9 items-center justify-center rounded-full bg-accent/15 font-semibold text-accent">
              {authorName
                .split(" ")
                .map((item) => item[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </span>
            <span>By {authorName}</span>
            <span aria-hidden="true">•</span>
            <span>{minutes} min read</span>
          </div>

          <Separator className="mt-7" />
        </div>
      </section>

      <section className="bg-background pb-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-muted">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 80vw, 100vw"
              unoptimized
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-background py-8">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div
            className="prose prose-lg prose-headings:font-display prose-a:text-accent prose-img:rounded-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-10 rounded-md border border-border bg-muted/40 p-4">
            <p className="text-sm font-semibold text-primary">Share this article</p>
            {/* TODO: Replace placeholder share links with generated share URLs. */}
            <div className="mt-3 flex items-center gap-2">
              {[
                { label: "LinkedIn", href: "#", Icon: LinkedinIcon },
                { label: "Twitter", href: "#", Icon: XIcon },
                { label: "WhatsApp", href: "#", Icon: MessageCircle },
              ].map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-xs font-semibold text-primary hover:border-accent hover:text-accent"
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-border bg-white p-6">
            <div className="flex items-start gap-4">
              <span className="flex size-12 items-center justify-center rounded-full bg-accent/15 text-sm font-bold text-accent">
                MT
              </span>
              <div>
                <h3 className="text-xl">The Moral Clean Team</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Practical insights from our product and service teams focused
                  on commercial cleaning equipment and maintenance operations.
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>

      {relatedPosts.length > 0 ? (
        <section className="bg-muted py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-3xl">Related Articles</h2>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBanner
        heading="Looking for the right equipment? We're here to help."
        subtitle="Share your facility requirements and cleaning goals. Our team will recommend practical equipment and support options."
        primaryLabel="Talk to Our Team"
        primaryHref="/contact"
      />
    </>
  );
}
