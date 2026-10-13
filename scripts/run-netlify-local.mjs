import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const mode = process.argv[2];
if (!["build", "start", "types", "sitemap"].includes(mode)) throw new Error("Use build, start, types or sitemap");
const root = process.cwd();
const target = path.join(root, ".trial-local", "site");
if (!fs.existsSync(path.join(target, "package.json"))) throw new Error("Prepare the local copy first");
const environment = {};
for (const key of ["PATH", "Path", "SystemRoot", "SYSTEMROOT", "WINDIR", "TEMP", "TMP", "USERPROFILE", "APPDATA", "LOCALAPPDATA", "COMSPEC", "PATHEXT"]) {
  if (process.env[key]) environment[key] = process.env[key];
}
Object.assign(environment, {
  NODE_ENV: "production", NEXT_TELEMETRY_DISABLED: "1",
  NEXT_PUBLIC_MIGRATION_TRIAL: "true", MORALCLEAN_PREVIEW: "true",
  NEXT_PUBLIC_SITE_URL: "http://localhost:3017",
  NEXT_PUBLIC_SUPABASE_URL: "https://isolatedfixture.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "synthetic-public-key", SUPABASE_SERVICE_ROLE_KEY: "synthetic-secret-key",
  RESEND_API_KEY: "re_synthetic_local_only", RESEND_FROM_EMAIL: "onboarding@resend.dev",
  RESEND_TO_EMAIL: "owner@example.invalid", TRIAL_EMAIL_RECIPIENT: "owner@example.invalid",
  TRIAL_FIXTURE_PATH: path.join(root, ".trial-local", "fixture.json"),
  TRIAL_FIXTURE_LOG: path.join(root, ".trial-local", `${mode}-transport.jsonl`),
  NODE_OPTIONS: `--require "${path.join(root, "scripts", "netlify-local-fixture.cjs").replaceAll("\\", "/")}"`,
});
const executable = mode === "sitemap" ? path.join(root, "node_modules", "next-sitemap", "bin", "next-sitemap.mjs") : mode === "types" ? path.join(root, "node_modules", "typescript", "bin", "tsc") : path.join(root, "node_modules", "next", "dist", "bin", "next");
const args = mode === "sitemap" ? [] : mode === "types" ? ["--noEmit"] : mode === "start" ? ["start", "-p", "3017", "-H", "127.0.0.1"] : ["build"];
const child = spawn(process.execPath, [executable, ...args], { cwd: target, env: environment, stdio: "inherit" });
child.on("exit", (code) => {
  if (mode === "build" && code === 0) {
    const sitemap = spawn(process.execPath, [path.join(root, "node_modules", "next-sitemap", "bin", "next-sitemap.mjs")], { cwd: target, env: environment, stdio: "inherit" });
    sitemap.on("exit", (status) => process.exit(status ?? 1));
  } else process.exit(code ?? 1);
});
