import { expect, test } from "bun:test";
import { brochureUrl, productEnquiryHref, productEnquiryMessage } from "../src/lib/product-enquiry";

test("documentation and parts links preserve model context with encoded parameters", () => {
  const url = new URL(productEnquiryHref("model-with & symbol", "documentation"), "https://moralclean.com");
  expect(url.pathname).toBe("/contact");
  expect(url.searchParams.get("product")).toBe("model-with & symbol");
  expect(url.searchParams.get("purpose")).toBe("documentation");
  expect(productEnquiryMessage("MS 17 FAST", "documentation")).toContain("operating instructions");
  expect(productEnquiryMessage("MS 17 FAST", "parts")).toContain("serial plate");
  expect(productEnquiryMessage("MS 17 FAST", "unknown")).toContain("Required quantity");
});
test("unsafe documentation links are omitted", () => {
  for (const value of [null, {}, { brochure_url: "javascript:alert(1)" }, { brochure_url: "http://example.com/file" }, { brochure_url: "https://user:password@example.com/file" }]) {
    expect(brochureUrl(value)).toBeNull();
  }
  expect(brochureUrl({ brochure_url: "https://example.com/manual.pdf" })).toBe("https://example.com/manual.pdf");
});
