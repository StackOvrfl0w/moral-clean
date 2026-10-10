import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { guides } from "@/content/guides";
import { getGuidePresentation } from "@/content/guide-presentation";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { JsonLd } from "@/components/seo/JsonLd";
import { GuideCard } from "@/components/seo/GuideCard";

export const metadata = pageMetadata({ title: "Commercial Cleaning Equipment Guides for Pakistan", description: "Compare steam cleaners, vacuums, pressure washers, sweepers and scrubber dryers. Practical equipment selection and maintenance guides for Pakistan.", path: "/guides" });
const groups = [
  { id: "buying", title: "Buy with a clearer brief", description: "Understand the specifications, site requirements and quotation details that matter." },
  { id: "comparisons", title: "Compare the cleaning process", description: "Choose a workflow that fits your floor, soil and usable cleaning route." },
  { id: "care", title: "Look after your equipment", description: "Prepare useful information for maintenance, repairs and compatible parts." },
] as const;

export default function GuidesPage() {
  const featured = guides.find((guide) => guide.slug === "warehouse-floor-cleaning-equipment-checklist-pakistan")!;
  const visual = getGuidePresentation(featured);
  return <>
    <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Guides", url: "/guides" }]} />
    <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Commercial cleaning equipment guides", url: absoluteUrl("/guides"), mainEntity: { "@type": "ItemList", itemListElement: guides.map((guide, index) => ({ "@type": "ListItem", position: index + 1, name: guide.title, url: absoluteUrl(`/guides/${guide.slug}`) })) } }} />
    <section className="relative overflow-hidden bg-brand-navy text-white">
      <div className="absolute left-0 top-0 h-1 w-full bg-brand-gradient" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8 lg:py-16">
        <div className="self-center">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200"><BookOpen size={16} aria-hidden="true" /> Moral Clean / Equipment knowledge</p>
          <h1 className="mt-6 max-w-2xl text-4xl leading-[1.08] text-white sm:text-5xl">Commercial cleaning equipment guides.</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-200">Better equipment decisions start with the right questions. Explore practical buying, comparison and care advice for facilities in Pakistan.</p>
          <a href="#buying" className="mt-8 inline-flex items-center gap-3 rounded-lg bg-brand-gradient px-5 py-3 font-semibold text-brand-navy">Explore the guides <ArrowRight size={18} aria-hidden="true" /></a>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-6 text-sm text-slate-200"><span>{guides.length} practical articles</span><span>Equipment selection</span><span>Maintenance & care</span></div>
        </div>
        <Link href={`/guides/${featured.slug}`} className="group relative overflow-hidden rounded-2xl bg-slate-50 p-6 text-brand-navy sm:p-8">
          <div className="flex items-center justify-between gap-3"><span className="text-xs font-bold uppercase tracking-widest text-brand-accent">Featured / Facility planning</span><ArrowRight size={20} aria-hidden="true" /></div>
          <div className="relative mx-auto aspect-[4/3] w-full max-w-sm"><div className="absolute inset-6 rounded-full border border-cyan-100 bg-white" aria-hidden="true" /><Image src={visual.image} alt={visual.alt} fill priority sizes="(max-width: 1023px) 80vw, 400px" className="object-contain" /></div>
          <h2 className="mt-2 text-2xl leading-snug text-brand-navy">Build a better warehouse equipment brief.</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">Start with your floor, access and cleaning window. Then compare the complete workflow.</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-accent">Read the procurement checklist <ArrowRight size={16} aria-hidden="true" /></span>
        </Link>
      </div>
    </section>
    <div className="border-b bg-background"><nav aria-label="Guide topics" className="mx-auto flex max-w-7xl flex-wrap gap-3 px-4 py-5 sm:px-6 lg:px-8">{groups.map((group) => <a key={group.id} href={`#${group.id}`} className="rounded-full border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent">{group.id === "buying" ? "Buying guides" : group.id === "comparisons" ? "Equipment comparisons" : "Maintenance & care"}</a>)}</nav></div>
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      {groups.map((group) => <section key={group.id} id={group.id} className="scroll-mt-24"><div className="mb-7 max-w-2xl"><h2 className="text-3xl">{group.title}</h2><p className="mt-3 leading-7 text-muted-foreground">{group.description}</p></div><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{guides.filter((guide) => getGuidePresentation(guide).group === group.id).map((guide) => <GuideCard guide={guide} key={guide.slug} />)}</div></section>)}
      <section className="grid gap-7 rounded-2xl border bg-muted p-7 sm:p-10 md:grid-cols-[1fr_auto] md:items-center"><div><p className="text-xs font-bold uppercase tracking-widest text-accent">From reading to shortlisting</p><h2 className="mt-3 text-2xl">Make your requirements specific.</h2><p className="mt-4 max-w-2xl leading-7 text-muted-foreground">Share your location, surface, cleaning area and daily workload. Request the exact model, included accessories and service scope in your quotation.</p></div><Link href="/contact?subject=Quotation" data-quote-request className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground">Discuss your requirements <ArrowRight size={18} aria-hidden="true" /></Link></section>
    </div>
  </>;
}
