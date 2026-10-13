const PRODUCTION_SUPABASE_REF = "sjlmjakninsenljyastk";

function isPreviewEnvironment(values) {
  return values.NEXT_PUBLIC_MIGRATION_TRIAL === "true" ||
    values.MORALCLEAN_PREVIEW === "true" || values.VERCEL_ENV === "preview" ||
    ["deploy-preview", "branch-deploy"].includes(values.CONTEXT);
}

function assertTrialTarget(values) {
  if (values.NEXT_PUBLIC_MIGRATION_TRIAL !== "true") return;
  const url = new URL(values.NEXT_PUBLIC_SUPABASE_URL || "");
  if (url.protocol !== "https:" || !/^[a-z0-9]+\.supabase\.co$/.test(url.hostname) ||
      url.hostname === `${PRODUCTION_SUPABASE_REF}.supabase.co` || url.username || url.password ||
      url.pathname !== "/" || url.search || url.hash) {
    throw new Error("Migration trial requires an isolated Supabase project; production is blocked.");
  }
}

function assertTrialBuild(values) {
  if (values.NEXT_PUBLIC_MIGRATION_TRIAL !== "true") {
    throw new Error("Netlify trial build requires NEXT_PUBLIC_MIGRATION_TRIAL=true.");
  }
  assertTrialTarget(values);
  const projectRef = new URL(values.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];
  if (values.TRIAL_SUPABASE_PROJECT_REF !== projectRef || values.TRIAL_SERVICES_CONFIRMED !== "true") {
    throw new Error("Confirm the isolated project reference and test-service ownership before building.");
  }
  const site = new URL(values.NEXT_PUBLIC_SITE_URL || "");
  if (site.protocol !== "https:" || !site.hostname.endsWith(".netlify.app") ||
      site.pathname !== "/" || site.username || site.password || site.search || site.hash) {
    throw new Error("Netlify trial site URL must be an HTTPS *.netlify.app origin.");
  }
  for (const key of ["NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "RESEND_API_KEY",
    "RESEND_FROM_EMAIL", "RESEND_TO_EMAIL", "TRIAL_EMAIL_RECIPIENT", "IMAGEKIT_PUBLIC_KEY", "IMAGEKIT_PRIVATE_KEY"]) {
    if (!values[key]?.trim()) throw new Error(`Missing isolated trial setting: ${key}`);
  }
  if (values.RESEND_TO_EMAIL !== values.TRIAL_EMAIL_RECIPIENT ||
      /@moralclean\.com\s*$/i.test(values.RESEND_TO_EMAIL) ||
      /@moralclean\.com\s*$/i.test(values.RESEND_FROM_EMAIL)) {
    throw new Error("Trial mail requires a separate sender and the explicit test recipient.");
  }
  for (const key of ["NEXT_PUBLIC_POSTHOG_KEY", "NEXT_PUBLIC_SENTRY_DSN", "SENTRY_DSN", "SENTRY_AUTH_TOKEN", "GOOGLE_SITE_VERIFICATION"]) {
    if (values[key]?.trim()) throw new Error(`Trial must not use production analytics or verification: ${key}`);
  }
}

module.exports = { PRODUCTION_SUPABASE_REF, isPreviewEnvironment, assertTrialTarget, assertTrialBuild };
