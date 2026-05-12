"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { RefreshCw, Upload } from "lucide-react";

import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadBlogImage } from "@/lib/actions/admin/blog";
import { slugify } from "@/lib/utils";

type BlogFormData = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string;
  author_name: string;
  content: string;
  published: boolean;
  published_at: string;
  meta_title: string;
  meta_description: string;
};

type BlogFormProps = {
  mode: "create" | "edit";
  initialData?: BlogFormData;
  submitAction: (formData: FormData) => Promise<void>;
};

function toDateTimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const tzOffsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - tzOffsetMs).toISOString().slice(0, 16);
}

export function BlogForm({ mode, initialData, submitAction }: BlogFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(initialData?.cover_image_url ?? "");
  const [authorName, setAuthorName] = useState(initialData?.author_name ?? "Moral Clean");
  const [content, setContent] = useState(initialData?.content ?? "<p></p>");
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [publishedAt, setPublishedAt] = useState(toDateTimeLocal(initialData?.published_at));
  const [metaTitle, setMetaTitle] = useState(initialData?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(initialData?.meta_description ?? "");
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (published && !publishedAt) {
      setPublishedAt(toDateTimeLocal(new Date().toISOString()));
    }
  }, [published, publishedAt]);

  function regenerateSlug() {
    setSlug(slugify(title));
  }

  async function handleCoverUpload(fileList: FileList | null) {
    if (!fileList?.[0]) return;
    setUploading(true);

    const formData = new FormData();
    formData.set("file", fileList[0]);

    try {
      const uploaded = await uploadBlogImage(formData);
      setCoverImage(uploaded.url);
      toast.success("Cover image uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(formData: FormData) {
    startTransition(async () => {
      try {
        if (!title.trim() || !slug.trim()) {
          toast.error("Title and slug are required.");
          return;
        }

        if (initialData?.id) {
          formData.set("id", initialData.id);
        }
        formData.set("title", title);
        formData.set("slug", slug);
        formData.set("excerpt", excerpt);
        formData.set("cover_image_url", coverImage);
        formData.set("author_name", authorName);
        formData.set("content", content);
        formData.set("meta_title", metaTitle);
        formData.set("meta_description", metaDescription);
        formData.set("published_at", publishedAt);
        if (published) {
          formData.set("published", "on");
        } else {
          formData.delete("published");
        }

        await submitAction(formData);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to save post.");
      }
    });
  }

  return (
    <form action={submit} className="space-y-6 rounded-lg border bg-white p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <div className="flex gap-2">
            <Input id="slug" value={slug} onChange={(event) => setSlug(event.target.value)} required />
            <Button type="button" variant="outline" onClick={regenerateSlug}>
              <RefreshCw className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" rows={3} value={excerpt} onChange={(event) => setExcerpt(event.target.value)} />
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-2">
          <Label htmlFor="cover_image_url">Cover Image URL</Label>
          <Input id="cover_image_url" value={coverImage} onChange={(event) => setCoverImage(event.target.value)} />
        </div>
        <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm hover:border-accent">
          <Upload className="size-4" />
          {uploading ? "Uploading..." : "Upload image"}
          <input type="file" accept="image/*" className="hidden" onChange={(event) => void handleCoverUpload(event.target.files)} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="author_name">Author Name</Label>
          <Input id="author_name" value={authorName} onChange={(event) => setAuthorName(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="published_at">Published Date</Label>
          <Input
            id="published_at"
            type="datetime-local"
            value={publishedAt}
            onChange={(event) => setPublishedAt(event.target.value)}
            disabled={!published}
          />
        </div>
      </div>

      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} />
        Published
      </label>

      <div className="space-y-2">
        <Label>Content</Label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="meta_title">Meta Title</Label>
          <Input id="meta_title" value={metaTitle} onChange={(event) => setMetaTitle(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meta_description">Meta Description</Label>
          <Textarea id="meta_description" rows={3} value={metaDescription} onChange={(event) => setMetaDescription(event.target.value)} />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending || uploading}>
          {pending ? "Saving..." : mode === "create" ? "Save Post" : "Update Post"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/blog">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
