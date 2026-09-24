import { createClient } from "@supabase/supabase-js";
import { getServerSideSitemap } from "next-sitemap";
import { env } from "@/config/env";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export async function GET() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    return new Response("Sitemap data unavailable", { status: 503 });
  }
  const client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  async function entries(table: string, prefix: string, columns: string) {
    const results: { loc: string; lastmod?: string }[] = [];
    for (let from = 0; ; from += 1000) {
      let query = client
        .from(table)
        .select(columns)
        .order("slug")
        .range(from, from + 999);
      if (table === "blog_posts") query = query.eq("published", true);
      const { data, error } = await query;
      if (error) throw new Error(`Sitemap query failed: ${table}`);
      const rows = (data || []) as unknown as {
        slug: string;
        updated_at?: string;
        created_at?: string;
      }[];
      for (const row of rows) {
        const modified = row.updated_at || row.created_at;
        results.push({
          loc: absoluteUrl(`${prefix}/${encodeURIComponent(row.slug)}`),
          ...(modified && Number.isFinite(Date.parse(modified))
            ? { lastmod: new Date(modified).toISOString() }
            : {}),
        });
      }
      if (rows.length < 1000) return results;
    }
  }
  // Throw on an upstream failure so ISR keeps the last successful sitemap.
  const groups = await Promise.all([
    entries("products", "/products", "slug,updated_at,created_at"),
    entries("categories", "/products/category", "slug,created_at"),
    entries("blog_posts", "/blog", "slug,updated_at,created_at"),
  ]);
  return getServerSideSitemap(groups.flat());
}
