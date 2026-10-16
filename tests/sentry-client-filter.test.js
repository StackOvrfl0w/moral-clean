import { describe, expect, test } from "bun:test";
import { isInjectedRuntimeGetReaderError } from "../src/lib/sentry-client-filter";

function event(frames, overrides = {}) {
  return {
    exception: {
      values: [{
        type: "TypeError",
        value: "Cannot read properties of undefined (reading 'getReader')",
        mechanism: { type: "auto.browser.global_handlers.onunhandledrejection", handled: false },
        stacktrace: { frames },
        ...overrides,
      }],
    },
  };
}

const injectedFrames = [
  { filename: "ext:core/01_core.js", abs_path: "ext:core/01_core.js", function: "eventLoopTick" },
  { filename: "<script>", function: "I" },
];

describe("Sentry injected runtime filtering", () => {
  test("recognizes the observed injected-runtime rejection across routes", () => {
    for (const transaction of ["/contact", "/about", "/"]) {
      expect(isInjectedRuntimeGetReaderError({ ...event(injectedFrames), transaction })).toBe(true);
    }
  });

  test("preserves the same error in application and Next.js frames", () => {
    for (const filename of ["https://moralclean.com/_next/static/chunks/app/contact/page.js", "webpack-internal:///src/components/contact/ContactForm.tsx"]) {
      expect(isInjectedRuntimeGetReaderError(event([...injectedFrames, { filename }]))).toBe(false);
      expect(isInjectedRuntimeGetReaderError(event([{ filename }]))).toBe(false);
    }
  });

  test("preserves other errors and manually captured exceptions", () => {
    expect(isInjectedRuntimeGetReaderError(event(injectedFrames, { value: "Failed to fetch" }))).toBe(false);
    expect(isInjectedRuntimeGetReaderError(event(injectedFrames, { type: "Error" }))).toBe(false);
    expect(isInjectedRuntimeGetReaderError(event(injectedFrames, { mechanism: { type: "generic", handled: true } }))).toBe(false);
  });

  test("preserves missing, anonymous, and ambiguous stack information", () => {
    for (const frames of [[], [{ filename: "<script>" }], [{ filename: "ext:core/01_core.js" }, {}], [{ filename: "ext:core/01_core.js", abs_path: "https://moralclean.com/app.js" }]]) {
      expect(isInjectedRuntimeGetReaderError(event(frames))).toBe(false);
    }
    expect(isInjectedRuntimeGetReaderError({})).toBe(false);
  });

  test("preserves linked exceptions even when one matches the external runtime", () => {
    const linked = event(injectedFrames);
    linked.exception.values.push({ type: "Error", value: "Application failure" });
    expect(isInjectedRuntimeGetReaderError(linked)).toBe(false);
  });
});
