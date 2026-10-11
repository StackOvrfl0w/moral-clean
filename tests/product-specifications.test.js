import { expect, test } from "bun:test";
import { isDisplayableSpecification } from "../src/lib/product-specifications";

test("withholds the conflicting MS17 dimension without suppressing other specifications", () => {
  const slug = "biemmedue-ms-17-fast-single-disc-floor-machine";
  expect(isDisplayableSpecification(slug, "Machine Width")).toBe(false);
  expect(isDisplayableSpecification(slug, "machine_width")).toBe(false);
  expect(isDisplayableSpecification(slug, "Motor Power")).toBe(true);
  expect(isDisplayableSpecification("other-model", "Machine Width")).toBe(true);
});
