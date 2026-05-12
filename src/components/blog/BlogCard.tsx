import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { BlogPost } from "@/lib/types";

const blurDataUrl =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

const fallbackImage = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f8fafc"/>
      <stop offset="1" stop-color="#e0f2fe"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)"/>
  <circle cx="1080" cy="140" r="170" fill="#0ea5e9" opacity="0.16"/>
  <circle cx="240" cy="620" r="210" fill="#0a2540" opacity="0.08"/>
  <rect x="260" y="210" width="760" height="280" rx="24" fill="#fff" opacity="0.92"/>
</svg>
`)}`;

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

export function BlogCard({ post }: { post: BlogPost }) {
  const imageUrl = post.cover_image_url || fallbackImage;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-md border border-border bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
        <Image
          src={imageUrl}
          alt={post.title}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
          placeholder="blur"
          blurDataURL={blurDataUrl}
          unoptimized
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="px-1 pb-1 pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {formatDate(post.published_at)}
        </p>
        <h3 className="mt-2 overflow-hidden text-xl [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
          {post.title}
        </h3>
        <p className="mt-3 overflow-hidden text-sm text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
          {post.excerpt || "Read practical guidance from the Moral Clean team."}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
          Read more
          <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
