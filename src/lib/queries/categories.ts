import "server-only";
import { isRetiredCategory } from "@/content/categories";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { env } from "@/config/env";
import {
  getProducts,
  PRODUCTS_PER_PAGE,
  type ProductSort,
} from "@/lib/queries/products";
import { mockCategories, mockProducts } from "@/lib/seed-data";
import type { Category, Database } from "@/lib/types";

export const CATEGORY_PRODUCTS_PER_PAGE = PRODUCTS_PER_PAGE;

export type CategoryProductSort = ProductSort;

export type CategoryProductQueryOptions = {
  page?: string | number;
  sort?: string;
  brand?: string;
  tag?: string;
};

export type CategoryWithCount = Category & {
  product_count: number;
};

function createPublicCatalogClient() {
  if (!env.supabaseUrl?.trim() || !env.supabaseAnonKey?.trim()) {
    return null;
  }

  return createSupabaseClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function getSeedCategories(): CategoryWithCount[] {
  const categoryCounts = mockProducts.reduce<Record<string, number>>(
    (counts, product) => {
      const slug = product.category?.slug;
      if (slug) counts[slug] = (counts[slug] ?? 0) + 1;
      return counts;
    },
    {},
  );

  return [...mockCategories]
    .sort(
      (a, b) =>
        (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
        a.name.localeCompare(b.name),
    )
    .map((category) => ({
      ...category,
      product_count: categoryCounts[category.slug] ?? 0,
    }));
}

async function queryAllCategories(): Promise<CategoryWithCount[]> {
  const supabase = createPublicCatalogClient();
  if (!supabase) return getSeedCategories();

  const { data, error } = await supabase
    .from("categories")
    .select("*, products:products(count)")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error("Unable to load categories");

  return (data ?? []).map((row) => {
    const productsCountRow = Array.isArray(row.products) ? row.products[0] : null;
    const productCount =
      productsCountRow &&
      typeof productsCountRow === "object" &&
      "count" in productsCountRow &&
      typeof productsCountRow.count === "number"
        ? productsCountRow.count
        : 0;
    const { products: _products, ...category } = row;
    void _products;

    return { ...category, product_count: productCount } as CategoryWithCount;
  });
}

const getCachedAllCategories = unstable_cache(
  queryAllCategories,
  ["catalog-categories-v2"],
  { revalidate: 900, tags: ["catalog"] },
);

export const getAllCategories = cache(async () =>
  (await getCachedAllCategories()).filter((category) => !isRetiredCategory(category.slug)),
);

export const getCategoryModels = unstable_cache(async (categoryId: string) => {
  const supabase = createPublicCatalogClient();
  if (!supabase) return mockProducts.filter((product) => product.category_id === categoryId);
  const { data, error } = await supabase.from("products")
    .select("slug,name,model_code,specifications").eq("category_id", categoryId)
    .order("name").limit(50);
  if (error) throw new Error("Unable to load model comparison");
  return data ?? [];
}, ["category-model-comparison-v1"], { revalidate: 900, tags: ["catalog"] });

export async function getCategoryBySlug(
  slug: string,
): Promise<CategoryWithCount | null> {
  const categories = await getAllCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getProductsByCategory(
  categoryId: string,
  options: CategoryProductQueryOptions,
) {
  const categories = await getAllCategories();
  const category = categories.find((item) => item.id === categoryId);

  if (!category) {
    return {
      products: [],
      totalCount: 0,
      page: 1,
      pageCount: 1,
      perPage: CATEGORY_PRODUCTS_PER_PAGE,
      brands: [],
      tags: [],
    };
  }

  const result = await getProducts({
    category: category.slug,
    brand: options.brand,
    tag: options.tag,
    sort: options.sort,
    page: options.page,
  });

  return {
    products: result.products,
    totalCount: result.totalCount,
    page: result.page,
    pageCount: result.pageCount,
    perPage: result.perPage,
    brands: result.brands,
    tags: result.tags,
  };
}
