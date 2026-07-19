"use client";

import { useState } from "react";
import Image from "next/image";
import { PackageCheck } from "lucide-react";

import type { ProductImage } from "@/lib/types";
import { productGalleryFallbackImage } from "@/lib/fallback-images";
import { cn } from "@/lib/utils";

const blurDataUrl =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

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
            url: productGalleryFallbackImage,
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
