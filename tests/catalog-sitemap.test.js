import { beforeEach, expect, mock, test } from "bun:test";

let posts, failedTable, publishedFilter;
mock.module("@/config/env", () => ({ env: {
  siteUrl: "https://moralclean.com",
  supabaseUrl: "https://catalog.example.invalid",
  supabaseAnonKey: "public-test-key",
} }));
mock.module("@supabase/supabase-js", () => ({ createClient: () => ({
  from: (table) => {
    const query = {
      select: () => query,
      order: () => query,
      range: () => query,
      eq: (column, value) => { publishedFilter = { column, value }; return query; },
      then: (resolve, reject) => {
        const data = table === "blog_posts"
          ? posts.filter((post) => post.published)
          : table === "products" ? [{ slug: "cleaning-machine" }]
          : [{ slug: "vacuum-cleaner", products: [{ count: 1 }] }];
        return Promise.resolve({ data, error: table === failedTable ? { message: "Unavailable" } : null }).then(resolve, reject);
      },
    };
    return query;
  },
}) }));

const { GET } = await import("../src/app/catalog-sitemap.xml/route");
beforeEach(() => { posts = []; failedTable = undefined; publishedFilter = undefined; });

test("an empty or draft-only blog is absent from the sitemap while products remain", async () => {
  posts = [{ slug: "draft", published: false }];
  const xml = await (await GET()).text();
  expect(xml).toContain("<loc>https://moralclean.com/products/cleaning-machine</loc>");
  expect(xml).toContain("<loc>https://moralclean.com/products/category/vacuum-cleaner</loc>");
  expect(xml).not.toContain("https://moralclean.com/blog");
  expect(publishedFilter).toEqual({ column: "published", value: true });
});

test("publishing an article automatically restores the blog index and article URLs", async () => {
  posts = [{ slug: "buying-guide", published: true }, { slug: "draft", published: false }];
  const xml = await (await GET()).text();
  expect(xml).toContain("<loc>https://moralclean.com/blog</loc>");
  expect(xml).toContain("<loc>https://moralclean.com/blog/buying-guide</loc>");
  expect(xml).not.toContain("/blog/draft");
});

test("an unavailable article source fails instead of publishing an incomplete sitemap", async () => {
  failedTable = "blog_posts";
  await expect(GET()).rejects.toThrow("Sitemap query failed: blog_posts");
});
