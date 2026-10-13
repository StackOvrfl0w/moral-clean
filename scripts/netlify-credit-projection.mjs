import fs from "node:fs";

const file = process.argv[2];
if (!file) throw new Error("Provide a JSON file containing monthly usage assumptions or measured projections");
const usage = JSON.parse(fs.readFileSync(file, "utf8"));
const keys = ["productionDeploys", "bandwidthGb", "computeGbHours", "webRequests", "otherTeamCredits"];
for (const key of keys) if (!Number.isFinite(usage[key]) || usage[key] < 0) throw new Error(`Missing or invalid ${key}; unknown usage must not be treated as zero`);
const credits = usage.productionDeploys * 15 + usage.bandwidthGb * 20 + usage.computeGbHours * 10 + usage.webRequests / 10000 * 2 + usage.otherTeamCredits;
console.log(JSON.stringify({ assumptions: usage, ratesCheckedOn: "2026-10-13", credits: Number(credits.toFixed(2)),
  freeAllowance: 300, remainingCredits: Number((300 - credits).toFixed(2)),
  headroomPercent: Number(((300 - credits) / 300 * 100).toFixed(1)),
  decision: credits > 210 ? "NO-GO: below the proposed 30% safety reserve or over cap" : "Within proposed reserve; only GO if measured traffic and complete functional tests support these inputs",
  monthlyHostingCharge: "$0 on Free; usage exhaustion pauses sites instead of guaranteeing uptime",
  scope: "Include every site, preview, bot request and service drawing from the same team allowance",
}, null, 2));
