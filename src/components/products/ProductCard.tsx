import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PackageCheck } from "lucide-react";

import type { ProductCardData } from "@/lib/types";
import { productCardFallbackImage } from "@/lib/fallback-images";

const blurDataUrl =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

export function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.images[0];
  const imageUrl = image?.url || productCardFallbackImage;

  return (
    <article className="group rounded-md border border-border bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-navy/30 hover:bg-brand-gradient hover:shadow-lg hover:shadow-brand-navy/10">
      <Link href={`/products/${product.slug}`} className="block" aria-label={product.name}>
        <div className="relative aspect-square overflow-hidden rounded-md border border-white/50 bg-white">
          <Image
            src={imageUrl}
            alt={image?.alt_text || product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
            placeholder="blur"
            blurDataURL={blurDataUrl}

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
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent transition-colors group-hover:text-brand-navy/75">
          {product.brand || "Moral Clean"}
        </p>
        <h3 className="mt-2 text-lg transition-colors group-hover:text-brand-navy">
          <Link href={`/products/${product.slug}`} className="hover:text-white">
            {product.name}
          </Link>
        </h3>
        <p className="mt-3 overflow-hidden text-sm text-muted-foreground transition-colors group-hover:text-brand-navy/75 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
          {product.short_description ||
            "Professional cleaning equipment selected for commercial and industrial use."}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors group-hover:text-brand-navy hover:text-white"
        >
          View Details
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
