import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { env } from "@/config/env";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import {
  mockCategories,
  mockProducts,
  mockTags,
} from "@/lib/seed-data";
import type {
  Category,
  Database,
  ProductImage,
  ProductWithRelations,
  Tag,
} from "@/lib/types";

export const PRODUCTS_PER_PAGE = 12;

export type ProductSort = "featured" | "name-az" | "newest";

export type ProductQueryParams = {
  category?: string;
  brand?: string;
  tag?: string;
  q?: string;
  sort?: string;
  page?: string | number;
};

export type ProductQueryResult = {
  products: ProductWithRelations[];
  totalCount: number;
  allProductsCount: number;
  page: number;
  pageCount: number;
  perPage: number;
  categories: Category[];
  categoryCounts: Record<string, number>;
  brands: string[];
  tags: Tag[];
  usingSeedData: boolean;
};

type RawSupabaseProduct = Omit<ProductWithRelations, "category" | "images" | "tags"> & {
  category: Category | null;
  images: ProductImage[] | null;
  product_tags:
    | {
        tags: Tag | null;
      }[]
    | null;
};

function hasSupabaseConfig() {
  return Boolean(env.supabaseUrl?.trim() && env.supabaseAnonKey?.trim());
}

function createPublicCatalogClient() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  return createSupabaseClient<Database>(
    env.supabaseUrl,
    env.supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

function normalizeSort(sort?: string): ProductSort {
  if (sort === "name-az" || sort === "newest") {
    return sort;
  }

  return "featured";
}

function normalizePage(page?: string | number) {
  const value = Number(page ?? 1);

  if (!Number.isFinite(value) || value < 1) {
    return 1;
  }

  return Math.floor(value);
}

function uniqueSorted(values: Array<string | null>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))))
    .sort((a, b) => a.localeCompare(b));
}

function productMatchesSearch(product: ProductWithRelations, query: string) {
  const value = query.trim().toLowerCase();

  if (!value) {
    return true;
  }

  return [
    product.name,
    product.short_description,
    product.brand,
    product.model_code,
    product.category?.name,
    ...product.tags.map((tag) => tag.name),
  ]
    .filter(Boolean)
    .some((item) => item?.toLowerCase().includes(value));
}

function filterProducts(
  products: ProductWithRelations[],
  params: ProductQueryParams,
) {
  return products.filter((product) => {
    if (params.category && product.category?.slug !== params.category) {
      return false;
    }

    if (params.brand && product.brand !== params.brand) {
      return false;
    }

    if (params.tag && !product.tags.some((tag) => tag.slug === params.tag)) {
      return false;
    }

    if (params.q && !productMatchesSearch(product, params.q)) {
      return false;
    }

    return true;
  });
}

function sortProducts(products: ProductWithRelations[], sort: ProductSort) {
  return [...products].sort((a, b) => {
    if (sort === "name-az") {
      return a.name.localeCompare(b.name);
    }

    if (sort === "newest") {
      return (b.created_at ?? "").localeCompare(a.created_at ?? "");
    }

    const featuredDelta = Number(b.featured) - Number(a.featured);

    if (featuredDelta !== 0) {
      return featuredDelta;
    }

    return (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name);
  });
}

function buildCategoryCounts(products: ProductWithRelations[]) {
  return products.reduce<Record<string, number>>((counts, product) => {
    const slug = product.category?.slug;

    if (!slug) {
      return counts;
    }

    counts[slug] = (counts[slug] ?? 0) + 1;
    return counts;
  }, {});
}

function normalizeProducts(products: RawSupabaseProduct[]): ProductWithRelations[] {
  return products.map((product) => {
    const { product_tags, images, ...rest } = product;

    return {
      ...rest,
      images: [...(images ?? [])].sort(
        (a, b) =>
          Number(b.is_primary) - Number(a.is_primary) ||
          (a.sort_order ?? 0) - (b.sort_order ?? 0),
      ),
      tags: (product_tags ?? [])
        .map((item) => item.tags)
        .filter((tag): tag is Tag => Boolean(tag))
        .sort((a, b) => a.name.localeCompare(b.name)),
    };
  });
}

function findSeedProductBySlug(slug: string) {
  return mockProducts.find((product) => product.slug === slug) ?? null;
}

