import { categoryAdvice, isIndexableCategory } from "@/content/categories";
import { CategoryBuyingAdvice } from "@/components/products/CategoryBuyingAdvice";
import { listingMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Home } from "lucide-react";
import { CategorySortDropdown } from "@/components/products/CategorySortDropdown";

import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPaginationItems } from "@/lib/pagination";
import {
  getAllCategories,
  getCategoryBySlug,
  getProductsByCategory,
  type CategoryProductSort,
} from "@/lib/queries/categories";
import { cn } from "@/lib/utils";

import { RelatedProductsCarousel } from "@/components/products/RelatedProductsCarousel";

export const revalidate = 3600;

type CategoryPageProps = {
  params: {
    slug: string;
  };
  searchParams?: Record<string, string | string[] | undefined>;
};

const sortOptions: Array<{ label: string; value: CategoryProductSort }> = [
  { label: "Featured", value: "featured" },
  { label: "Name A-Z", value: "name-az" },
  { label: "Newest", value: "newest" },
];

function getParam(
  searchParams: CategoryPageProps["searchParams"],
  key: string,
) {
  const value = searchParams?.[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function createCategoryHref(
  slug: string,
  updates: Record<string, string | number | undefined> = {},
) {
  const params = new URLSearchParams();

  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === "" || value === 1) {
      params.delete(key);
      return;
    }

    params.set(key, String(value));
  });

  const query = params.toString();

  return query
    ? `/products/category/${slug}?${query}`
    : `/products/category/${slug}`;
}

