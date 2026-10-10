import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, Clock3 } from "lucide-react";
import { notFound } from "next/navigation";
import { guides } from "@/content/guides";
import { formatGuideDate, getGuidePresentation, getReadingMinutes } from "@/content/guide-presentation";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { JsonLd } from "@/components/seo/JsonLd";
import { GuideLinks } from "@/components/seo/GuideLinks";

export function generateStaticParams() { return guides.map(({ slug }) => ({ slug })); }
export function generateMetadata({ params }: { params: { slug: string } }) {
  const guide = guides.find((item) => item.slug === params.slug);
  if (!guide) notFound();
  return pageMetadata({ title: guide.title, description: guide.description, path: `/guides/${guide.slug}`, article: true, image: `/guides/${guide.slug}/social-image` });
}
export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = guides.find((item) => item.slug === params.slug);
  if (!guide) notFound();
  const visual = getGuidePresentation(guide);
  return <><BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Guides", url: "/guides" }, { name: guide.title, url: `/guides/${guide.slug}` }]} />
    <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.description, image: [absoluteUrl(visual.image), absoluteUrl(`/guides/${guide.slug}/social-image`)], datePublished: guide.date, dateModified: guide.date, author: { "@type": "Organization", name: "Moral Clean", url: absoluteUrl("/") }, publisher: { "@id": `${absoluteUrl("/")}#organization` }, mainEntityOfPage: absoluteUrl(`/guides/${guide.slug}`) }} />
    <article>
      <header className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute left-0 top-0 h-1 w-full bg-brand-gradient" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl items-center gap-9 px-4 py-10 sm:px-6 lg:grid-cols-[1.35fr_1fr] lg:px-8 lg:py-14">
          <div><Link href="/guides" className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:underline"><ArrowLeft size={16} aria-hidden="true" /> All equipment guides</Link><p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">{visual.label} / Practical guide</p><h1 className="mt-4 text-3xl leading-tight text-white sm:text-4xl lg:text-[2.65rem]">{guide.title}</h1><div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-200"><span>By Moral Clean</span><time dateTime={guide.date}>{formatGuideDate(guide.date)}</time><span className="inline-flex items-center gap-2"><Clock3 size={15} aria-hidden="true" /> {getReadingMinutes(guide)} min read</span></div></div>
          <figure className="overflow-hidden rounded-2xl bg-slate-50 p-5 text-brand-navy"><div className="relative aspect-[4/3]">{!visual.photo ? <div className="absolute inset-4 rounded-full bg-white" aria-hidden="true" /> : null}<Image src={visual.image} alt={visual.alt} fill priority sizes="(max-width: 1023px) 90vw, 480px" className={visual.photo ? "rounded-xl object-cover" : "object-contain"} /></div><figcaption className="mt-3 text-center text-xs leading-5 text-slate-500">{visual.photo ? "Equipment care and service reference" : "Category illustration · confirm the exact model in your quotation"}</figcaption></figure>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14 lg:px-8 lg:py-14">
        <aside className="min-w-0"><div className="lg:sticky lg:top-40"><nav aria-label="Article contents" className="rounded-xl border bg-muted p-5"><h2 className="text-lg">In this guide</h2><ol className="mt-4 space-y-4">{guide.sections.map((section, index) => <li key={section.heading}><a className="flex gap-3 text-sm leading-6 text-muted-foreground hover:text-accent hover:underline" href={`#section-${index + 1}`}><span className="font-semibold text-accent">{String(index + 1).padStart(2, "0")}</span><span>{section.heading}</span></a></li>)}</ol></nav><div className="mt-5 hidden rounded-xl border p-5 lg:block"><p className="text-sm font-semibold">Shortlisting equipment?</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Compare specifications against your floor, access and workload.</p><Link href="/products" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">Explore equipment <ArrowRight size={16} aria-hidden="true" /></Link></div></div></aside>
        <div className="min-w-0 max-w-3xl">
          <p className="text-lg leading-8 text-muted-foreground">{guide.intro}</p>
          <section className="mt-7 rounded-xl border-l-4 border-accent bg-muted p-6"><h2 className="text-xl">The decision in three points</h2><ul className="mt-4 space-y-3">{visual.takeaways.map((takeaway) => <li key={takeaway} className="flex gap-3 text-sm leading-7"><Check size={18} className="mt-1 shrink-0 text-accent" aria-hidden="true" /><span>{takeaway}</span></li>)}</ul></section>
          {guide.comparison ? <div className="mt-9 overflow-x-auto rounded-xl border"><table className="w-full min-w-[600px] text-left text-sm"><caption className="p-5 text-left font-semibold">Compare the cleaning processes</caption><thead className="bg-brand-navy text-white"><tr>{guide.comparison.columns.map((column) => <th scope="col" key={column} className="p-4">{column}</th>)}</tr></thead><tbody>{guide.comparison.rows.map((row) => <tr key={row[0]} className="border-t even:bg-muted"><th scope="row" className="p-4">{row[0]}</th>{row.slice(1).map((cell) => <td key={cell} className="p-4 leading-6 text-muted-foreground">{cell}</td>)}</tr>)}</tbody></table></div> : null}
          {guide.sections.map((section, index) => <section key={section.heading} id={`section-${index + 1}`} className="mt-11 scroll-mt-28 lg:scroll-mt-44"><p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">Step {String(index + 1).padStart(2, "0")}</p><h2 className="text-2xl leading-snug">{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 text-base leading-8 text-muted-foreground">{paragraph}</p>)}</section>)}
          {guide.references?.length ? <section className="mt-11 rounded-xl border p-6"><h2 className="text-xl">Manufacturer references</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">These references explain equipment principles. Confirm the features and instructions of the exact model being considered.</p><ul className="mt-4 space-y-3">{guide.references.map((reference) => <li key={reference.href}><a href={reference.href} className="text-sm text-accent underline underline-offset-4">{reference.label}</a></li>)}</ul></section> : null}
          <section className="mt-11 rounded-2xl bg-brand-navy p-6 text-white sm:p-8"><p className="text-xs font-semibold uppercase tracking-widest text-cyan-200">Your next step</p><h2 className="mt-3 text-2xl text-white">Match the guide to your equipment shortlist.</h2><ul className="mt-5 space-y-3">{guide.links.map((link) => <li key={link.href}><Link href={link.href} className="inline-flex items-center gap-2 text-sm text-cyan-100 underline underline-offset-4">{link.label}<ArrowRight size={15} aria-hidden="true" /></Link></li>)}</ul><Link href="/contact?subject=Quotation" data-quote-request className="mt-7 inline-flex items-center gap-2 rounded-lg bg-brand-gradient px-5 py-3 text-sm font-semibold text-brand-navy">Request a specification-based quote <ArrowRight size={17} aria-hidden="true" /></Link></section>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8"><GuideLinks currentSlug={guide.slug} /></div>
    </article>
  </>;
}
