import Link from "next/link";
import { getRelatedGuides } from "@/content/guides";

export function GuideLinks({ categorySlug, currentSlug }: { categorySlug?: string; currentSlug?: string } = {}) {
  const guides = getRelatedGuides(categorySlug, currentSlug);
  return <section className="my-8 rounded-md border border-border bg-white p-6">
    <h2 className="text-2xl">Equipment buying and maintenance guides</h2>
    <ul className="mt-4 space-y-3">{guides.map((guide) => <li key={guide.slug}><Link href={`/guides/${guide.slug}`} className="font-semibold text-primary underline underline-offset-4">{guide.title}</Link></li>)}</ul>
    <Link href="/guides" className="mt-4 inline-block text-primary underline">View all cleaning equipment articles</Link>
  </section>;
}
