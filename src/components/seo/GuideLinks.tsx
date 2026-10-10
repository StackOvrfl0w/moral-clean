import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getRelatedGuides } from "@/content/guides";
import { GuideCard } from "./GuideCard";

export function GuideLinks({ categorySlug, currentSlug }: { categorySlug?: string; currentSlug?: string } = {}) {
  const guides = getRelatedGuides(categorySlug, currentSlug);
  return <section className="my-10">
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Equipment knowledge</p><h2 className="text-2xl">Keep exploring</h2></div><Link href="/guides" className="inline-flex items-center gap-2 text-sm font-semibold text-accent">All equipment guides <ArrowRight size={16} aria-hidden="true" /></Link></div>
    <div className="grid gap-6 md:grid-cols-3">{guides.map((guide) => <GuideCard key={guide.slug} guide={guide} />)}</div>
  </section>;
}