function getSeedRelatedProducts(
  productId: string,
  categoryId: string,
  limit: number,
) {
  return mockProducts
    .filter(
      (product) =>
        product.id !== productId && product.category_id === categoryId,
    )
    .sort((a, b) => {
      const featuredDelta = Number(b.featured) - Number(a.featured);

      if (featuredDelta !== 0) {
        return featuredDelta;
      }

      return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    })
    .slice(0, limit);
}

async function getSupabaseCatalog() {
  if (!hasSupabaseConfig()) {
    console.warn("Supabase env vars are missing; using seeded fallback product data.");
    return null;
  }

  const supabase = createServerSupabaseClient();

  const [categoriesResponse, tagsResponse, productsResponse] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("tags")
      .select("*")
      .order("name", { ascending: true }),
    supabase
      .from("products")
      .select(
        `
          *,
          category:categories(*),
          images:product_images(*),
          product_tags(tags(*))
        `,
      )
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
  ]);

  if (categoriesResponse.error || tagsResponse.error || productsResponse.error) {
    console.warn("Supabase product query failed; using seeded fallback product data.");
    return null;
  }

  const products = normalizeProducts(
    (productsResponse.data ?? []) as unknown as RawSupabaseProduct[],
  );

  return {
    categories: categoriesResponse.data ?? [],
    tags: tagsResponse.data ?? [],
    products,
  };
}

export async function getProducts(
  params: ProductQueryParams,
): Promise<ProductQueryResult> {
  const catalog = await getSupabaseCatalog();
  const usingSeedData = catalog === null;
  const productsSource = catalog?.products ?? mockProducts;
  const categories = catalog?.categories ?? mockCategories;
  const tags = catalog?.tags ?? mockTags;
  const sort = normalizeSort(params.sort);
  const page = normalizePage(params.page);

  const filteredProducts = sortProducts(filterProducts(productsSource, params), sort);
  const totalCount = filteredProducts.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / PRODUCTS_PER_PAGE));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * PRODUCTS_PER_PAGE;
  const products = filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);

  return {
    products,
    totalCount,
    allProductsCount: productsSource.length,
    page: safePage,
    pageCount,
    perPage: PRODUCTS_PER_PAGE,
    categories,
    categoryCounts: buildCategoryCounts(productsSource),
    brands: uniqueSorted(productsSource.map((product) => product.brand)),
    tags,
    usingSeedData,
  };
}

export async function getProductBySlug(slug: string) {
  if (!hasSupabaseConfig()) {
    console.warn("Supabase env vars are missing; using seeded fallback product data.");
    return findSeedProductBySlug(slug);
  }

  const supabase = createPublicCatalogClient();

  if (!supabase) {
    console.warn("Supabase env vars are missing; using seeded fallback product data.");
    return findSeedProductBySlug(slug);
  }
  const { data, error } = await supabase
    .from("products")
    .select(
      `
        *,
        category:categories(*),
        images:product_images(*),
        product_tags(tags(*))
      `,
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.warn(`Supabase product query failed for "${slug}"; checking seeded fallback data.`);
    return findSeedProductBySlug(slug);
  }

  if (!data) return null;

  return normalizeProducts([data as unknown as RawSupabaseProduct])[0] ?? null;
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit = 4,
) {
  if (!hasSupabaseConfig()) {
    return getSeedRelatedProducts(productId, categoryId, limit);
  }

  const supabase = createPublicCatalogClient();

  if (!supabase) {
    return getSeedRelatedProducts(productId, categoryId, limit);
  }

  const { data, error } = await supabase
    .from("products")
    .select(
      `
        *,
        category:categories(*),
        images:product_images(*),
        product_tags(tags(*))
      `,
    )
    .eq("category_id", categoryId)
    .neq("id", productId)
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error) return getSeedRelatedProducts(productId, categoryId, limit);
  if (!data || data.length === 0) return [];

  return normalizeProducts(data as unknown as RawSupabaseProduct[]).slice(
    0,
    limit,
  );
}

export async function getProductSlugs() {
  if (!hasSupabaseConfig()) {
    return mockProducts.map((product) => product.slug);
  }

  const supabase = createPublicCatalogClient();

  if (!supabase) {
    return mockProducts.map((product) => product.slug);
  }

  const { data, error } = await supabase.from("products").select("slug");

  if (error || !data || data.length === 0) {
    return mockProducts.map((product) => product.slug);
  }

  return (data ?? []).map((product) => product.slug);
}
