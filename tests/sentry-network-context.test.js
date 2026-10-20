import { expect, test } from "bun:test";
import { addBrowserNetworkContext } from "../src/lib/sentry-network-context";

test("preserves network errors and includes failed fonts and connectivity without URLs", () => {
  const event = { exception: { values: [{ type: "Error", value: "NetworkError: A network error occurred." }] }, contexts: { existing: { value: true } } };
  const result = addBrowserNetworkContext(event, { online: false, fonts: [
    { family: "Inter", status: "loaded", weight: "400" },
    { family: "Jakarta", status: "error", weight: "700" },
  ] });
  expect(result.exception).toBe(event.exception);
  expect(result.contexts.existing).toEqual({ value: true });
  expect(result.contexts.browser_network).toEqual({ online: false, failed_font_count: 1, failed_fonts: [{ family: "Jakarta", weight: "700" }] });
  expect(event.contexts).not.toHaveProperty("browser_network");
});

test("network errors with no failed fonts remain visible with no inferred cause", () => {
  const result = addBrowserNetworkContext({ exception: { values: [{ type: "NetworkError" }] } }, { online: true, fonts: [] });
  expect(result.contexts.browser_network).toEqual({ online: true, failed_font_count: 0, failed_fonts: [] });
});

test("other events remain unchanged without enumerating browser fonts", () => {
  const event = { message: "ordinary event" };
  expect(addBrowserNetworkContext(event, { online: true, get fonts() { throw new Error("unavailable"); } })).toBe(event);
});
