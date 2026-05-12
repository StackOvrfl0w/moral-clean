import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PackageCheck } from "lucide-react";

import type { ProductWithRelations } from "@/lib/types";

const blurDataUrl =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

const fallbackImage = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f8fafc"/>
      <stop offset="1" stop-color="#e0f2fe"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bg)"/>
  <circle cx="600" cy="180" r="180" fill="#0ea5e9" opacity="0.14"/>
  <circle cx="220" cy="620" r="220" fill="#0a2540" opacity="0.08"/>
  <rect x="245" y="330" width="310" height="160" rx="28" fill="#ffffff" opacity="0.88"/>
  <path d="M300 490h220l34 86H268l32-86Z" fill="#0a2540" opacity="0.18"/>
  <circle cx="330" cy="590" r="34" fill="#0a2540" opacity="0.22"/>
  <circle cx="490" cy="590" r="34" fill="#0a2540" opacity="0.22"/>
</svg>
`)}`;

export function ProductCard({ product }: { product: ProductWithRelations }) {
  const image = product.images[0];
  const imageUrl = image?.url || fallbackImage;

  return (
    <article className="group rounded-md border border-border bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-primary/5">
      <Link href={`/products/${product.slug}`} className="block" aria-label={product.name}>
        <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
          <Image
            src={imageUrl}
            alt={image?.alt_text || product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
            placeholder="blur"
            blurDataURL={blurDataUrl}
            unoptimized
            className="object-cover transition duration-300 group-hover:scale-105"
          />
          {!image ? (
            <PackageCheck
              className="absolute right-4 top-4 size-6 text-primary/35"
              aria-hidden="true"
            />
          ) : null}
        </div>
      </Link>
      <div className="px-1 pb-1 pt-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
          {product.brand || "Moral Clean"}
        </p>
        <h3 className="mt-2 text-lg">
          <Link href={`/products/${product.slug}`} className="hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <p className="mt-3 overflow-hidden text-sm text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
          {product.short_description ||
            "Professional cleaning equipment selected for commercial and industrial use."}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent"
        >
          View Details
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
