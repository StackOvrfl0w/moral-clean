import initialGuides from "./guides.json";
import additionalGuides from "./additional-guides.json";

export type Guide = {
  slug: string;
  title: string;
  description: string;
  date: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  links: { label: string; href: string }[];
  references?: { label: string; href: string }[];
  comparison?: { columns: string[]; rows: string[][] };
};

export const guides: Guide[] = [...initialGuides, ...additionalGuides];

export function getRelatedGuides(categorySlug?: string, currentSlug?: string) {
  const current = guides.find((guide) => guide.slug === currentSlug);
  const categories = categorySlug
    ? [`/products/category/${categorySlug}`]
    : current?.links.map((link) => link.href).filter((href) => href.startsWith("/products/category/")) ?? [];
  const candidates = guides.filter((guide) => guide.slug !== currentSlug);
  const ranked = candidates.map((guide, order) => ({
    guide,
    order,
    score: guide.links.filter((link) => categories.includes(link.href)).length
      + (current?.links.some((link) => link.href === `/guides/${guide.slug}`) ? 2 : 0),
  }));
  return ranked.sort((a, b) => b.score - a.score || b.guide.date.localeCompare(a.guide.date) || a.order - b.order).slice(0, 3).map(({ guide }) => guide);
}
