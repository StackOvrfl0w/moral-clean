import * as Sentry from "@sentry/nextjs";

import { env } from "@/config/env";

Sentry.init({
  dsn: env.sentryDsn || undefined,
  environment: env.sentryEnvironment,
  tracesSampleRate: 0.1,
  sendDefaultPii: false,
});
