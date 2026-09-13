// FILE PATH: src/lib/actions/admin/product-csv-import.ts

"use server";

// Hobby plan caps this at 60s regardless of what's set here — do not raise
// past 60 without confirming the plan has changed, the deployment will fail
// to build. Chunking the import client-side (see ProductCsvImporter) is what
// actually makes this scale past a handful of products, this just gives each
// individual chunk full headroom.
// export const maxDuration = 60;

import { revalidatePath } from "next/cache";

import { requireAdminNoRedirect } from "@/lib/auth";
import {
  MAX_PRODUCT_CSV_BYTES,
  MAX_PRODUCT_CSV_ROWS,
  parseProductCsv,
  type ProductCsvImportError,
  type ProductCsvImportResult,
  type ProductCsvRecord,
} from "@/lib/product-csv";
import { createClient } from "@/lib/supabase/server";
import type { Json, Product } from "@/lib/types";
import { slugify } from "@/lib/utils";

const TRUE_VALUES = new Set(["1", "true", "yes", "y", "on", "in stock"]);
const FALSE_VALUES = new Set(["0", "false", "no", "n", "off", "out of stock"]);

type ImportMode = "create" | "upsert";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

type PreparedProductImage = {
  url: string;
  altText: string;
  isPrimary: boolean;
  sortOrder: number;
};

function textOrNull(value: string) {
  const normalized = value.trim();
  return normalized ? normalized : null;
}

