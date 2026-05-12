"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

type ProductImagePayload = {
  id?: string;
  url: string;
  alt_text?: string | null;
  is_primary?: boolean;
  sort_order?: number;
};

type ProductPayload = {
  name: string;
  slug: string;
  brand?: string;
  model_code?: string;
  category_id?: string;
  short_description?: string;
  long_description?: string;
  specifications?: Record<string, string>;
  tags?: string[];
  featured?: boolean;
  in_stock?: boolean;
  sort_order?: number;
  meta_title?: string;
  meta_description?: string;
  images?: ProductImagePayload[];
};

function parseProductPayload(formData: FormData): ProductPayload | null {
  const raw = formData.get("payload");
  if (typeof raw !== "string") return null;

  try {
    return JSON.parse(raw) as ProductPayload;
  } catch {
    return null;
  }
}

function normalizeText(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

async function upsertProductTags(productId: string, tags: string[]) {
  const supabase = createClient();
  await supabase.from("product_tags").delete().eq("product_id", productId);

  const cleaned = Array.from(
    new Set(tags.map((tag) => tag.trim()).filter(Boolean)),
  );
  if (cleaned.length === 0) return;

  const tagIds: string[] = [];
  for (const tagName of cleaned) {
    const slug = slugify(tagName);
    const { data: existing } = await supabase
      .from("tags")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing?.id) {
      tagIds.push(existing.id);
      continue;
    }

    const { data: created, error } = await supabase
      .from("tags")
      .insert({ name: tagName, slug })
      .select("id")
      .single();

    if (!error && created?.id) {
      tagIds.push(created.id);
    }
  }

  if (tagIds.length > 0) {
    await supabase.from("product_tags").insert(
      tagIds.map((tagId) => ({
        product_id: productId,
        tag_id: tagId,
      })),
    );
  }
}

async function persistProductImages(
  productId: string,
  images: ProductImagePayload[] | undefined,
) {
  const supabase = createClient();
  await supabase.from("product_images").delete().eq("product_id", productId);

  if (!images || images.length === 0) return;

  const sanitized = images
    .filter((image) => image.url?.trim())
    .map((image, index) => ({
      product_id: productId,
      url: image.url,
      alt_text: normalizeText(image.alt_text),
      is_primary: image.is_primary ?? index === 0,
      sort_order: image.sort_order ?? index,
    }));

  if (sanitized.length === 0) return;

  const primaryExists = sanitized.some((img) => img.is_primary);
  if (!primaryExists && sanitized.length > 0) {
    sanitized[0].is_primary = true;
  }

  await supabase.from("product_images").insert(sanitized);
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const payload = parseProductPayload(formData);
  if (!payload?.name || !payload?.slug) {
    throw new Error("Name and slug are required.");
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: payload.name,
      slug: payload.slug,
      brand: normalizeText(payload.brand),
      model_code: normalizeText(payload.model_code),
      category_id: normalizeText(payload.category_id),
      short_description: normalizeText(payload.short_description),
      long_description: normalizeText(payload.long_description),
      specifications: payload.specifications ?? {},
      featured: Boolean(payload.featured),
      in_stock: payload.in_stock !== false,
      sort_order: payload.sort_order ?? 0,
      meta_title: normalizeText(payload.meta_title),
      meta_description: normalizeText(payload.meta_description),
    })
    .select("id,slug")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Unable to create product.");
  }

  await upsertProductTags(data.id, payload.tags ?? []);
  await persistProductImages(data.id, payload.images);

  revalidatePath("/admin/products");
  revalidatePath(`/products/${data.slug}`);
  redirect("/admin/products");
}

export async function updateProduct(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId") ?? "");
  const payload = parseProductPayload(formData);

  if (!productId || !payload?.name || !payload?.slug) {
    throw new Error("Product ID, name, and slug are required.");
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .update({
      name: payload.name,
      slug: payload.slug,
      brand: normalizeText(payload.brand),
      model_code: normalizeText(payload.model_code),
      category_id: normalizeText(payload.category_id),
      short_description: normalizeText(payload.short_description),
      long_description: normalizeText(payload.long_description),
      specifications: payload.specifications ?? {},
      featured: Boolean(payload.featured),
      in_stock: payload.in_stock !== false,
      sort_order: payload.sort_order ?? 0,
      meta_title: normalizeText(payload.meta_title),
      meta_description: normalizeText(payload.meta_description),
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId)
    .select("id,slug")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Unable to update product.");
  }

  await upsertProductTags(data.id, payload.tags ?? []);
  await persistProductImages(data.id, payload.images);

  revalidatePath("/admin/products");
  revalidatePath(`/products/${data.slug}`);
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId") ?? "");
  if (!productId) throw new Error("Product ID is required.");

  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("slug")
    .eq("id", productId)
    .maybeSingle();
  const { error } = await supabase.from("products").delete().eq("id", productId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/products");
  if (data?.slug) {
    revalidatePath(`/products/${data.slug}`);
  }
}

export async function toggleFeatured(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId") ?? "");
  const featured = formData.get("featured") === "true";
  if (!productId) throw new Error("Product ID is required.");

  const supabase = createClient();
  await supabase.from("products").update({ featured }).eq("id", productId);
  revalidatePath("/admin/products");
}

export async function toggleInStock(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId") ?? "");
  const inStock = formData.get("inStock") === "true";
  if (!productId) throw new Error("Product ID is required.");

  const supabase = createClient();
  await supabase.from("products").update({ in_stock: inStock }).eq("id", productId);
  revalidatePath("/admin/products");
}

export async function uploadProductImage(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("No file selected.");
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `products/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const supabase = createClient();
  const { error } = await supabase.storage.from("product-images").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(path);

  return { url: publicUrl, path };
}

export async function deleteProductImage(formData: FormData) {
  await requireAdmin();
  const imageId = String(formData.get("imageId") ?? "");
  if (!imageId) throw new Error("Image ID is required.");

  const supabase = createClient();
  await supabase.from("product_images").delete().eq("id", imageId);
  revalidatePath("/admin/products");
}

export async function reorderProductImages(formData: FormData) {
  await requireAdmin();
  const raw = String(formData.get("items") ?? "[]");
  const items = JSON.parse(raw) as Array<{ id: string; sort_order: number; is_primary?: boolean }>;

  const supabase = createClient();
  for (const item of items) {
    await supabase
      .from("product_images")
      .update({
        sort_order: item.sort_order,
        is_primary: Boolean(item.is_primary),
      })
      .eq("id", item.id);
  }
  revalidatePath("/admin/products");
}
