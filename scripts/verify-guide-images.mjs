import fs from "node:fs";
import sharp from "sharp";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const origin = process.argv[2] || "https://preview.moralclean.com";
const output = process.argv[3] || "docs/seo/guide-image-verification-2026-10-10.json";
const guides = ["guides", "additional-guides", "expert-guides", "planning-guides"].flatMap((name) => JSON.parse(fs.readFileSync(`src/content/${name}.json`, "utf8")));
const errors = [];
const results = [];
const queue = [...guides];
const runFile = promisify(execFile);
fs.mkdirSync(".vercel", { recursive: true });
async function worker() {
  while (queue.length) {
    const guide = queue.shift();
    const url = `${origin}/guides/${guide.slug}/social-image`;
    try {
      let bytes, status, noindex;
      if (process.env.VERCEL_CLI_PATH) {
        const imageFile = `.vercel/verified-${guide.slug}.png`;
        const { stdout } = await runFile(process.execPath, [process.env.VERCEL_CLI_PATH, "curl", `/guides/${guide.slug}/social-image`, "--deployment", origin, "--scope", "burhan-uddins-projects-91e8a924", "--", "--silent", "--show-error", "--max-time", "60", "--output", imageFile, "--write-out", "%{http_code}|%header{x-robots-tag}"], { timeout: 90000 });
        const parts = stdout.trim().split("|");
        status = Number(parts[0]); noindex = parts[1];
        bytes = fs.readFileSync(imageFile);
      } else {
        const response = await fetch(url);
        bytes = Buffer.from(await response.arrayBuffer());
        status = response.status;
        noindex = response.headers.get("x-robots-tag");
      }
      const metadata = await sharp(bytes).metadata();
      if (status !== 200 || metadata.format !== "png" || metadata.width !== 1200 || metadata.height !== 630) errors.push(`Invalid social image: ${guide.slug}`);
      if (/preview\.moralclean\.com|\.vercel\.app/.test(origin) && !noindex?.includes("noindex")) errors.push(`Preview image lacks noindex: ${guide.slug}`);
      results.push({ slug: guide.slug, status, format: metadata.format, width: metadata.width, height: metadata.height, bytes: bytes.length, noindex });
    } catch (error) { errors.push(`${guide.slug}: ${error.message}`); }
  }
}
await Promise.all(Array.from({ length: 3 }, () => worker()));
fs.writeFileSync(output, JSON.stringify({ origin, checkedAt: new Date().toISOString(), results, errors }, null, 2) + "\n");
console.log(JSON.stringify({ images: results.length, errors }, null, 2));
if (errors.length) process.exitCode = 1;
