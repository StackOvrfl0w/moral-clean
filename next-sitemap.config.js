const { createClient } = require("@supabase/supabase-js");

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://moralclean.com";

function createSupabase() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/admin", "/admin/*", "/api/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    additionalSitemaps: [],
  },
  additionalPaths: async () => {
    const supabase = createSupabase();

    if (!supabase) {
      return [];
    }

    const [productsResponse, categoriesResponse, postsResponse] =
      await Promise.all([
        supabase.from("products").select("slug"),
        supabase.from("categories").select("slug"),
        supabase.from("blog_posts").select("slug").eq("published", true),
      ]);

    const additional = [];
    const nowIso = new Date().toISOString();

    for (const product of productsResponse.data ?? []) {
      additional.push({
        loc: `/products/${product.slug}`,
        changefreq: "weekly",
        priority: 0.8,
        lastmod: nowIso,
      });
    }

    for (const category of categoriesResponse.data ?? []) {
      additional.push({
        loc: `/products/category/${category.slug}`,
        changefreq: "weekly",
        priority: 0.7,
        lastmod: nowIso,
      });
    }

    for (const post of postsResponse.data ?? []) {
      additional.push({
        loc: `/blog/${post.slug}`,
        changefreq: "weekly",
        priority: 0.7,
        lastmod: nowIso,
      });
    }

    return additional;
  },
};
