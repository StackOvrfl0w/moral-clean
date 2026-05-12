import Link from "next/link";
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import type { ProductWithRelations } from "@/lib/types";

export function ProductGrid({
  products,
  clearHref = "/products",
}: {
  products: ProductWithRelations[];
  clearHref?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/60 px-6 text-center">
        <SearchX className="size-10 text-accent" aria-hidden="true" />
        <h2 className="mt-5 text-xl">No products match these filters</h2>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Adjust the category, brand, tag, or search term to broaden the product
          list.
        </p>
        <Button asChild className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href={clearHref}>Clear Filters</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
