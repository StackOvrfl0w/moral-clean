"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { sanitizeRichText } from "@/lib/sanitize-html";
import { normalizeSafeUrl, slugify } from "@/lib/utils";

function invalidateBlog() {
  revalidateTag("blog");
}

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
  const coverImageInput = normalize(formData.get("cover_image_url"));
  const cover_image_url = normalizeSafeUrl(coverImageInput);

  if (coverImageInput && !cover_image_url) throw new Error("Cover image URL must use HTTPS.");

  const supabase = createClient();
  const { error } = await supabase.from("blog_posts").insert({
    title,
    slug,
    excerpt: normalize(formData.get("excerpt")),
    cover_image_url,
    author_name: normalize(formData.get("author_name")) || "Moral Clean",
    content: sanitizeRichText(String(formData.get("content") ?? "")),
    published,
    published_at: published ? publishedAt || new Date().toISOString() : null,
    meta_title: normalize(formData.get("meta_title")),
    meta_description: normalize(formData.get("meta_description")),
  });
  if (error) throw new Error(error.message);

  invalidateBlog();
  revalidatePath("/admin/blog");
  revalidatePath("/");
  revalidatePath("/catalog-sitemap.xml");
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
  const coverImageInput = normalize(formData.get("cover_image_url"));
  const cover_image_url = normalizeSafeUrl(coverImageInput);

  if (coverImageInput && !cover_image_url) throw new Error("Cover image URL must use HTTPS.");

  const supabase = createClient();
  const { error } = await supabase
    .from("blog_posts")
    .update({
      title,
      slug,
      excerpt: normalize(formData.get("excerpt")),
      cover_image_url,
      author_name: normalize(formData.get("author_name")) || "Moral Clean",
      content: sanitizeRichText(String(formData.get("content") ?? "")),
      published,
      published_at: published ? publishedAt || new Date().toISOString() : null,
      meta_title: normalize(formData.get("meta_title")),
      meta_description: normalize(formData.get("meta_description")),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  invalidateBlog();
  revalidatePath("/admin/blog");
  revalidatePath("/");
  revalidatePath("/catalog-sitemap.xml");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPost(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("ID is required.");

  const supabase = createClient();
  const { error, count } = await supabase
    .from("blog_posts")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) throw new Error(error.message);
  if (count !== 1) throw new Error("Blog post was not found or was not deleted.");

  invalidateBlog();
  revalidatePath("/admin/blog");
  revalidatePath("/");
  revalidatePath("/catalog-sitemap.xml");
  revalidatePath("/blog");
}

export async function bulkDeleteBlogPosts(formData: FormData) {
  await requireAdmin();
  let ids: string[];
  try {
    ids = JSON.parse(String(formData.get("ids") ?? "[]")) as string[];
  } catch {
    throw new Error("Invalid blog post selection.");
  }

  ids = Array.from(new Set(ids.filter((id) => /^[0-9a-f-]{36}$/i.test(id))));
  if (ids.length === 0) throw new Error("No blog posts selected.");

  const supabase = createClient();
  const { error, count } = await supabase
    .from("blog_posts")
    .delete({ count: "exact" })
    .in("id", ids);
  if (error) throw new Error(error.message);
  if ((count ?? 0) !== ids.length) {
    throw new Error(`Only ${count ?? 0} of ${ids.length} blog posts were deleted.`);
  }

  invalidateBlog();
  revalidatePath("/admin/blog");
  revalidatePath("/");
  revalidatePath("/catalog-sitemap.xml");
  revalidatePath("/blog");
  return { deletedCount: count ?? 0 };
}
