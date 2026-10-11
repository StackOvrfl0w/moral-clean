"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { env } from "@/config/env";

import { loadAnalytics, trackInquiry } from "@/lib/analytics";

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
          $current_url: `${window.location.origin}${pathname}`,
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
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const url = new URL(anchor.href, window.location.origin);
      const productSlug = pathname?.match(/^\/products\/(?!category\/)([^/]+)$/)?.[1];
      const categorySlug = pathname?.match(/^\/products\/category\/([^/]+)$/)?.[1];
      if (url.protocol === "tel:") trackInquiry("contact_channel_click", { channel: "phone" });
      else if (url.hostname === "wa.me" || url.hostname === "api.whatsapp.com") trackInquiry("contact_channel_click", { channel: "whatsapp" });
      else if (url.origin === window.location.origin && url.pathname === "/contact" && (anchor.dataset.quoteRequest === "true" || url.searchParams.get("subject") === "Quotation" || url.searchParams.has("product"))) trackInquiry("quote_request_click", { product_slug: productSlug, category_slug: categorySlug });
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);
  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <>{children}<Suspense fallback={null}><PostHogTracker /></Suspense></>;
}