function splitList(value: string) {
  return Array.from(
    new Set(
      value
        .split(/[|;]/)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

// Use for anything where position matters and must stay aligned with a
// parallel list (image sources vs. their alt texts). Never dedupes — an
// admin may legitimately reuse the same image twice in a gallery, and
// deduping would silently desync the images/alts count and produce a false
// "more alts than images" error.
function splitOrderedList(value: string) {
  return value
    .split(/[|;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseBoolean(value: string, fallback: boolean) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return { value: fallback, error: null as string | null };
  if (TRUE_VALUES.has(normalized))
    return { value: true, error: null as string | null };
  if (FALSE_VALUES.has(normalized))
    return { value: false, error: null as string | null };
  return {
    value: fallback,
    error: `Invalid yes/no value "${value}". Use yes/no, true/false, or 1/0.`,
  };
}

function parseSortOrder(value: string, fallback: number) {
  if (!value.trim()) return { value: fallback, error: null as string | null };
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    return {
      value: fallback,
      error: `Sort order "${value}" must be a whole number.`,
    };
  }
  return { value: parsed, error: null as string | null };
}

function parseSpecifications(value: string): {
  value: Json;
  error: string | null;
} {
  const normalized = value.trim();
  if (!normalized) return { value: {}, error: null };

  if (normalized.startsWith("{")) {
    try {
      const parsed = JSON.parse(normalized) as Json;
      if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
        return {
          value: {},
          error:
            'Specifications JSON must be an object, for example {"Power":"1200 W"}.',
        };
      }
      return { value: parsed, error: null };
    } catch {
      return { value: {}, error: "Specifications contains invalid JSON." };
    }
  }

  const result: Record<string, string> = {};
  for (const item of normalized.split("|")) {
    const entry = item.trim();
    if (!entry) continue;
    const separatorIndex = entry.includes("=")
      ? entry.indexOf("=")
      : entry.indexOf(":");

    if (separatorIndex <= 0) {
      return {
        value: {},
        error: `Invalid specification "${entry}". Use Label=Value and separate specifications with |.`,
      };
    }

    const key = entry.slice(0, separatorIndex).trim();
    const specValue = entry.slice(separatorIndex + 1).trim();
    if (!key || !specValue) {
      return {
        value: {},
        error: `Invalid specification "${entry}". Both label and value are required.`,
      };
    }
    result[key] = specValue;
  }

  return { value: result, error: null };
}

function validateImageKitUrl(source: string) {
  let url: URL;
  try {
    url = new URL(source);
  } catch {
    return { url: null, error: `Invalid image URL "${source}".` };
  }

  if (url.protocol !== "https:" || url.hostname !== "ik.imagekit.io") {
    return {
      url: null,
      error:
        "Image URLs must use the standard HTTPS ImageKit domain (https://ik.imagekit.io/...). Upload the image using the importer's image picker to get a valid URL.",
    };
  }

  return { url: url.toString(), error: null };
}

/**
 * By the time a CSV reaches this action, every image reference is already a
 * real ImageKit URL — the browser uploads files directly to ImageKit before
 * submitting, since Vercel Functions cap request bodies at 4.5 MB and product
 * photos routinely exceed that. This function only validates the URLs.
 */
function prepareImageUrls(imageValue: string): {
  urls: string[];
  error: string | null;
} {
  const sources = splitOrderedList(imageValue);
  const urls: string[] = [];

  for (const source of sources) {
    const checked = validateImageKitUrl(source);
    if (checked.error || !checked.url) {
      return { urls: [], error: checked.error ?? "Invalid image URL." };
    }
    urls.push(checked.url);
  }

  return { urls, error: null };
}

async function replaceProductImages(
  productId: string,
  images: PreparedProductImage[],
) {
  const supabase = createClient();
  const { error: deleteError } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", productId);
  if (deleteError) throw new Error(deleteError.message);

  if (images.length === 0) return;

  const { error } = await supabase.from("product_images").insert(
    images.map((image) => ({
      product_id: productId,
      url: image.url,
      alt_text: image.altText,
      is_primary: image.isPrimary,
      sort_order: image.sortOrder,
    })),
  );

  if (error) throw new Error(error.message);
}

async function replaceProductTags(
  productId: string,
  tagNames: string[],
  tagCache: Map<string, string>,
) {
  const supabase = createClient();
  const { error: deleteError } = await supabase
    .from("product_tags")
    .delete()
    .eq("product_id", productId);
  if (deleteError) throw new Error(deleteError.message);

  if (tagNames.length === 0) return;

  const tagIds: string[] = [];
  for (const tagName of tagNames) {
    const tagSlug = slugify(tagName);
    if (!tagSlug) continue;

    let tagId = tagCache.get(tagSlug);
    if (!tagId) {
      const { data: existing, error: findError } = await supabase
        .from("tags")
        .select("id")
        .eq("slug", tagSlug)
        .maybeSingle();
      if (findError) throw new Error(findError.message);

      if (existing?.id) {
        tagId = existing.id;
      } else {
        const { data: created, error: createError } = await supabase
          .from("tags")
          .insert({ slug: tagSlug, name: tagName })
          .select("id")
          .single();
        if (createError || !created) {
          throw new Error(
            createError?.message ?? `Unable to create tag "${tagName}".`,
          );
        }
        tagId = created.id;
      }
      if (!tagId) throw new Error(`Unable to resolve tag "${tagName}".`);
      tagCache.set(tagSlug, tagId);
    }
    if (!tagId) throw new Error(`Unable to resolve tag "${tagName}".`);
    tagIds.push(tagId);
  }

  if (tagIds.length === 0) return;
  const { error } = await supabase.from("product_tags").insert(
    tagIds.map((tagId) => ({
      product_id: productId,
      tag_id: tagId,
    })),
  );
  if (error) throw new Error(error.message);
}

function categoryMaps(categories: CategoryOption[]) {
  const byName = new Map<string, CategoryOption>();
  const bySlug = new Map<string, CategoryOption>();
  for (const category of categories) {
    byName.set(category.name.trim().toLowerCase(), category);
    bySlug.set(category.slug.trim().toLowerCase(), category);
  }
  return { byName, bySlug };
}

async function resolveCategory(
  rawValue: string,
  createMissing: boolean,
  categories: CategoryOption[],
) {
  const value = rawValue.trim();
  if (!value) return null;

  const maps = categoryMaps(categories);
  const existing =
    maps.byName.get(value.toLowerCase()) ??
    maps.bySlug.get(value.toLowerCase());
  if (existing) return existing.id;

  if (!createMissing) {
    throw new Error(
      `Category "${value}" does not exist. Create it first or enable “Create missing categories”.`,
    );
  }

  const newSlug = slugify(value);
  if (!newSlug)
    throw new Error(`Category "${value}" cannot be converted to a valid slug.`);

  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .insert({ name: value, slug: newSlug })
    .select("id,name,slug")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? `Unable to create category "${value}".`);
  }

  categories.push(data);
  return data.id;
}

function buildProductPayload(
  row: ProductCsvRecord,
  slug: string,
  categoryId: string | null,
  existing: Product | undefined,
) {
  const update = Boolean(existing);
  const featured = parseBoolean(
    row.featured,
    update ? Boolean(existing?.featured) : false,
  );
  if (featured.error) throw new Error(featured.error);

  const inStock = parseBoolean(
    row.in_stock,
    update ? existing?.in_stock !== false : true,
  );
  if (inStock.error) throw new Error(inStock.error);

  const sortOrder = parseSortOrder(
    row.sort_order,
    update ? (existing?.sort_order ?? 0) : 0,
  );
  if (sortOrder.error) throw new Error(sortOrder.error);

  const parsedSpecs = parseSpecifications(row.specifications);
  if (parsedSpecs.error) throw new Error(parsedSpecs.error);

  const preserveText = (raw: string, current: string | null | undefined) =>
    update && !raw.trim() ? (current ?? null) : textOrNull(raw);

  return {
    name: row.name.trim(),
    slug,
    category_id:
      update && !row.category.trim()
        ? (existing?.category_id ?? null)
        : categoryId,
    brand: preserveText(row.brand, existing?.brand),
    model_code: preserveText(row.model_code, existing?.model_code),
    short_description: preserveText(
      row.short_description,
      existing?.short_description,
    ),
    long_description: preserveText(
      row.long_description,
      existing?.long_description,
    ),
    specifications:
      update && !row.specifications.trim()
        ? (existing?.specifications ?? {})
        : parsedSpecs.value,
    featured: featured.value,
    in_stock: inStock.value,
    sort_order: sortOrder.value,
    meta_title: preserveText(row.meta_title, existing?.meta_title),
    meta_description: preserveText(
      row.meta_description,
      existing?.meta_description,
    ),
    updated_at: new Date().toISOString(),
  };
}

function importError(
  errors: ProductCsvImportError[],
  row: number,
  product: string,
  error: unknown,
) {
  errors.push({
    row,
    product: product || "Unnamed product",
    message: error instanceof Error ? error.message : "Unknown import error.",
  });
}

export async function importProductsCsv(
  formData: FormData,
): Promise<ProductCsvImportResult> {
  // requireAdminNoRedirect(), not requireAdmin(): this runs once per CSV
  // chunk during a multi-batch import. redirect() thrown from inside that
  // loop would force-navigate the admin's browser to the login page and
  // abandon whatever chunks hadn't run yet, even on a transient auth blip.
  // A thrown Error here is caught by the importer's per-chunk try/catch and
  // reported as a failed batch instead. See requireAdminNoRedirect's docstring.
  await requireAdminNoRedirect();

  const csvEntry = formData.get("csv");
  if (typeof csvEntry === "string" || !csvEntry) {
    return {
      success: false,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [],
      message: "Select a CSV file first.",
    };
  }

  if (csvEntry.size > MAX_PRODUCT_CSV_BYTES) {
    return {
      success: false,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [],
      message: "CSV file is too large. Maximum CSV size is 1 MB.",
    };
  }

  const parsed = parseProductCsv(await csvEntry.text());
  if (parsed.errors.length > 0) {
    return {
      success: false,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: parsed.errors.map((message) => ({
        row: 1,
        product: "CSV file",
        message,
      })),
      message: "Fix the CSV structure before importing.",
    };
  }

  if (parsed.rows.length === 0) {
    return {
      success: false,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [],
      message: "The CSV contains no product rows.",
    };
  }

  if (parsed.rows.length > MAX_PRODUCT_CSV_ROWS) {
    return {
      success: false,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [],
      message: `Import up to ${MAX_PRODUCT_CSV_ROWS} products at a time.`,
    };
  }

  const mode: ImportMode =
    formData.get("mode") === "upsert" ? "upsert" : "create";
  const createMissingCategories =
    formData.get("createMissingCategories") === "true";
  const supabase = createClient();

  const { data: categoriesData, error: categoriesError } = await supabase
    .from("categories")
    .select("id,name,slug")
    .order("name", { ascending: true });
  if (categoriesError) {
    return {
      success: false,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [],
      message: `Unable to load categories: ${categoriesError.message}`,
    };
  }
  const categories = (categoriesData ?? []) as CategoryOption[];

  const rowSlugs = parsed.rows.map(({ values }) =>
    slugify(values.slug || values.name),
  );
  const validSlugs = Array.from(new Set(rowSlugs.filter(Boolean)));
  const existingBySlug = new Map<string, Product>();
  if (validSlugs.length > 0) {
    const { data: existingProducts, error } = await supabase
      .from("products")
      .select("*")
      .in("slug", validSlugs);
    if (error) {
      return {
        success: false,
        created: 0,
        updated: 0,
        skipped: 0,
        errors: [],
        message: `Unable to check existing products: ${error.message}`,
      };
    }
    for (const product of existingProducts ?? []) {
      existingBySlug.set(product.slug, product);
    }
  }

  const errors: ProductCsvImportError[] = [];
  const seenSlugs = new Set<string>();
  const tagCache = new Map<string, string>();
  const changedSlugs = new Set<string>();
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const row of parsed.rows) {
    const productName = row.values.name.trim();
    let createdProductId: string | null = null;

    try {
      if (!productName) throw new Error("Product name is required.");

      const productSlug = slugify(row.values.slug || productName);
      if (!productSlug) throw new Error("Product slug is empty or invalid.");
      if (seenSlugs.has(productSlug)) {
        throw new Error(
          `Duplicate slug "${productSlug}" appears more than once in this CSV.`,
        );
      }
      seenSlugs.add(productSlug);

      const existing = existingBySlug.get(productSlug);
      if (existing && mode === "create") {
        skipped += 1;
        errors.push({
          row: row.line,
          product: productName,
          message: `Skipped because slug "${productSlug}" already exists. Choose “Create or update” to update it.`,
        });
        continue;
      }

      const categoryId = await resolveCategory(
        row.values.category,
        createMissingCategories,
        categories,
      );
      const payload = buildProductPayload(
        row.values,
        productSlug,
        categoryId,
        existing,
      );
      const tags = splitList(row.values.tags);

      const primaryImageSource = row.values.primary_image.trim();
      const galleryImageSources = splitOrderedList(row.values.gallery_images);
      const galleryImageAlts = splitOrderedList(row.values.gallery_image_alts);
      const hasImageInput = Boolean(
        primaryImageSource || row.values.gallery_images.trim(),
      );

      if (!primaryImageSource && galleryImageSources.length > 0) {
        throw new Error(
          "Primary image is required when gallery images are provided.",
        );
      }
      if (!primaryImageSource && row.values.primary_image_alt.trim()) {
        throw new Error(
          "Primary image alt text was provided without a primary image.",
        );
      }
      if (galleryImageSources.length === 0 && galleryImageAlts.length > 0) {
        throw new Error(
          "Gallery image alt text was provided without gallery images.",
        );
      }
      if (galleryImageAlts.length > galleryImageSources.length) {
        throw new Error(
          "There are more gallery image alt values than gallery images.",
        );
      }

      const preparedProductImages: PreparedProductImage[] = [];
      if (hasImageInput) {
        const primarySources = splitList(primaryImageSource);
        if (primarySources.length !== 1) {
          throw new Error("Primary image accepts exactly one ImageKit URL.");
        }

        const preparedPrimary = prepareImageUrls(primaryImageSource);
        if (preparedPrimary.error) throw new Error(preparedPrimary.error);
        preparedProductImages.push({
          url: preparedPrimary.urls[0],
          altText: row.values.primary_image_alt.trim() || productName,
          isPrimary: true,
          sortOrder: 0,
        });

        if (galleryImageSources.length > 0) {
          const preparedGallery = prepareImageUrls(row.values.gallery_images);
          if (preparedGallery.error) throw new Error(preparedGallery.error);
          preparedGallery.urls.forEach((url, index) => {
            preparedProductImages.push({
              url,
              altText: galleryImageAlts[index] || productName,
              isPrimary: false,
              sortOrder: index + 1,
            });
          });
        }
      }

      let productId: string;
      if (existing) {
        const { data, error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", existing.id)
          .select("id,slug")
          .single();
        if (error || !data)
          throw new Error(error?.message ?? "Unable to update product.");
        productId = data.id;
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert(payload)
          .select("id,slug")
          .single();
        if (error || !data)
          throw new Error(error?.message ?? "Unable to create product.");
        productId = data.id;
        createdProductId = data.id;
      }

      if (!existing || row.values.tags.trim()) {
        await replaceProductTags(productId, tags, tagCache);
      }

      if (hasImageInput) {
        await replaceProductImages(productId, preparedProductImages);
      }

      if (existing) updated += 1;
      else created += 1;

      existingBySlug.set(productSlug, {
        ...existing,
        ...payload,
        id: productId,
      } as Product);
      changedSlugs.add(productSlug);
    } catch (error) {
      if (createdProductId) {
        await supabase.from("products").delete().eq("id", createdProductId);
      }
      importError(errors, row.line, productName, error);
    }
  }

  if (changedSlugs.size > 0) {
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
    changedSlugs.forEach((slug) => revalidatePath(`/products/${slug}`));
  }

  const successful = created + updated;
  return {
    success: successful > 0 && errors.length === 0,
    created,
    updated,
    skipped,
    errors,
    message:
      successful === 0
        ? "No products were imported. Review the errors below."
        : errors.length > 0
          ? `${successful} product${successful === 1 ? "" : "s"} imported with some row errors.`
          : `${successful} product${successful === 1 ? "" : "s"} imported successfully.`,
  };
}
