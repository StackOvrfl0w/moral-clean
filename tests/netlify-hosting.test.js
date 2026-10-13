import { describe, expect, test } from "bun:test";
import { assertTrialBuild, assertTrialTarget, isPreviewEnvironment } from "../src/config/hosting.cjs";
import { MAX_IMAGE_BYTES, validateImageMetadata, validateImageUpload } from "../src/lib/image-upload";

const isolated = {
  NEXT_PUBLIC_MIGRATION_TRIAL: "true",
  NEXT_PUBLIC_SUPABASE_URL: "https://isolatedfixture.supabase.co",
  TRIAL_SUPABASE_PROJECT_REF: "isolatedfixture", TRIAL_SERVICES_CONFIRMED: "true",
  NEXT_PUBLIC_SITE_URL: "https://isolated-fixture.netlify.app",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "fake-public", SUPABASE_SERVICE_ROLE_KEY: "fake-secret",
  RESEND_API_KEY: "fake-resend", RESEND_FROM_EMAIL: "onboarding@resend.dev",
  RESEND_TO_EMAIL: "owner@example.invalid", TRIAL_EMAIL_RECIPIENT: "owner@example.invalid",
  IMAGEKIT_PUBLIC_KEY: "fake-imagekit-public", IMAGEKIT_PRIVATE_KEY: "fake-imagekit-secret",
};

describe("trial isolation boundary", () => {
  test("rejects production and deceptive Supabase origins", () => {
    for (const url of ["https://sjlmjakninsenljyastk.supabase.co", "https://sjlmjakninsenljyastk.supabase.co.evil.test", "http://isolatedfixture.supabase.co", "https://user:pass@isolatedfixture.supabase.co"]) {
      expect(() => assertTrialTarget({ ...isolated, NEXT_PUBLIC_SUPABASE_URL: url })).toThrow();
    }
    expect(() => assertTrialBuild(isolated)).not.toThrow();
  });
  test("fails closed on missing confirmation, production mailbox, live URL and analytics", () => {
    for (const override of [
      { TRIAL_SERVICES_CONFIRMED: "false" }, { TRIAL_SUPABASE_PROJECT_REF: "wrong" },
      { NEXT_PUBLIC_SITE_URL: "https://moralclean.com" }, { RESEND_TO_EMAIL: "info@moralclean.com" },
      { RESEND_TO_EMAIL: "someone-else@example.invalid" }, { NEXT_PUBLIC_POSTHOG_KEY: "live" },
      { SENTRY_AUTH_TOKEN: "live" }, { GOOGLE_SITE_VERIFICATION: "live" }, { RESEND_API_KEY: "" },
    ]) expect(() => assertTrialBuild({ ...isolated, ...override })).toThrow();
  });
  test("noindex recognizes host-independent previews without marking ordinary production", () => {
    for (const values of [{ NEXT_PUBLIC_MIGRATION_TRIAL: "true" }, { MORALCLEAN_PREVIEW: "true" },
      { VERCEL_ENV: "preview" }, { CONTEXT: "deploy-preview" }, { CONTEXT: "branch-deploy" }]) {
      expect(isPreviewEnvironment(values)).toBe(true);
    }
    expect(isPreviewEnvironment({ VERCEL_ENV: "production", CONTEXT: "production" })).toBe(false);
  });
});

describe("direct image upload boundaries", () => {
  test("retains 5 MiB and rejects oversize or deceptive metadata", async () => {
    const bytes = new Uint8Array(MAX_IMAGE_BYTES); bytes.set([0xff, 0xd8, 0xff]);
    const image = await validateImageUpload(new File([bytes], "large.jpg"));
    expect(image.extension).toBe("jpg");
    expect(() => validateImageMetadata(MAX_IMAGE_BYTES, "jpg", "image/jpeg")).not.toThrow();
    expect(() => validateImageMetadata(MAX_IMAGE_BYTES + 1, "jpg", "image/jpeg")).toThrow();
    expect(() => validateImageMetadata(12, "svg", "image/svg+xml")).toThrow();
    expect(() => validateImageMetadata(12, "jpg", "image/png")).toThrow();
    await expect(validateImageUpload(new File(["<script>alert(1)</script>"], "fake.jpg", { type: "image/jpeg" }))).rejects.toThrow();
  });
});
