import { assertTrialTarget } from "./hosting.cjs";

const migrationTrial = process.env.NEXT_PUBLIC_MIGRATION_TRIAL === "true";
assertTrialTarget({
  NEXT_PUBLIC_MIGRATION_TRIAL: process.env.NEXT_PUBLIC_MIGRATION_TRIAL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
});
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const isLocalSiteUrl = configuredSiteUrl?.includes("localhost") || configuredSiteUrl?.includes("127.0.0.1");
const configuredPosthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim();

function getPosthogHost() {
  if (!configuredPosthogHost || configuredPosthogHost === "https://posthog.com") {
    return "https://us.i.posthog.com";
  }

  return configuredPosthogHost.replace(/\/$/, "");
}

export const env = {
  migrationTrial,
  siteUrl:
    configuredSiteUrl && (migrationTrial || !isLocalSiteUrl || process.env.NODE_ENV !== "production")
      ? configuredSiteUrl.replace(/\/$/, "")
      : process.env.NODE_ENV === "production"
        ? "https://moralclean.com"
        : "http://localhost:3000",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  resendApiKey: process.env.RESEND_API_KEY!,
  resendFromEmail: process.env.RESEND_FROM_EMAIL || (migrationTrial ? "" : "noreply@moralclean.com"),
  resendToEmail: process.env.RESEND_TO_EMAIL || (migrationTrial ? "" : "info@moralclean.com"),
  trialEmailRecipient: process.env.TRIAL_EMAIL_RECIPIENT?.trim() || "",
  posthogKey: migrationTrial ? "" : process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim() || "",
  posthogHost: getPosthogHost(),
  sentryDsn: migrationTrial ? "" : process.env.SENTRY_DSN?.trim() || "",
  publicSentryDsn: migrationTrial ? "" : process.env.NEXT_PUBLIC_SENTRY_DSN?.trim() || "",
  sentryEnvironment:
    process.env.SENTRY_ENVIRONMENT?.trim() ||
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT?.trim() ||
    process.env.NODE_ENV ||
    "development",
  imagekitPublicKey: process.env.IMAGEKIT_PUBLIC_KEY?.trim() || "",
  imagekitPrivateKey: process.env.IMAGEKIT_PRIVATE_KEY?.trim() || "",
};
