import assert from 'node:assert/strict';
import fs from 'node:fs';
const origin = process.argv[2] || 'http://localhost:3013';
const output = process.argv[3] || 'docs/performance/cpu-http-verification-2026-10-12.json';
const results = [];
async function page(path, status = 200) {
  const r = await fetch(origin + path); const html = await r.text();
  assert.equal(r.status, status, path);
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1]?.replace(/&amp;/g, '&');
  const noindex = /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html);
  if (status === 404) assert.ok(noindex, path);
  results.push({ path, status: r.status, title, canonical, noindex });
  return html;
}
for (const root of ['/products', '/products/category/single-disk-machine', '/blog']) {
  for (const bad of ['999', '0', '-1', '1.5', 'abc', 'Infinity', '999999999999999999999']) await page(root + '?page=' + bad, 404);
}
for (const value of ['2', '3']) {
  const html = await page('/products?page=' + value);
  assert.ok(html.includes('href="https://moralclean.com/products?page=' + value + '"'));
}
const empty = await page('/products?q=no-such-qa-equipment-874923');
assert.ok(empty.includes('No products match these filters'));
await page('/products?q=no-such-qa-equipment-874923&page=2', 404);
await page('/products?brand=unknown-qa-brand-874923');
await page('/products?brand=unknown-qa-brand-874923&page=2', 404);
await page('/products?q=' + 'x'.repeat(121), 404);
await page('/products/category/single-disk-machine?brand=BM2%20BIEMMEDUE');
const index = await page('/sitemap.xml');
const locations = xml => [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
const urls = [];
for (const child of locations(index)) urls.push(...locations(await page(new URL(child).pathname)));
for (const url of urls) {
  const path = new URL(url).pathname;
  const html = await page(path);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, path);
  const canonical = results.at(-1).canonical;
  assert.equal(new URL(canonical).pathname, path, path);
  assert.ok(html.match(/<meta name="description" content="[^"]+"/), path);
  assert.ok(!results.at(-1).noindex, path);
  for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) JSON.parse(match[1]);
}
const product = await page('/products/biemmedue-ms-17-fast-single-disc-floor-machine');
assert.ok(product.includes('MS 17 FAST Single Disc Floor Machine'));
assert.ok(product.includes('440 mm')); // existing production specification remains unchanged
await page('/contact?subject=Quotation');
await page('/admin/login');
const r = await fetch(origin + '/admin', { redirect: 'manual' });
assert.ok([307, 308].includes(r.status));
assert.ok(r.headers.get('location').includes('/admin/login'));
fs.writeFileSync(output, JSON.stringify({ origin, sitemapPages: urls.length, checks: results.length + 1, adminProtected: true, results, errors: [] }, null, 2));
console.log(JSON.stringify({ checks: results.length + 1, sitemapPages: urls.length, errors: [] }));
