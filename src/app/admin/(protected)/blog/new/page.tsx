import { BlogForm } from "@/components/admin/BlogForm";
import { createBlogPost } from "@/lib/actions/admin/blog";
import { requireAdmin } from "@/lib/auth";

export default async function AdminNewBlogPage() {
  await requireAdmin();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-display font-bold text-primary">Add Blog Post</h1>
      <BlogForm mode="create" submitAction={createBlogPost} />
    </div>
  );
}
