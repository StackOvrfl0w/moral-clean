import { assertTrialBuild } from "../src/config/hosting.cjs";
import { spawnSync } from "node:child_process";

assertTrialBuild(process.env);
console.log("Isolated Netlify trial configuration verified; secret values are not logged.");
// Explicit install also covers build images that do not detect the text bun.lock.
for (const args of [["install", "--frozen-lockfile"], ["run", "build"]]) {
  const result = spawnSync("bun", args, { stdio: "inherit", env: process.env });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
