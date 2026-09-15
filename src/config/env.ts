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
  siteUrl:
    configuredSiteUrl && (!isLocalSiteUrl || process.env.NODE_ENV !== "production")
      ? configuredSiteUrl.replace(/\/$/, "")
      : process.env.NODE_ENV === "production"
        ? "https://moralclean.com"
        : "http://localhost:3000",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  resendApiKey: process.env.RESEND_API_KEY!,
  resendFromEmail: process.env.RESEND_FROM_EMAIL || "noreply@moralclean.com",
  resendToEmail: process.env.RESEND_TO_EMAIL || "info@moralclean.com",
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim() || "",
  posthogHost: getPosthogHost(),
  sentryDsn: process.env.SENTRY_DSN?.trim() || "",
  publicSentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN?.trim() || "",
  sentryEnvironment:
    process.env.SENTRY_ENVIRONMENT?.trim() ||
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT?.trim() ||
    process.env.NODE_ENV ||
    "development",
  imagekitPublicKey: process.env.IMAGEKIT_PUBLIC_KEY?.trim() || "",
  imagekitPrivateKey: process.env.IMAGEKIT_PRIVATE_KEY?.trim() || "",
};
