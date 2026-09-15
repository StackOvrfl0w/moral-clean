"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { env } from "@/config/env";

let initialized = false;

function PostHogTracker({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!env.posthogKey || initialized) return;

    posthog.init(env.posthogKey, {
      api_host: env.posthogHost,
      capture_pageview: false,
      capture_pageleave: true,
      autocapture: true,
      persistence: "localStorage",
      disable_session_recording: false,
      session_recording: {
        maskAllInputs: true,
      },
    });
    initialized = true;
  }, []);

  useEffect(() => {
    if (!initialized || !pathname) return;

    const query = searchParams?.toString();
    posthog.capture("$pageview", {
      $current_url: `${window.location.origin}${pathname}${query ? `?${query}` : ""}`,
    });
  }, [pathname, searchParams]);

  return children;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={children}><PostHogTracker>{children}</PostHogTracker></Suspense>;
}
