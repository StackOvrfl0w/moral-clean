"use client";

import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Category, Tag } from "@/lib/types";
import { cn } from "@/lib/utils";

type ActiveFilters = {
  category?: string;
  brand?: string;
  tag?: string;
  q?: string;
  sort?: string;
};

type ProductFiltersProps = {
  categories: Category[];
  categoryCounts: Record<string, number>;
  brands: string[];
  tags: Tag[];
  activeFilters: ActiveFilters;
  className?: string;
};

function createFilterHref(
  activeFilters: ActiveFilters,
  key: keyof ActiveFilters,
  value?: string,
) {
  const params = new URLSearchParams();

  Object.entries(activeFilters).forEach(([filterKey, filterValue]) => {
    if (filterValue && filterKey !== key) {
      params.set(filterKey, filterValue);
    }
  });

  if (value && activeFilters[key] !== value) {
    params.set(key, value);
  }

  params.delete("page");

  const query = params.toString();

  return query ? `/products?${query}` : "/products";
}

function CheckboxFilter({
  href,
  checked,
  children,
  onClick,
}: {
  href: string;
  checked: boolean;
  children: React.ReactNode;
  onClick: (href: string) => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onClick(href)}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors hover:bg-muted",
        checked && "bg-accent/10 text-primary",
      )}
    >
      <span
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded border border-border",
          checked && "border-accent bg-accent text-accent-foreground",
        )}
        aria-hidden="true"
      >
        {checked ? <Check className="size-3" /> : null}
      </span>
      {children}
    </button>
  );
}

export function ProductFilters({
  categories,
  categoryCounts,
  brands,
  tags,
  activeFilters,
  className,
}: ProductFiltersProps) {
  const router = useRouter();

  const hasFilters = Boolean(
    activeFilters.category ||
    activeFilters.brand ||
    activeFilters.tag ||
    activeFilters.q ||
    activeFilters.sort,
  );

  function navigate(href: string) {
    router.push(href, { scroll: false });
  }

  return (
    <aside className={cn("space-y-8", className)}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base">Categories</h2>
        {hasFilters ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => navigate("/products")}
          >
            <X className="size-4" aria-hidden="true" />
            Clear
          </Button>
        ) : null}
      </div>

      <div className="space-y-1">
        {categories.map((category) => {
          const checked = activeFilters.category === category.slug;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => navigate(`/products/category/${category.slug}`)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-sm transition-colors hover:bg-muted",
                checked && "bg-accent/10 font-semibold text-primary",
              )}
            >
              <span>{category.name}</span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {categoryCounts[category.slug] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <div>
        <h2 className="text-base">Brands</h2>
        <div className="mt-3 space-y-1">
          {brands.map((brand) => (
            <CheckboxFilter
              key={brand}
              href={createFilterHref(activeFilters, "brand", brand)}
              checked={activeFilters.brand === brand}
              onClick={navigate}
            >
              <span>{brand}</span>
            </CheckboxFilter>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-base">Tags</h2>
        <div className="mt-3 space-y-1">
          {tags.map((tag) => (
            <CheckboxFilter
              key={tag.id}
              href={createFilterHref(activeFilters, "tag", tag.slug)}
              checked={activeFilters.tag === tag.slug}
              onClick={navigate}
            >
              <span>{tag.name}</span>
            </CheckboxFilter>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => navigate("/products")}
      >
        Clear Filters
      </Button>
    </aside>
  );
}
