import Link from "next/link";

import { BlogBulkTable } from "@/components/admin/BlogBulkTable";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

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

      <BlogBulkTable posts={posts ?? []} />
    </div>
  );
}
