"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

function normalize(value: FormDataEntryValue | null) {
  const text = typeof value === "string" ? value.trim() : "";
  return text || null;
}

async function uploadCategoryImage(file: File) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `categories/${Date.now()}-${crypto.randomUUID()}.${ext}`;
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
  return publicUrl;
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = normalize(formData.get("name"));
  const slugInput = normalize(formData.get("slug"));
  const slug = slugInput ? slugify(slugInput) : name ? slugify(name) : null;
  const description = normalize(formData.get("description"));
  let image_url = normalize(formData.get("image_url"));
  const imageFile = formData.get("image_file");
  if (imageFile instanceof File && imageFile.size > 0) {
    image_url = await uploadCategoryImage(imageFile);
  }
  const sort_order = Number(formData.get("sort_order") ?? 0);

  if (!name || !slug) throw new Error("Name and slug are required.");

  const supabase = createClient();
  const { error } = await supabase.from("categories").insert({
    name,
    slug,
    description,
    image_url,
    sort_order,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
  revalidatePath(`/products/category/${slug}`);
  redirect("/admin/categories");
}

export async function updateCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = normalize(formData.get("name"));
  const slugInput = normalize(formData.get("slug"));
  const slug = slugInput ? slugify(slugInput) : name ? slugify(name) : null;
  const description = normalize(formData.get("description"));
  let image_url = normalize(formData.get("image_url"));
  const imageFile = formData.get("image_file");
  if (imageFile instanceof File && imageFile.size > 0) {
    image_url = await uploadCategoryImage(imageFile);
  }
  const sort_order = Number(formData.get("sort_order") ?? 0);

  if (!id || !name || !slug) throw new Error("Category ID, name and slug are required.");

  const supabase = createClient();
  const { error } = await supabase
    .from("categories")
    .update({ name, slug, description, image_url, sort_order })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
  revalidatePath(`/products/category/${slug}`);
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Category ID required.");

  const supabase = createClient();
  await supabase.from("products").update({ category_id: null }).eq("category_id", id);
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
  revalidatePath("/products");
}

export async function reorderCategories(formData: FormData) {
  await requireAdmin();
  const raw = String(formData.get("items") ?? "[]");
  const items = JSON.parse(raw) as Array<{ id: string; sort_order: number }>;

  const supabase = createClient();
  for (const item of items) {
    await supabase
      .from("categories")
      .update({ sort_order: item.sort_order })
      .eq("id", item.id);
  }

  revalidatePath("/admin/categories");
}