function CategoryPagination({
  slug,
  page,
  pageCount,
  sort,
}: {
  slug: string;
  page: number;
  pageCount: number;
  sort?: string;
}) {
  if (pageCount <= 1) {
    return null;
  }

  const pages = getPaginationItems(page, pageCount);

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
      aria-label="Category products pagination"
    >
      {page > 1 ? (
        <Button asChild variant="outline" size="sm">
          <Link href={createCategoryHref(slug, { page: page - 1, sort })}>
            Previous
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
      )}

      {pages.map((pageNumber) =>
        typeof pageNumber === "string" ? (
          <span key={pageNumber} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
        <Button
          key={pageNumber}
          asChild={pageNumber !== page}
          variant={pageNumber === page ? "default" : "outline"}
          size="sm"
          className={cn(
            pageNumber === page && "bg-primary text-primary-foreground",
          )}
        >
          {pageNumber === page ? (
            <span>{pageNumber}</span>
          ) : (
            <Link href={createCategoryHref(slug, { page: pageNumber, sort })}>
              {pageNumber}
            </Link>
          )}
        </Button>
        ),
      )}

      {page < pageCount ? (
        <Button asChild variant="outline" size="sm">
          <Link href={createCategoryHref(slug, { page: page + 1, sort })}>
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

export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();
  const requestedPage = Number(getParam(searchParams, "page") || 1);
  if (requestedPage > 1) {
    const result = await getProductsByCategory(category.id, {
      page: requestedPage,
      sort: getParam(searchParams, "sort"),
      brand: getParam(searchParams, "brand"),
      tag: getParam(searchParams, "tag"),
    });
    if (requestedPage > result.pageCount) notFound();
  }
  const suppliedDescription = category.description?.replace(/\s+/g, " ").trim();
  return listingMetadata(
    categoryAdvice[category.slug]?.title || `${category.name} in Pakistan`,
    categoryAdvice[category.slug]?.intro || (suppliedDescription && suppliedDescription.length >= 60
      ? suppliedDescription
      : `Browse ${category.name.toLowerCase()} for commercial facilities in Pakistan. Compare specifications and request equipment, parts and service from Moral Clean.`),
    `/products/category/${category.slug}`, searchParams, !isIndexableCategory(category.slug, category.product_count),
  );
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const page = getParam(searchParams, "page") ?? "1";
  const sort = getParam(searchParams, "sort") ?? "featured";
  const brand = getParam(searchParams, "brand");
  const tag = getParam(searchParams, "tag");
  const productsResult = await getProductsByCategory(category.id, {
    page,
    sort,
    brand,
    tag,
  });
  if (Number(page) > productsResult.pageCount) notFound();

  const allCategories = await getAllCategories();
  const relatedProducts = productsResult.products.slice(0, 6);
  const activeSort =
    sortOptions.find((option) => option.value === sort)?.label ?? "Featured";

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Products", url: "/products" },
          { name: category.name, url: `/products/category/${category.slug}` },
        ]}
      />
      <section className="relative overflow-hidden py-20 text-white">
        {/* Replace this gradient with a real category hero image when assets are available. */}
        <div className="absolute inset-0 bg-brand-gradient opacity-90" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-white">{category.name}</h1>
          <nav
            className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-white/70"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-white/85 hover:text-white"
            >
              <Home className="size-4" aria-hidden="true" />
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/products" className="text-white/85 hover:text-white">
              Products
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white/70">{category.name}</span>
          </nav>
        </div>
      </section>

      <section className="bg-background py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
          <ProductFilters
            categories={allCategories}
            categoryCounts={Object.fromEntries(
              allCategories.map((c) => [c.slug, c.product_count]),
            )}
            brands={productsResult.brands}
            tags={productsResult.tags}
            activeFilters={{
              category: category.slug,
              brand,
              tag,
              sort: sort === "featured" ? undefined : sort,
            }}
            className="sticky top-28 hidden h-fit w-[280px] shrink-0 rounded-md border border-border bg-white p-5 lg:block"
          />

          <div className="min-w-0">
            <div className="mb-6 rounded-md border border-border bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                Browse Category
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-3xl">{category.name}</h2>
                <Badge variant="secondary" className="bg-muted text-primary">
                  {category.slug === "steam-cleaners" && category.product_count === 0 ? "Models by enquiry" : `${productsResult.totalCount} Products`}
                </Badge>
              </div>
              <p className="mt-4 text-muted-foreground">
                {categoryAdvice[category.slug]?.intro || (category.description === "Description" ? null : category.description) ||
                  (category.product_count > 0 ? `Browse ${category.name} and request a quotation for your facility requirements.` : "No products are currently listed in this category. Contact Moral Clean to confirm the current range before ordering.")}
              </p>
            </div>

            <div className="mb-6 flex justify-end">
              <CategorySortDropdown
                slug={category.slug}
                activeSort={activeSort}
                currentSort={sort}
              />
            </div>

            {productsResult.products.length > 0 ? (
              <div className="grid grid-cols-2 gap-5 xl:grid-cols-3">
                {productsResult.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/50 px-6 text-center">
                <h3 className="text-xl">
                  {category.slug === "steam-cleaners" ? "Request a steam cleaner recommendation" : brand || tag ? "No products match these filters" : "Catalogue details are being updated"}
                </h3>
                <Link
                  href={category.slug === "steam-cleaners" ? "/contact?subject=Product+Inquiry&category=steam-cleaners" : "/products"}
                  className="mt-4 text-sm font-semibold text-primary hover:text-accent"
                >
                  {category.slug === "steam-cleaners" ? "Discuss your surface and cleaning requirements" : "Browse all products"}
                </Link>
              </div>
            )}

            <CategoryPagination
              slug={category.slug}
              page={productsResult.page}
              pageCount={productsResult.pageCount}
              sort={sort === "featured" ? undefined : sort}
            />
          </div>
        </div>
      </section>

      <CategoryBuyingAdvice slug={category.slug} categoryId={category.id} />
      {relatedProducts.length > 0 ? (
        <section className="bg-muted py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-2xl">Related Products</h2>
            <RelatedProductsCarousel products={relatedProducts} />
          </div>
        </section>
      ) : null}
    </>
  );
}
