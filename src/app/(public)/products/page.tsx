import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, Home, Search, SlidersHorizontal } from "lucide-react";

import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getProducts, type ProductSort } from "@/lib/queries/products";
import { cn } from "@/lib/utils";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse Moral Clean's professional cleaning machines, industrial vacuums, pressure cleaners, scrubber dryers, chemicals, parts, and janitorial equipment in Pakistan.",
  openGraph: {
    title: "Products | Moral Clean",
    description:
      "Browse Moral Clean's professional cleaning machines, industrial vacuums, pressure cleaners, scrubber dryers, chemicals, parts, and janitorial equipment in Pakistan.",
  },
  alternates: {
    canonical: `${siteUrl}/products`,
  },
};

type ProductsPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

const sortOptions: Array<{ label: string; value: ProductSort }> = [
  { label: "Featured", value: "featured" },
  { label: "Name A-Z", value: "name-az" },
  { label: "Newest", value: "newest" },
];

function getParam(
  searchParams: ProductsPageProps["searchParams"],
  key: string,
) {
  const value = searchParams?.[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function createProductsHref(
  searchParams: ProductsPageProps["searchParams"],
  updates: Record<string, string | number | undefined>,
) {
  const params = new URLSearchParams();

  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    const normalized = Array.isArray(value) ? value[0] : value;

    if (normalized) {
      params.set(key, normalized);
    }
  });

  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === "" || value === 1) {
      params.delete(key);
      return;
    }

    params.set(key, String(value));
  });

  const query = params.toString();

  return query ? `/products?${query}` : "/products";
}

function HiddenFilterInputs({
  category,
  brand,
  tag,
  sort,
}: {
  category?: string;
  brand?: string;
  tag?: string;
  sort?: string;
}) {
  return (
    <>
      {category ? <input type="hidden" name="category" value={category} /> : null}
      {brand ? <input type="hidden" name="brand" value={brand} /> : null}
      {tag ? <input type="hidden" name="tag" value={tag} /> : null}
      {sort ? <input type="hidden" name="sort" value={sort} /> : null}
    </>
  );
}

function Pagination({
  page,
  pageCount,
  searchParams,
}: {
  page: number;
  pageCount: number;
  searchParams: ProductsPageProps["searchParams"];
}) {
  if (pageCount <= 1) {
    return null;
  }

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
      aria-label="Products pagination"
    >
      {page > 1 ? (
        <Button asChild variant="outline" size="sm">
          <Link href={createProductsHref(searchParams, { page: page - 1 })}>
            Previous
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
      )}

      {pages.map((pageNumber) => (
        <Button
          key={pageNumber}
          asChild={pageNumber !== page}
          variant={pageNumber === page ? "default" : "outline"}
          size="sm"
          className={cn(pageNumber === page && "bg-primary text-primary-foreground")}
        >
          {pageNumber === page ? (
            <span>{pageNumber}</span>
          ) : (
            <Link href={createProductsHref(searchParams, { page: pageNumber })}>
              {pageNumber}
            </Link>
          )}
        </Button>
      ))}

      {page < pageCount ? (
        <Button asChild variant="outline" size="sm">
          <Link href={createProductsHref(searchParams, { page: page + 1 })}>
            Next
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          Next
        </Button>
      )}
    </nav>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const category = getParam(searchParams, "category");
  const brand = getParam(searchParams, "brand");
  const tag = getParam(searchParams, "tag");
  const q = getParam(searchParams, "q");
  const sort = getParam(searchParams, "sort") ?? "featured";
  const page = getParam(searchParams, "page") ?? "1";

  const result = await getProducts({
    category,
    brand,
    tag,
    q,
    sort,
    page,
  });

  const activeFilters = {
    category,
    brand,
    tag,
    q,
    sort: sort === "featured" ? undefined : sort,
  };
  const activeSort =
    sortOptions.find((option) => option.value === sort)?.label ?? "Featured";

  return (
    <>
      <section className="bg-muted py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="inline-flex items-center gap-1 hover:text-primary">
              <Home className="size-4" aria-hidden="true" />
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-foreground">Products</span>
          </nav>
          <h1>Our Products</h1>
          <p className="mt-4 max-w-3xl text-base text-muted-foreground sm:text-lg">
            Browse professional cleaning equipment for commercial sites,
            factories, hospitals, hotels, warehouses, and cleaning service
            operators across Pakistan.
          </p>
        </div>
      </section>

      <section className="bg-background py-12">
        <div className="mx-auto flex max-w-7xl gap-8 px-4 sm:px-6 lg:px-8">
          <ProductFilters
            categories={result.categories}
            categoryCounts={result.categoryCounts}
            brands={result.brands}
            tags={result.tags}
            activeFilters={activeFilters}
            className="sticky top-28 hidden h-fit w-[280px] shrink-0 rounded-md border border-border bg-white p-5 lg:block"
          />

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-col gap-4 rounded-md border border-border bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-primary">
                  Showing {result.products.length} of {result.totalCount} products
                </p>
                {result.usingSeedData ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Displaying seeded catalog data until Supabase products are
                    added.
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <SlidersHorizontal className="size-4" aria-hidden="true" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="overflow-y-auto">
                    <SheetHeader className="mb-6 text-left">
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <ProductFilters
                      categories={result.categories}
                      categoryCounts={result.categoryCounts}
                      brands={result.brands}
                      tags={result.tags}
                      activeFilters={activeFilters}
                    />
                  </SheetContent>
                </Sheet>

                <form action="/products" className="flex min-w-0 gap-2" method="get">
                  <HiddenFilterInputs
                    category={category}
                    brand={brand}
                    tag={tag}
                    sort={sort === "featured" ? undefined : sort}
                  />
                  <div className="relative min-w-0 flex-1 sm:w-72">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      name="q"
                      defaultValue={q}
                      placeholder="Search products"
                      className="pl-9"
                    />
                  </div>
                  <Button type="submit" className="bg-primary text-primary-foreground">
                    Search
                  </Button>
                </form>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="justify-between sm:w-40">
                      {activeSort}
                      <ChevronDown className="size-4" aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    {sortOptions.map((option) => (
                      <DropdownMenuItem key={option.value} asChild>
                        <Link
                          href={createProductsHref(searchParams, {
                            sort:
                              option.value === "featured"
                                ? undefined
                                : option.value,
                            page: undefined,
                          })}
                          className={cn(
                            option.value === sort && "font-semibold text-primary",
                          )}
                        >
                          {option.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <ProductGrid products={result.products} clearHref="/products" />

            <Pagination
              page={result.page}
              pageCount={result.pageCount}
              searchParams={searchParams}
            />
          </div>
        </div>
      </section>
    </>
  );
}
