import fs from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const origin = process.argv[2];
const output = process.argv[3];
const cli = process.env.VERCEL_CLI_PATH;
const execute = promisify(execFile);
const errors = [], pages = [], images = new Set(), responses = [];
const decode = (s) => s.replace(/&amp;/g, '&');
async function request(path) {
  const { stdout } = await execute(process.execPath, [cli, 'curl', path, '--deployment', origin,
    '--scope', 'burhan-uddins-projects-91e8a924', '--', '--silent', '--show-error', '--max-time', '60',
    '--write-out', '\\nQA_RESPONSE:%{http_code}|%header{x-robots-tag}|%header{x-vercel-cache}|%{time_total}'],
    { maxBuffer: 12 * 1024 * 1024, timeout: 90000 });
  const split = stdout.lastIndexOf('\nQA_RESPONSE:');
  if (split < 0) throw new Error('Missing response marker');
  const [status, robots, cache, seconds] = stdout.slice(split + 13).trim().split('|');
  const result = { path, status: Number(status), robots, cache, seconds: Number(seconds), html: stdout.slice(0, split) };
  responses.push({ ...result, html: undefined });
  return result;
}
const locations = (xml) => [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
const index = await request('/sitemap.xml');
const urls = [];
for (const sitemap of locations(index.html)) urls.push(...locations((await request(new URL(sitemap).pathname)).html));
if (!urls.length) throw new Error('No application sitemap; possible authentication contamination');
const queue = [...new Set(urls)];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const url = queue.shift(), path = new URL(url).pathname;
    const r = await request(path);
    const title = r.html.match(/<title>(.*?)<\/title>/s)?.[1];
    const description = [...r.html.matchAll(/<meta name="description" content="([^"]*)"/g)].map(m => m[1]);
    const canonicals = [...r.html.matchAll(/<link rel="canonical" href="([^"]*)"/g)].map(m => decode(m[1]));
    const h1 = [...r.html.matchAll(/<h1\b[^>]*>(.*?)<\/h1>/gs)].map(m => m[1].replace(/<[^>]+>/g, ''));
    const schema = [...r.html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m => JSON.parse(m[1]));
    const sources = [...r.html.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(m => decode(m[1]));
    for (const source of sources) { const image = new URL(source, origin); if (image.origin === origin) images.add(image.pathname + image.search); }
    if (r.status !== 200 || !r.robots.includes('noindex') || !title || description.length !== 1 || !description[0] || canonicals.length !== 1 || canonicals[0] !== url || h1.length !== 1)
      errors.push({ path, reason: 'HTTP, preview header or primary metadata failure' });
    if (r.html.includes('Log in to Vercel') || !r.html.includes('Moral Clean')) errors.push({ path, reason: 'Wrong application content' });
    const product = schema.find(s => s['@type'] === 'Product');
    if (product && (!product.name || !product.image || product.offers || product.aggregateRating)) errors.push({ path, reason: 'Product schema' });
    if (path.includes('biemmedue-ms-17-fast') && product?.additionalProperty?.some(p => p.name.toLowerCase() === 'machine width')) errors.push({ path, reason: 'Conflicting dimension published' });
    pages.push({ path, title, description: description[0], canonical: canonicals[0], h1: h1[0], schemaTypes: schema.map(s => s['@type']), imageCount: sources.length, status: r.status, robots: r.robots, cache: r.cache });
  }
}));
for (const key of ['title', 'description']) {
  const seen = new Map();
  for (const p of pages) { if (seen.has(p[key])) errors.push({ path: p.path, reason: `Duplicate ${key}`, other: seen.get(p[key]) }); else seen.set(p[key], p.path); }
}
const imageQueue = [...images], imageResults = [];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (imageQueue.length) { const path = imageQueue.shift(); const r = await request(path); imageResults.push({ path, status: r.status }); if (r.status !== 200) errors.push({ path, reason: 'Image HTTP failure', status: r.status }); }
}));
for (const path of ['/products/test-prod', '/products/category/not-a-category', '/guides/not-a-guide', '/services/not-a-service', '/blog/not-a-post', '/products?page=999999999999999999', '/products?page=1.5', '/products?page=999', '/blog?page=999', '/products/category/single-disk-machine?page=999']) {
  const r = await request(path); if (r.status !== 404 || !r.robots.includes('noindex')) errors.push({ path, reason: 'Missing route exclusion' });
}
for (const path of ['/', '/guides', '/services/cleaning-machine-parts']) await request(path);
const result = { testedAt: new Date().toISOString(), origin, errors, pages: pages.sort((a,b)=>a.path.localeCompare(b.path)), images: imageResults, responses };
fs.writeFileSync(output, JSON.stringify(result, null, 2));
console.log(JSON.stringify({ pages: pages.length, images: imageResults.length, requests: responses.length, errors }, null, 2));
if (errors.length) process.exitCode = 1;
