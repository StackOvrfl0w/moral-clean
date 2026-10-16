import * as Sentry from "@sentry/nextjs";

import { env } from "@/config/env";
import { isInjectedRuntimeGetReaderError } from "@/lib/sentry-client-filter";

Sentry.init({
  dsn: env.publicSentryDsn || undefined,
  environment: env.sentryEnvironment,
  tracesSampleRate: 0.1,
  sendDefaultPii: false,
  beforeSend(event) {
    return isInjectedRuntimeGetReaderError(event) ? null : event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
