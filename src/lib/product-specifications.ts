// The catalogue pairs 440 mm with 20 inches for this field. Neither value
// can be selected without manufacturer evidence. Keep the shared DB unchanged.
export function isDisplayableSpecification(slug: string, key: string) {
  return !(slug === "biemmedue-ms-17-fast-single-disc-floor-machine" &&
    key.replace(/[_-]/g, " ").trim().toLowerCase() === "machine width");
}
