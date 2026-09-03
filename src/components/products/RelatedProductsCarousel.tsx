"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ProductCard } from "@/components/products/ProductCard";
import type { ProductWithRelations } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RelatedProductsCarousel({
  products,
}: {
  products: ProductWithRelations[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrowState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrowState();

    const el = scrollerRef.current;
    if (!el) return;

    const handleResize = () => updateArrowState();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateArrowState, products.length]);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;

    // Scroll by roughly one card width (including gap).
    const card = el.querySelector<HTMLElement>("[data-carousel-card]");
    const amount = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;

    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {canScrollLeft ? (
        <button
          type="button"
          onClick={() => scrollByAmount("left")}
          aria-label="Scroll related products left"
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-4 rounded-full border border-border bg-white p-2 shadow-md transition hover:border-accent hover:text-accent"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
      ) : null}

      {canScrollRight ? (
        <button
          type="button"
          onClick={() => scrollByAmount("right")}
          aria-label="Scroll related products right"
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-4 rounded-full border border-border bg-white p-2 shadow-md transition hover:border-accent hover:text-accent"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      ) : null}

      <div
        ref={scrollerRef}
        onScroll={updateArrowState}
        className={cn(
          "flex gap-5 overflow-x-auto scroll-smooth pb-2",
          "[scrollbar-width:none] [-ms-overflow-style:none]",
          "[&::-webkit-scrollbar]:hidden",
        )}
      >
        {products.map((product) => (
          <div
            key={product.id}
            data-carousel-card
            className="w-[240px] shrink-0 sm:w-[260px] xl:w-[280px]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
