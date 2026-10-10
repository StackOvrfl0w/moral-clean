"use client";

import { env } from "@/config/env";

let analytics: Promise<typeof import("posthog-js")["default"]> | undefined;
export function loadAnalytics() {
  analytics ??= import("posthog-js").then(({ default: posthog }) => {
    posthog.init(env.posthogKey, {
      api_host: env.posthogHost,
      capture_pageview: false,
      capture_pageleave: true,
      autocapture: false,
      persistence: "localStorage",
      disable_session_recording: true,
    });
    return posthog;
  }).catch((error) => { analytics = undefined; throw error; });
  return analytics;
}

type InquiryEvent = "inquiry_submitted" | "contact_channel_click" | "quote_request_click";
export function trackInquiry(event: InquiryEvent, properties: { form_type?: "contact" | "quick_quote"; channel?: "phone" | "whatsapp"; category_slug?: string }) {
  if (!env.posthogKey) return;
  void loadAnalytics().then((posthog) => posthog.capture(event, {
    ...properties, page_path: window.location.pathname,
    $current_url: `${window.location.origin}${window.location.pathname}`,
  })).catch(() => { /* Measurement cannot prevent an enquiry. */ });
}
