import type { Event } from "@sentry/nextjs";

const injectedRuntime = "ext:core/01_core.js";

export function isInjectedRuntimeGetReaderError(event: Event): boolean {
  const exceptions = event.exception?.values;
  if (exceptions?.length !== 1) return false;

  const exception = exceptions[0];
  if (
    exception.type !== "TypeError" ||
    exception.value !== "Cannot read properties of undefined (reading 'getReader')" ||
    exception.mechanism?.type !== "auto.browser.global_handlers.onunhandledrejection"
  ) return false;

  const frames = exception.stacktrace?.frames ?? [];
  // This signature occurs in an injected Deno runtime, outside our browser
  // bundles. Keep errors with any application, unknown, or linked exception frame.
  return frames.some((frame) =>
    frame.filename === injectedRuntime || frame.abs_path === injectedRuntime,
  ) && frames.every((frame) => {
    const locations = [frame.filename, frame.abs_path].filter(
      (location): location is string => Boolean(location),
    );
    return locations.length > 0 && locations.every(
      (location) => location === injectedRuntime || location === "<script>",
    );
  });
}
