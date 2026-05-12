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

export async function createBlogPost(formData: FormData) {
  await requireAdmin();
  const title = normalize(formData.get("title"));
  const slugInput = normalize(formData.get("slug"));
  const slug = slugInput ? slugify(slugInput) : title ? slugify(title) : null;

  if (!title || !slug) throw new Error("Title and slug are required.");

  const published = formData.get("published") === "on";
  const publishedAt = normalize(formData.get("published_at"));

  const supabase = createClient();
  const { error } = await supabase.from("blog_posts").insert({
    title,
    slug,
    excerpt: normalize(formData.get("excerpt")),
    cover_image_url: normalize(formData.get("cover_image_url")),
    author_name: normalize(formData.get("author_name")) || "Moral Clean",
    content: String(formData.get("content") ?? ""),
    published,
    published_at: published ? publishedAt || new Date().toISOString() : null,
    meta_title: normalize(formData.get("meta_title")),
    meta_description: normalize(formData.get("meta_description")),
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function updateBlogPost(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const title = normalize(formData.get("title"));
  const slugInput = normalize(formData.get("slug"));
  const slug = slugInput ? slugify(slugInput) : title ? slugify(title) : null;

  if (!id || !title || !slug) throw new Error("ID, title and slug are required.");

  const published = formData.get("published") === "on";
  const publishedAt = normalize(formData.get("published_at"));

  const supabase = createClient();
  const { error } = await supabase
    .from("blog_posts")
    .update({
      title,
      slug,
      excerpt: normalize(formData.get("excerpt")),
      cover_image_url: normalize(formData.get("cover_image_url")),
      author_name: normalize(formData.get("author_name")) || "Moral Clean",
      content: String(formData.get("content") ?? ""),
      published,
      published_at: published ? publishedAt || new Date().toISOString() : null,
      meta_title: normalize(formData.get("meta_title")),
      meta_description: normalize(formData.get("meta_description")),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPost(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("ID is required.");

  const supabase = createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function uploadBlogImage(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("No file selected.");
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `blog/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const supabase = createClient();
  const { error } = await supabase.storage.from("product images").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("product images").getPublicUrl(path);

  return { url: publicUrl, path };
}
