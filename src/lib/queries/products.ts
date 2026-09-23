import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { env } from "@/config/env";
import { mockCategories, mockProducts, mockTags } from "@/lib/seed-data";
import type {
  Category,
  Database,
  ProductCardData,
  ProductImage,
  ProductWithRelations,
  Tag,
} from "@/lib/types";

export const PRODUCTS_PER_PAGE = 12;

const PUBLIC_CACHE_SECONDS = 900;
const PRODUCT_CARD_SELECT = `
  id,
  slug,
  name,
  short_description,
  category_id,
  brand,
  featured,
  in_stock,
  sort_order,
  created_at,
  images:product_images(id,product_id,url,alt_text,is_primary,sort_order)
`;

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
  products: ProductCardData[];
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

type CategoryWithCount = Category & { product_count: number };

type CatalogFacets = {
  categories: CategoryWithCount[];
  tags: Tag[];
  brands: string[];
  allProductsCount: number;
};

type RawSupabaseProduct = Omit<
  ProductWithRelations,
  "category" | "images" | "tags"
> & {
  category: Category | null;
  images: ProductImage[] | null;
  product_tags:
    | {
        tags: Tag | null;
      }[]
    | null;
};

type RawSupabaseCardProduct = Omit<ProductCardData, "images"> & {
  images: ProductImage[] | null;
  matching_tags?: Array<{ tag_id: string }>;
};

function hasSupabaseConfig() {
  return Boolean(env.supabaseUrl?.trim() && env.supabaseAnonKey?.trim());
}

function createPublicCatalogClient() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  return createSupabaseClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
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
  return Array.from(
    new Set(values.filter((value): value is string => Boolean(value))),
  ).sort((a, b) => a.localeCompare(b));
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

function filterSeedProducts(
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

    return !params.q || productMatchesSearch(product, params.q);
  });
}

function sortSeedProducts(
  products: ProductWithRelations[],
  sort: ProductSort,
) {
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

    return (
      (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name)
    );
  });
}

function toProductCard(product: ProductWithRelations): ProductCardData {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    short_description: product.short_description,
    category_id: product.category_id,
    brand: product.brand,
    featured: product.featured,
    in_stock: product.in_stock,
    sort_order: product.sort_order,
    created_at: product.created_at,
    images: product.images,
  };
}

function normalizeCardProducts(
  products: RawSupabaseCardProduct[],
): ProductCardData[] {
  return products.map((product) => {
    const { images, matching_tags: _matchingTags, ...rest } = product;
    void _matchingTags;

    return {
      ...rest,
      images: [...(images ?? [])].sort(
        (a, b) =>
          Number(b.is_primary) - Number(a.is_primary) ||
          (a.sort_order ?? 0) - (b.sort_order ?? 0),
      ),
    };
  });
}

