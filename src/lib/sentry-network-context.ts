import type { Event } from "@sentry/nextjs";

// A stackless NetworkError does not identify its source. Preserve it and attach
// browser state so a recurrence can distinguish offline clients from font errors.
export function addBrowserNetworkContext<T extends Event>(
  event: T,
  browser: { online: boolean; fonts: Iterable<Pick<FontFace, "family" | "status" | "weight">> },
): T {
  if (!event.exception?.values?.some((exception) =>
    /\bNetworkError\b/.test(exception.value ?? "") || exception.type === "NetworkError",
  )) return event;

  const failedFonts = Array.from(browser.fonts)
    .filter((font) => font.status === "error")
    .slice(0, 20)
    .map((font) => ({ family: font.family, weight: font.weight }));
  return {
    ...event,
    contexts: {
      ...event.contexts,
      browser_network: {
        online: browser.online,
        failed_font_count: failedFonts.length,
        failed_fonts: failedFonts,
      },
    },
  };
}
