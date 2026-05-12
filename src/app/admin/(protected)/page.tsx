import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type DashboardStat = {
  label: string;
  value: number;
};

function formatDate(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function truncate(value: string, max = 90) {
  if (value.length <= max) return value;
  return `${value.slice(0, max)}...`;
}

export default async function AdminDashboardPage() {
  const user = await requireAdmin();
  const supabase = createClient();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    productsCountResult,
    categoriesCountResult,
    blogCountResult,
    recentCountResult,
    recentSubmissionsResult,
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true })
      .eq("published", true),
    supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo),
    supabase
      .from("contact_submissions")
      .select("id,name,phone,email,message,created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const stats: DashboardStat[] = [
    { label: "Total Products", value: productsCountResult.count ?? 0 },
    { label: "Total Categories", value: categoriesCountResult.count ?? 0 },
    { label: "Published Blog Posts", value: blogCountResult.count ?? 0 },
    { label: "New Submissions (7d)", value: recentCountResult.count ?? 0 },
  ];

  const recentSubmissions = recentSubmissionsResult.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-primary">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome back, {user.email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-primary">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Contact Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-white text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Phone</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Message</th>
                </tr>
              </thead>
              <tbody>
                {recentSubmissions.length === 0 ? (
                  <tr>
                    <td className="px-3 py-6 text-center text-muted-foreground" colSpan={5}>
                      No submissions yet.
                    </td>
                  </tr>
                ) : (
                  recentSubmissions.map((submission) => (
                    <tr key={submission.id} className="border-t hover:bg-muted/50">
                      <td className="px-3 py-3">{formatDate(submission.created_at)}</td>
                      <td className="px-3 py-3">{submission.name}</td>
                      <td className="px-3 py-3">{submission.phone || "—"}</td>
                      <td className="px-3 py-3">{submission.email || "—"}</td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {truncate(submission.message)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Link href="/admin/submissions" className="text-sm font-semibold text-primary hover:text-accent">
              View all
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/admin/products/new" className="rounded-lg border bg-white p-5 hover:border-accent">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Quick action</p>
          <h2 className="mt-2 text-xl font-semibold text-primary">Add Product</h2>
        </Link>
        <Link href="/admin/blog/new" className="rounded-lg border bg-white p-5 hover:border-accent">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Quick action</p>
          <h2 className="mt-2 text-xl font-semibold text-primary">Add Blog Post</h2>
        </Link>
        <Link href="/admin/categories/new" className="rounded-lg border bg-white p-5 hover:border-accent">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Quick action</p>
          <h2 className="mt-2 text-xl font-semibold text-primary">Add Category</h2>
        </Link>
      </div>
    </div>
  );
}
