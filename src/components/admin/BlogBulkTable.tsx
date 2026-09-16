"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { bulkDeleteBlogPosts, deleteBlogPost } from "@/lib/actions/admin/blog";

type BlogRow = {
  id: string;
  title: string;
  published: boolean | null;
  published_at: string | null;
};

function formatDate(value: string | null) {
  return value
    ? new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "-";
}

export function BlogBulkTable({ posts }: { posts: BlogRow[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const ids = useMemo(() => posts.map((post) => post.id), [posts]);
  const allSelected = ids.length > 0 && selected.size === ids.length;

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(ids));
  }

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function deleteSelected() {
    if (!selected.size || !window.confirm(`Permanently delete ${selected.size} blog post${selected.size === 1 ? "" : "s"}?`)) return;
    const formData = new FormData();
    formData.set("ids", JSON.stringify(Array.from(selected)));
    startTransition(async () => {
      try {
        const result = await bulkDeleteBlogPosts(formData);
        setSelected(new Set());
        toast.success(`Deleted ${result.deletedCount} blog post${result.deletedCount === 1 ? "" : "s"}.`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Bulk delete failed.");
      }
    });
  }

  return (
    <div className="space-y-3">
      {selected.size > 0 ? (
        <div className="flex items-center justify-between rounded-md border bg-muted/60 px-4 py-2">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setSelected(new Set())} disabled={pending}>Clear</Button>
            <Button size="sm" variant="destructive" onClick={deleteSelected} disabled={pending}>{pending ? "Deleting..." : "Delete Selected"}</Button>
          </div>
        </div>
      ) : null}
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-3"><input type="checkbox" checked={allSelected} ref={(element) => { if (element) element.indeterminate = selected.size > 0 && !allSelected; }} onChange={toggleAll} aria-label="Select all blog posts" /></th>
              <th className="px-3 py-3">Title</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Published Date</th><th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t hover:bg-muted/40">
                <td className="px-3 py-3"><input type="checkbox" checked={selected.has(post.id)} onChange={() => toggle(post.id)} aria-label={`Select ${post.title}`} /></td>
                <td className="px-3 py-3 font-medium">{post.title}</td>
                <td className="px-3 py-3"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${post.published ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>{post.published ? "Published" : "Draft"}</span></td>
                <td className="px-3 py-3">{formatDate(post.published_at)}</td>
                <td className="px-3 py-3"><div className="flex gap-2"><Button asChild size="sm" variant="outline"><Link href={`/admin/blog/${post.id}/edit`}>Edit</Link></Button><Button size="sm" variant="destructive" disabled={pending} onClick={() => { if (!window.confirm("Delete this blog post?")) return; const formData = new FormData(); formData.set("id", post.id); startTransition(async () => { try { await deleteBlogPost(formData); setSelected((current) => { const next = new Set(current); next.delete(post.id); return next; }); toast.success("Blog post deleted."); } catch (error) { toast.error(error instanceof Error ? error.message : "Delete failed."); } }); }}>Delete</Button></div></td>
              </tr>
            ))}
            {posts.length === 0 ? <tr><td colSpan={5} className="px-3 py-8 text-center text-muted-foreground">No blog posts found.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
