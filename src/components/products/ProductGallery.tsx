"use client";

import { useState } from "react";
import Image from "next/image";
import { PackageCheck } from "lucide-react";

import type { ProductImage } from "@/lib/types";
import { cn } from "@/lib/utils";

const blurDataUrl =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

const fallbackImage = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f8fafc"/>
      <stop offset="1" stop-color="#e0f2fe"/>
    </linearGradient>
  </defs>
  <rect width="1000" height="1000" fill="url(#bg)"/>
  <circle cx="760" cy="230" r="210" fill="#0ea5e9" opacity="0.16"/>
  <circle cx="240" cy="760" r="260" fill="#0a2540" opacity="0.08"/>
  <rect x="270" y="390" width="460" height="200" rx="34" fill="#fff" opacity="0.9"/>
  <path d="M350 590h300l48 132H302l48-132Z" fill="#0a2540" opacity="0.16"/>
  <circle cx="410" cy="746" r="44" fill="#0a2540" opacity="0.24"/>
  <circle cx="610" cy="746" r="44" fill="#0a2540" opacity="0.24"/>
</svg>
`)}`;

export function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const galleryImages =
    images.length > 0
      ? images
      : [
          {
            id: "fallback",
            product_id: null,
            url: fallbackImage,
            alt_text: productName,
            is_primary: true,
            sort_order: 0,
          },
        ];
  const activeImage = galleryImages[activeIndex] ?? galleryImages[0];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted p-6">
        <Image
          src={activeImage.url}
          alt={activeImage.alt_text || productName}
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
          placeholder="blur"
          blurDataURL={blurDataUrl}
          unoptimized
          className="object-contain p-6"
        />
        {images.length === 0 ? (
          <PackageCheck
            className="absolute right-6 top-6 size-8 text-primary/30"
            aria-hidden="true"
          />
        ) : null}
      </div>

      {galleryImages.length > 1 ? (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {galleryImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative size-20 shrink-0 overflow-hidden rounded-md border bg-muted p-1 transition-colors",
                activeIndex === index ? "border-accent" : "border-border",
              )}
              aria-label={`Show ${image.alt_text || productName}`}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="80px"
                placeholder="blur"
                blurDataURL={blurDataUrl}
                unoptimized
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
