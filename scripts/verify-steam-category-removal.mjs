import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const origin = process.argv[2];
const output = process.argv[3];
const run = promisify(execFile);
const results = [];
for (const path of ['/products/category/steam-cleaners', '/products/category/steam-cleaners?page=2', '/', '/products', '/catalog-sitemap.xml', '/products/category/ride-on-scrubber-dryer', '/guides/commercial-steam-cleaner-buying-guide-pakistan', '/guides/steam-cleaner-vs-wet-dry-vacuum']) {
  let status, html, robots;
  if (process.env.VERCEL_CLI_PATH) {
    const { stdout } = await run(process.execPath, [process.env.VERCEL_CLI_PATH, 'curl', path, '--deployment', origin, '--scope', 'burhan-uddins-projects-91e8a924', '--', '--silent', '--show-error', '--max-time', '60', '--write-out', '\\nSTEAM_QA:%{http_code}|%header{x-robots-tag}'], { timeout: 90000, maxBuffer: 12 * 1024 * 1024 });
    const i = stdout.lastIndexOf('\nSTEAM_QA:');
    assert.ok(i >= 0);
    [status, robots] = stdout.slice(i + 10).trim().split('|');
    status = Number(status); html = stdout.slice(0, i);
  } else {
    const r = await fetch(origin + path); status = r.status; html = await r.text(); robots = r.headers.get('x-robots-tag');
  }
  assert.equal(status, path.startsWith('/products/category/steam-cleaners') ? 404 : 200, path);
  assert.ok(!html.includes('/products/category/steam-cleaners'), 'Retired category link: ' + path);
  if (/preview\.moralclean\.com|\.vercel\.app/.test(origin)) assert.ok(robots?.includes('noindex'), path);
  if (path.startsWith('/guides/')) assert.ok(html.includes('application/ld+json') && html.includes('Manufacturer references'), path);
  results.push({ path, status, robots, retiredCategoryLink: false });
}
fs.writeFileSync(output, JSON.stringify({ origin, results, errors: [] }, null, 2));
console.log(JSON.stringify({ checks: results.length, errors: [] }));
