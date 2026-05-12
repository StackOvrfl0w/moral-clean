import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { mockCategories, mockProducts } from "@/lib/seed-data";
import type {
  Category,
  Database,
  ProductImage,
  ProductWithRelations,
  Tag,
} from "@/lib/types";

export const CATEGORY_PRODUCTS_PER_PAGE = 12;

export type CategoryProductSort = "featured" | "name-az" | "newest";

export type CategoryProductQueryOptions = {
  page?: string | number;
  sort?: string;
  brand?: string;
  tag?: string;
};

export type CategoryWithCount = Category & {
  product_count: number;
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
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
  );
}

function createPublicCatalogClient() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

function normalizeSort(sort?: string): CategoryProductSort {
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

function sortProducts(
  products: ProductWithRelations[],
  sort: CategoryProductSort,
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

    return (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name);
  });
}

function getSeedCategoryCounts() {
  return mockProducts.reduce<Record<string, number>>((counts, product) => {
    const slug = product.category?.slug;

    if (!slug) {
      return counts;
    }

    counts[slug] = (counts[slug] ?? 0) + 1;
    return counts;
  }, {});
}

function getSeedCategories(): CategoryWithCount[] {
  const categoryCounts = getSeedCategoryCounts();

  return [...mockCategories]
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((category) => ({
      ...category,
      product_count: categoryCounts[category.slug] ?? 0,
    }));
}

export async function getAllCategories(): Promise<CategoryWithCount[]> {
  const supabase = createPublicCatalogClient();

  if (!supabase) {
    return getSeedCategories();
  }
  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      *,
      products:products(count)
    `,
    )
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error || !data) {
    return getSeedCategories();
  }

  return data.map((row) => {
    const productsCountRow = Array.isArray(row.products) ? row.products[0] : null;

    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description,
      image_url: row.image_url,
      parent_id: row.parent_id,
      sort_order: row.sort_order,
      created_at: row.created_at,
      product_count:
        productsCountRow &&
        typeof productsCountRow === "object" &&
        "count" in productsCountRow &&
        typeof productsCountRow.count === "number"
          ? productsCountRow.count
          : 0,
    };
  });
}

export async function getCategoryBySlug(slug: string): Promise<CategoryWithCount | null> {
  const categories = await getAllCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getProductsByCategory(
  categoryId: string,
  options: CategoryProductQueryOptions,
) {
  const sort = normalizeSort(options.sort);
  const page = normalizePage(options.page);

  if (!hasSupabaseConfig()) {
    const filtered = mockProducts.filter((product) => {
      if (product.category_id !== categoryId) {
        return false;
      }

      if (options.brand && product.brand !== options.brand) {
        return false;
      }

      if (options.tag && !product.tags.some((tag) => tag.slug === options.tag)) {
        return false;
      }

      return true;
    });

    const sorted = sortProducts(filtered, sort);
    const totalCount = sorted.length;
    const pageCount = Math.max(1, Math.ceil(totalCount / CATEGORY_PRODUCTS_PER_PAGE));
    const safePage = Math.min(page, pageCount);
    const start = (safePage - 1) * CATEGORY_PRODUCTS_PER_PAGE;

    return {
      products: sorted.slice(start, start + CATEGORY_PRODUCTS_PER_PAGE),
      totalCount,
      page: safePage,
      pageCount,
      perPage: CATEGORY_PRODUCTS_PER_PAGE,
    };
  }

  const supabase = createPublicCatalogClient();

  if (!supabase) {
    return {
      products: [] as ProductWithRelations[],
      totalCount: 0,
      page: 1,
      pageCount: 1,
      perPage: CATEGORY_PRODUCTS_PER_PAGE,
    };
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
      { count: "exact" },
    )
    .eq("category_id", categoryId)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error || !data) {
    const seedFallback = mockProducts.filter((product) => product.category_id === categoryId);
    const sortedSeed = sortProducts(seedFallback, sort);
    const totalCount = sortedSeed.length;
    const pageCount = Math.max(1, Math.ceil(totalCount / CATEGORY_PRODUCTS_PER_PAGE));
    const safePage = Math.min(page, pageCount);
    const start = (safePage - 1) * CATEGORY_PRODUCTS_PER_PAGE;

    return {
      products: sortedSeed.slice(start, start + CATEGORY_PRODUCTS_PER_PAGE),
      totalCount,
      page: safePage,
      pageCount,
      perPage: CATEGORY_PRODUCTS_PER_PAGE,
    };
  }

  const normalized = normalizeProducts(data as unknown as RawSupabaseProduct[]);
  const filtered = normalized.filter((product) => {
    if (options.brand && product.brand !== options.brand) {
      return false;
    }

    if (options.tag && !product.tags.some((tag) => tag.slug === options.tag)) {
      return false;
    }

    return true;
  });
  const sorted = sortProducts(filtered, sort);
  const totalCount = sorted.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / CATEGORY_PRODUCTS_PER_PAGE));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * CATEGORY_PRODUCTS_PER_PAGE;

  return {
    products: sorted.slice(start, start + CATEGORY_PRODUCTS_PER_PAGE),
    totalCount,
    page: safePage,
    pageCount,
    perPage: CATEGORY_PRODUCTS_PER_PAGE,
  };
}
