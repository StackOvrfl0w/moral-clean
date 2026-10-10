import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Guide } from "@/content/guides";
import { getGuidePresentation, getReadingMinutes } from "@/content/guide-presentation";

export function GuideCard({ guide }: { guide: Guide }) {
  const visual = getGuidePresentation(guide);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg">
      <Link href={`/guides/${guide.slug}`} tabIndex={-1} aria-hidden="true" className="relative block aspect-[16/10] overflow-hidden bg-slate-100">
        {!visual.photo ? <div className="absolute inset-6 rounded-full bg-white/80" aria-hidden="true" /> : null}
        <Image src={visual.image} alt="" fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" className={visual.photo ? "object-cover transition-transform duration-300 motion-safe:group-hover:scale-105" : "object-contain p-3 transition-transform duration-300 motion-safe:group-hover:scale-105"} />
        <span className="absolute bottom-4 left-4 rounded-full border border-white/70 bg-white px-3 py-1 text-xs font-semibold text-brand-navy">{visual.label}</span>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent">{getReadingMinutes(guide)} min read</p>
        <h3 className="mt-3 text-xl leading-snug"><Link href={`/guides/${guide.slug}`} className="decoration-brand-accent underline-offset-4 hover:underline">{guide.title}</Link></h3>
        <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{guide.description}</p>
        <Link href={`/guides/${guide.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">Read the guide <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </div>
    </article>
  );
}
