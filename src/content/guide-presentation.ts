import type { Guide } from "./guides";

export type GuidePresentation = {
  group: "buying" | "comparisons" | "care";
  label: string;
  image: string;
  alt: string;
  photo?: boolean;
  takeaways: string[];
};
const ride = "/assets/categories/Ride-on-scrubber-dryer.png";
const single = "/assets/categories/Single-disk-machine.png";
export const guidePresentation: Record<string, GuidePresentation> = {
  "walk-behind-vs-ride-on-scrubber-dryer": { group: "comparisons", label: "Scrubber dryers", image: ride, alt: "Ride on scrubber dryer with operator seat and floor-cleaning brushes", takeaways: ["Measure the usable route and narrowest access.", "Compare practical cleaning time, including tank stops.", "Confirm batteries, charger and accessories in writing."] },
  "floor-cleaning-machine-costs-pakistan": { group: "buying", label: "Procurement", image: single, alt: "Single disc floor machine with handle and cleaning head", takeaways: ["Choose the cleaning process before comparing prices.", "Compare the same model configuration and accessories.", "Include consumables, delivery and service scope."] },
  "cleaning-machine-maintenance-checklist": { group: "care", label: "Maintenance", image: "/assets/services-image/part-replacement.png", alt: "Cleaning pad and components beneath a commercial floor machine", photo: true, takeaways: ["Record the model, symptoms and operating conditions.", "Inspect only the items permitted by the manual.", "Confirm compatibility and repair scope before work."] },
  "wet-dry-vacuum-cleaner-buying-guide-pakistan": { group: "buying", label: "Vacuum cleaners", image: "/assets/categories/Vaccumcleaners.png", alt: "Commercial vacuum cleaner with tank, hose and floor tool", takeaways: ["Identify the pickup material and required filtration.", "Compare capacity with emptying and handling needs.", "Confirm the included hose, tools and replacement filters."] },
  "commercial-steam-cleaner-buying-guide-pakistan": { group: "buying", label: "Steam cleaners", image: "/assets/categories/steam-cleaner.png", alt: "Steam cleaning equipment with tank, controls and transport wheels", takeaways: ["Confirm heat and moisture compatibility first.", "Compare output, refill method and residue recovery.", "Request evidence for any model-specific hygiene claim."] },
  "commercial-pressure-washer-pressure-flow-guide": { group: "buying", label: "Pressure washers", image: "/assets/categories/Pressure-washer.png", alt: "Wheeled pressure washer with handle and hose connection", takeaways: ["Compare operating pressure and water flow together.", "Check the available water and electrical supply.", "Specify the surface, duty cycle and required accessories."] },
  "single-disc-machine-vs-scrubber-dryer": { group: "comparisons", label: "Floor care", image: single, alt: "Single disc floor machine illustrating floor-care equipment selection", takeaways: ["Distinguish periodic treatment from routine washing.", "Include a recovery method for wet single-disc work.", "Compare complete workflows on the same floor."] },
  "floor-sweeper-vs-scrubber-dryer": { group: "comparisons", label: "Cleaning processes", image: ride, alt: "Ride on scrubber dryer illustrating the wet-scrubbing side of the comparison", takeaways: ["Separate loose debris from soil that needs washing.", "Assess whether the site needs a sequence of processes.", "Check disposal, tanks, route access and handling."] },
  "warehouse-floor-cleaning-equipment-checklist-pakistan": { group: "buying", label: "Facility planning", image: "/assets/categories/walk-behind-scrubber-dryer.png", alt: "Walk behind floor scrubber dryer with handle and recovery system", takeaways: ["Measure accessible aisles rather than total building area.", "Plan around traffic, storage and the cleaning window.", "Use a representative trial and a complete quotation."] },
};
export function getGuidePresentation(guide: Guide) { return guidePresentation[guide.slug]; }
export function getReadingMinutes(guide: Guide) {
  const words = [guide.intro, ...guide.sections.flatMap((section) => section.paragraphs)].join(" ").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
export function formatGuideDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}
