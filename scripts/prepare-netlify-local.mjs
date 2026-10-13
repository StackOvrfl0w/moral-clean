import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const target = path.join(root, ".trial-local", "site");
fs.mkdirSync(target, { recursive: true });
const tracked = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split("\0");
const added = execFileSync("git", ["ls-files", "--others", "--exclude-standard", "-z"], { encoding: "utf8" }).split("\0");
for (const file of new Set([...tracked, ...added])) {
  if (!file || file.split("/").some((part) => part.startsWith(".env") || [".vercel", ".netlify", ".trial-local"].includes(part)) || !fs.existsSync(file)) continue;
  const destination = path.join(target, file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(file, destination);
}
const dependencies = path.join(target, "node_modules");
if (!fs.existsSync(dependencies)) fs.symlinkSync(path.join(root, "node_modules"), dependencies, process.platform === "win32" ? "junction" : "dir");
console.log("Prepared .trial-local/site without environment files or hosting authentication state.");
