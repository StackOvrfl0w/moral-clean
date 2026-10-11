export function productEnquiryHref(slug: string, purpose?: "documentation" | "parts") {
  const params = new URLSearchParams({ product: slug });
  if (purpose) params.set("purpose", purpose);
  return "/contact?" + params.toString();
}

export function productEnquiryMessage(name: string, purpose?: string) {
  const request = purpose === "documentation"
    ? "Please provide the model datasheet, operating instructions and included accessories."
    : purpose === "parts"
      ? "Part needed:\nMachine model and serial plate:\nComponent reference or dimensions:"
      : "Facility location:\nSurface or cleaning task:\nCleaning area and daily workload:\nRequired quantity:";
  return "Inquiry about: " + name + "\n" + request + "\n";
}

export function brochureUrl(specifications: unknown): string | null {
  if (!specifications || typeof specifications !== "object" || Array.isArray(specifications)) return null;
  const value = (specifications as Record<string, unknown>).brochure_url;
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}
