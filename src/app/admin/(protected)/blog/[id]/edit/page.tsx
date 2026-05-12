import Link from "next/link";

import { BlogForm } from "@/components/admin/BlogForm";
import { Button } from "@/components/ui/button";
import { updateBlogPost } from "@/lib/actions/admin/blog";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type EditBlogPageProps = {
  params: { id: string };
};

export default async function AdminEditBlogPage({ params }: EditBlogPageProps) {
  await requireAdmin();
  const supabase = createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("id,title,slug,excerpt,cover_image_url,author_name,content,published,published_at,meta_title,meta_description")
    .eq("id", params.id)
    .maybeSingle();

  if (!post) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold text-primary">Blog post not found</h1>
        <Button asChild className="mt-4">
          <Link href="/admin/blog">Go back</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-display font-bold text-primary">Edit Blog Post</h1>
      <BlogForm
        mode="edit"
        submitAction={updateBlogPost}
        initialData={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || "",
          cover_image_url: post.cover_image_url || "",
          author_name: post.author_name || "Moral Clean",
          content: post.content,
          published: Boolean(post.published),
          published_at: post.published_at || "",
          meta_title: post.meta_title || "",
          meta_description: post.meta_description || "",
        }}
      />
    </div>
  );
}
