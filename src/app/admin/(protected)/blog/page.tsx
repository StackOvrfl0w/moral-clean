import Link from "next/link";

import { ConfirmActionButton } from "@/components/admin/ConfirmActionButton";
import { Button } from "@/components/ui/button";
import { deleteBlogPost } from "@/lib/actions/admin/blog";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminBlogPage() {
  await requireAdmin();
  const supabase = createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id,title,published,published_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-primary">Blog Posts</h1>
        <Button asChild>
          <Link href="/admin/blog/new">Add Blog Post</Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-3">Title</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Published Date</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(posts ?? []).map((post) => (
              <tr key={post.id} className="border-t hover:bg-muted/40">
                <td className="px-3 py-3 font-medium">{post.title}</td>
                <td className="px-3 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      post.published ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-3 py-3">{formatDate(post.published_at)}</td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/blog/${post.id}/edit`}>Edit</Link>
                    </Button>
                    <ConfirmActionButton
                      label="Delete"
                      message="Delete this blog post?"
                      action={deleteBlogPost}
                      values={{ id: post.id }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
