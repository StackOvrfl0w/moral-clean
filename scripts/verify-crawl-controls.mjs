import assert from "node:assert/strict";
import fs from "node:fs";

const origin = process.argv[2] || "http://localhost:3011";
const output = process.argv[3];
const results = [];
const anchors = (html) => [...html.matchAll(/<a\b[^>]*href="([^"]+)"/gi)].map((m) => m[1].replaceAll("&amp;", "&"));
const noindex = (html) => /<meta\b(?=[^>]*name="robots")(?=[^>]*content="[^"]*noindex)[^>]*>/i.test(html);
async function get(path, status = 200) {
  const response = await fetch(origin + path, { signal: AbortSignal.timeout(30000) });
  const body = await response.text();
  assert.equal(response.status, status, `${path}: HTTP status`);
  results.push({ path, status, noindex: noindex(body) });
  return body;
}

for (const path of ["/products", "/products/category/vacuum-cleaner"]) {
  const html = await get(path);
  assert.equal(noindex(html), false, `${path}: production HTML remains indexable`);
  assert.ok(html.includes(`rel="canonical" href="https://moralclean.com${path}"`), `${path}: canonical`);
  assert.equal(anchors(html).filter((href) => /[?&](?:brand|tag)=/.test(href)).length, 0, `${path}: no crawlable brand/tag links`);
  assert.ok(/<button\b[^>]*aria-pressed="false"/.test(html), `${path}: filters still rendered as controls`);
  assert.ok(anchors(html).some((href) => href.startsWith("/products/category/")), `${path}: category links remain crawlable`);
}
const filtered = await get("/products?brand=Biemmedue");
assert.ok(noindex(filtered), "valid filtered results remain noindex");
for (const path of [
  "/products?category=vacuum-cleaner&brand=Biemmedue&tag=janitorial-trolley",
  "/products/category/vacuum-cleaner?brand=Biemmedue&tag=janitorial-trolley",
  "/products?brand=nonexistent-crawl-check-brand",
  "/products?tag=nonexistent-crawl-check-tag",
  "/products?category=nonexistent-crawl-check-category",
  "/products?page=999",
  "/products/category/vacuum-cleaner?page=999",
]) {
  assert.ok(noindex(await get(path, 404)), `${path}: 404 is noindex`);
}
for (const path of [
  "/products?q=nonexistent-crawl-check-equipment-918327",
  "/products?brand=Biemmedue&q=nonexistent-crawl-check-equipment-918327",
]) assert.ok(noindex(await get(path)), `${path}: empty searches remain usable and noindex`);
const pageTwo = await get("/products?page=2");
assert.equal(noindex(pageTwo), false, "unfiltered pagination remains indexable");
assert.ok(pageTwo.includes('rel="canonical" href="https://moralclean.com/products?page=2"'));
assert.ok(noindex(await get("/products/category/cleaning-chemicals")), "empty enquiry category remains available and noindex");
const blog = await get("/blog");
const emptyBlog = blog.includes("No posts available yet.");
assert.equal(noindex(blog), emptyBlog, "blog indexing follows published article availability");
assert.ok(anchors(blog).some((href) => href.startsWith("/guides/")), "guide links remain available on the blog");
const staticSitemap = await get("/sitemap-0.xml");
assert.ok(!staticSitemap.includes("<loc>https://moralclean.com/blog</loc>"), "blog index is managed by the dynamic sitemap");
const catalogSitemap = await get("/catalog-sitemap.xml");
assert.equal(catalogSitemap.includes("<loc>https://moralclean.com/blog</loc>"), !emptyBlog, "sitemap blog inclusion follows published articles");
assert.ok(catalogSitemap.includes("<loc>https://moralclean.com/products/wet-560</loc>"));
await get("/products/wet-560");
await get("/guides");
const report = { testedAt: new Date().toISOString(), origin, scope: "GET-only crawl controls verification; no database records or forms modified", checks: results.length, emptyBlog, results, errors: [] };
if (output) fs.writeFileSync(output, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ checks: results.length, emptyBlog, errors: [] }));
