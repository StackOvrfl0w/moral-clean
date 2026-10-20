import * as Sentry from "@sentry/nextjs";

import { env } from "@/config/env";
import { isInjectedRuntimeGetReaderError } from "@/lib/sentry-client-filter";
import { addBrowserNetworkContext } from "@/lib/sentry-network-context";

Sentry.init({
  dsn: env.publicSentryDsn || undefined,
  environment: env.sentryEnvironment,
  tracesSampleRate: 0.1,
  sendDefaultPii: false,
  beforeSend(event) {
    if (isInjectedRuntimeGetReaderError(event)) return null;
    try {
      return addBrowserNetworkContext(event, {
        online: navigator.onLine,
        fonts: document.fonts,
      });
    } catch {
      // Diagnostics must never prevent the original event from being reported.
      return event;
    }
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