function normalizeProducts(
  products: RawSupabaseProduct[],
): ProductWithRelations[] {
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

function getSeedFacets(): CatalogFacets {
  const counts = mockProducts.reduce<Record<string, number>>((result, product) => {
    const slug = product.category?.slug;
    if (slug) result[slug] = (result[slug] ?? 0) + 1;
    return result;
  }, {});

  return {
    categories: mockCategories.map((category) => ({
      ...category,
      product_count: counts[category.slug] ?? 0,
    })),
    tags: mockTags,
    brands: uniqueSorted(mockProducts.map((product) => product.brand)),
    allProductsCount: mockProducts.length,
  };
}

async function queryCatalogFacets(): Promise<CatalogFacets | null> {
  const supabase = createPublicCatalogClient();
  if (!supabase) return null;

  const [categoriesResponse, tagsResponse, brandsResponse, countResponse] =
    await Promise.all([
      supabase
        .from("categories")
        .select("*, products:products(count)")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
      supabase.from("tags").select("*").order("name", { ascending: true }),
      supabase.from("products").select("brand").not("brand", "is", null),
      supabase.from("products").select("id", { count: "exact", head: true }),
    ]);

  const error =
    categoriesResponse.error ||
    tagsResponse.error ||
    brandsResponse.error ||
    countResponse.error;
  if (error) {
    console.error("Catalog facets query failed:", error);
    throw new Error("Unable to load the product catalog filters");
  }

  const categories = (categoriesResponse.data ?? []).map((row) => {
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

  return {
    categories,
    tags: tagsResponse.data ?? [],
    brands: uniqueSorted(
      (brandsResponse.data ?? []).map((row) => row.brand),
    ),
    allProductsCount: countResponse.count ?? 0,
  };
}

const getCatalogFacets = unstable_cache(
  queryCatalogFacets,
  ["catalog-facets-v2"],
  { revalidate: PUBLIC_CACHE_SECONDS, tags: ["catalog"] },
);

function quotePostgrestValue(value: string) {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

async function getProductIdsForTags(tagIds: string[]) {
  if (tagIds.length === 0) return [];
  const supabase = createPublicCatalogClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("product_tags")
    .select("product_id")
    .in("tag_id", tagIds);

  if (error) throw new Error("Unable to search product tags");
  return Array.from(new Set((data ?? []).map((row) => row.product_id)));
}

async function queryProducts(
  categorySlug: string,
  brand: string,
  tagSlug: string,
  search: string,
  sort: ProductSort,
  page: number,
): Promise<ProductQueryResult> {
  const facets = (await getCatalogFacets()) ?? getSeedFacets();
  const usingSeedData = !hasSupabaseConfig();

  if (usingSeedData) {
    const params = {
      category: categorySlug,
      brand,
      tag: tagSlug,
      q: search,
    };
    const filtered = sortSeedProducts(
      filterSeedProducts(mockProducts, params),
      sort,
    );
    const totalCount = filtered.length;
    const pageCount = Math.max(1, Math.ceil(totalCount / PRODUCTS_PER_PAGE));
    const safePage = Math.min(page, pageCount);
    const start = (safePage - 1) * PRODUCTS_PER_PAGE;

    return {
      products: filtered
        .slice(start, start + PRODUCTS_PER_PAGE)
        .map(toProductCard),
      totalCount,
      allProductsCount: facets.allProductsCount,
      page: safePage,
      pageCount,
      perPage: PRODUCTS_PER_PAGE,
      categories: facets.categories,
      categoryCounts: Object.fromEntries(
        facets.categories.map((category) => [
          category.slug,
          category.product_count,
        ]),
      ),
      brands: facets.brands,
      tags: facets.tags,
      usingSeedData: true,
    };
  }

  const supabase = createPublicCatalogClient()!;
  const category = categorySlug
    ? facets.categories.find((item) => item.slug === categorySlug)
    : undefined;
  const tag = tagSlug
    ? facets.tags.find((item) => item.slug === tagSlug)
    : undefined;

  if ((categorySlug && !category) || (tagSlug && !tag)) {
    return {
      products: [],
      totalCount: 0,
      allProductsCount: facets.allProductsCount,
      page: 1,
      pageCount: 1,
      perPage: PRODUCTS_PER_PAGE,
      categories: facets.categories,
      categoryCounts: Object.fromEntries(
        facets.categories.map((item) => [item.slug, item.product_count]),
      ),
      brands: facets.brands,
      tags: facets.tags,
      usingSeedData: false,
    };
  }

  const normalizedSearch = search.trim();
  const lowercaseSearch = normalizedSearch.toLowerCase();
  const matchingCategoryIds = normalizedSearch
    ? facets.categories
        .filter((item) => item.name.toLowerCase().includes(lowercaseSearch))
        .map((item) => item.id)
    : [];
  const matchingTagIds = normalizedSearch
    ? facets.tags
        .filter((item) => item.name.toLowerCase().includes(lowercaseSearch))
        .map((item) => item.id)
    : [];
  const matchingTagProductIds = await getProductIdsForTags(matchingTagIds);

  const select = tag
    ? `${PRODUCT_CARD_SELECT}, matching_tags:product_tags!inner(tag_id)`
    : PRODUCT_CARD_SELECT;
  let query = supabase.from("products").select(select, { count: "exact" });

  if (category) query = query.eq("category_id", category.id);
  if (brand) query = query.eq("brand", brand);
  if (tag) query = query.eq("matching_tags.tag_id", tag.id);

  if (normalizedSearch) {
    const pattern = quotePostgrestValue(`%${normalizedSearch}%`);
    const filters = [
      `name.ilike.${pattern}`,
      `short_description.ilike.${pattern}`,
      `brand.ilike.${pattern}`,
      `model_code.ilike.${pattern}`,
    ];

    if (matchingCategoryIds.length > 0) {
      filters.push(`category_id.in.(${matchingCategoryIds.join(",")})`);
    }
    if (matchingTagProductIds.length > 0) {
      filters.push(`id.in.(${matchingTagProductIds.join(",")})`);
    }
    query = query.or(filters.join(","));
  }

  if (sort === "name-az") {
    query = query.order("name", { ascending: true });
  } else if (sort === "newest") {
    query = query.order("created_at", { ascending: false });
  } else {
    query = query
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
  }

  const from = (page - 1) * PRODUCTS_PER_PAGE;
  const { data, error, count } = await query.range(
    from,
    from + PRODUCTS_PER_PAGE - 1,
  );

  if (error) {
    console.error("Products query failed:", error);
    throw new Error("Unable to load the product catalog");
  }

  const totalCount = count ?? 0;
  const pageCount = Math.max(1, Math.ceil(totalCount / PRODUCTS_PER_PAGE));

  return {
    products: normalizeCardProducts(
      (data ?? []) as unknown as RawSupabaseCardProduct[],
    ),
    totalCount,
    allProductsCount: facets.allProductsCount,
    page: Math.min(page, pageCount),
    pageCount,
    perPage: PRODUCTS_PER_PAGE,
    categories: facets.categories,
    categoryCounts: Object.fromEntries(
      facets.categories.map((item) => [item.slug, item.product_count]),
    ),
    brands: facets.brands,
    tags: facets.tags,
    usingSeedData: false,
  };
}

const getCachedProducts = unstable_cache(
  queryProducts,
  ["catalog-products-v2"],
  { revalidate: PUBLIC_CACHE_SECONDS, tags: ["catalog"] },
);

export async function getProducts(
  params: ProductQueryParams = {},
): Promise<ProductQueryResult> {
  return getCachedProducts(
    params.category?.trim() ?? "",
    params.brand?.trim() ?? "",
    params.tag?.trim() ?? "",
    params.q?.trim() ?? "",
    normalizeSort(params.sort),
    normalizePage(params.page),
  );
}

async function queryGetProductBySlug(slug: string) {
  if (!hasSupabaseConfig()) {
    return mockProducts.find((product) => product.slug === slug) ?? null;
  }

  const supabase = createPublicCatalogClient()!;
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

  if (error) throw new Error("Unable to load product");
  if (!data) return null;

  return normalizeProducts([data as unknown as RawSupabaseProduct])[0] ?? null;
}

const getCachedProductBySlug = unstable_cache(
  queryGetProductBySlug,
  ["catalog-product-by-slug-v2"],
  { revalidate: PUBLIC_CACHE_SECONDS, tags: ["catalog"] },
);

export const getProductBySlug = cache(getCachedProductBySlug);

async function queryRelatedProducts(
  productId: string,
  categoryId: string,
  limit: number,
) {
  if (!hasSupabaseConfig()) {
    return mockProducts
      .filter(
        (product) =>
          product.id !== productId && product.category_id === categoryId,
      )
      .sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          (a.sort_order ?? 0) - (b.sort_order ?? 0),
      )
      .slice(0, limit)
      .map(toProductCard);
  }

  const supabase = createPublicCatalogClient()!;
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_CARD_SELECT)
    .eq("category_id", categoryId)
    .neq("id", productId)
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error) throw new Error("Unable to load related products");
  return normalizeCardProducts(
    (data ?? []) as unknown as RawSupabaseCardProduct[],
  );
}

const getCachedRelatedProducts = unstable_cache(
  queryRelatedProducts,
  ["catalog-related-products-v2"],
  { revalidate: PUBLIC_CACHE_SECONDS, tags: ["catalog"] },
);

export function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit = 4,
) {
  return getCachedRelatedProducts(
    productId,
    categoryId,
    Math.max(1, Math.min(12, Math.floor(limit))),
  );
}

async function queryProductSlugs() {
  if (!hasSupabaseConfig()) {
    return mockProducts.map((product) => product.slug);
  }

  const supabase = createPublicCatalogClient()!;
  const { data, error } = await supabase.from("products").select("slug");
  if (error) throw new Error("Unable to load product URLs");
  return (data ?? []).map((product) => product.slug);
}

export const getProductSlugs = unstable_cache(
  queryProductSlugs,
  ["catalog-product-slugs-v2"],
  { revalidate: PUBLIC_CACHE_SECONDS, tags: ["catalog"] },
);
