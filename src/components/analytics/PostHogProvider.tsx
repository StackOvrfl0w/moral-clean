"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { env } from "@/config/env";

let analytics: Promise<typeof import("posthog-js")["default"]> | undefined;
function loadAnalytics() {
  analytics ??= import("posthog-js").then(({ default: posthog }) => {
    posthog.init(env.posthogKey, {
      api_host: env.posthogHost,
      capture_pageview: false,
      capture_pageleave: true,
      autocapture: true,
      persistence: "localStorage",
      disable_session_recording: false,
      session_recording: { maskAllInputs: true },
    });
    return posthog;
  }).catch((error) => { analytics = undefined; throw error; });
  return analytics;
}

function PostHogTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams?.toString();
  useEffect(() => {
    if (!env.posthogKey || !pathname) return;
    let cancelled = false;
    const capture = () => {
      void loadAnalytics().then((posthog) => {
        if (!cancelled) posthog.capture("$pageview", {
          $current_url: `${window.location.origin}${pathname}${query ? `?${query}` : ""}`,
        });
      }).catch(() => { /* Analytics must not interrupt the page. */ });
    };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(capture, { timeout: 2000 });
      return () => { cancelled = true; window.cancelIdleCallback(id); };
    }
    const id = setTimeout(capture, 1000);
    return () => { cancelled = true; clearTimeout(id); };
  }, [pathname, query]);
  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <>{children}<Suspense fallback={null}><PostHogTracker /></Suspense></>;
}
