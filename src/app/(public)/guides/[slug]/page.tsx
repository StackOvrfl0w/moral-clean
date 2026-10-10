import Link from "next/link";
import { notFound } from "next/navigation";
import guides from "@/content/guides.json";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { JsonLd } from "@/components/seo/JsonLd";
import { GuideLinks } from "@/components/seo/GuideLinks";

export function generateStaticParams() { return guides.map(({ slug }) => ({ slug })); }
export function generateMetadata({ params }: { params: { slug: string } }) {
  const guide = guides.find((item) => item.slug === params.slug);
  if (!guide) notFound();
  return pageMetadata({ title: guide.title, description: guide.description, path: `/guides/${guide.slug}`, article: true });
}
export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = guides.find((item) => item.slug === params.slug);
  if (!guide) notFound();
  return <><BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Guides", url: "/guides" }, { name: guide.title, url: `/guides/${guide.slug}` }]} />
    <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.description, datePublished: guide.date, dateModified: guide.date, author: { "@type": "Organization", name: "Moral Clean", url: absoluteUrl("/") }, publisher: { "@id": `${absoluteUrl("/")}#organization` }, mainEntityOfPage: absoluteUrl(`/guides/${guide.slug}`) }} />
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6"><Link href="/guides" className="text-sm font-semibold text-primary underline">All equipment guides</Link><h1 className="mt-6 text-4xl leading-tight">{guide.title}</h1><p className="mt-4 text-sm text-muted-foreground">By Moral Clean · <time dateTime={guide.date}>9 October 2026</time></p><p className="mt-6 text-lg leading-8 text-muted-foreground">{guide.intro}</p>
      {guide.sections.map((section) => <section key={section.heading} className="mt-10"><h2 className="text-2xl">{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 leading-8 text-muted-foreground">{paragraph}</p>)}</section>)}
      <section className="mt-10 rounded-md bg-muted p-6"><h2 className="text-2xl">Related equipment and support</h2><ul className="mt-4 space-y-3">{guide.links.map((link) => <li key={link.href}><Link href={link.href} className="font-semibold text-primary underline">{link.label}</Link></li>)}</ul><Link href="/contact?subject=Quotation" className="mt-5 inline-block font-semibold text-primary underline">Request a quotation for your requirements</Link></section><GuideLinks />
    </article>
  </>;
}
