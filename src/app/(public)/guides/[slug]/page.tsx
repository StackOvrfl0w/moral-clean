import Link from "next/link";
import { notFound } from "next/navigation";
import { guides } from "@/content/guides";
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
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6"><Link href="/guides" className="text-sm font-semibold text-primary underline">All equipment guides</Link><h1 className="mt-6 text-4xl leading-tight">{guide.title}</h1><p className="mt-4 text-sm text-muted-foreground">By Moral Clean · <time dateTime={guide.date}>{new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${guide.date}T00:00:00Z`))}</time></p><p className="mt-6 text-lg leading-8 text-muted-foreground">{guide.intro}</p>
      <nav aria-label="Article contents" className="mt-8 rounded-md border p-6"><h2 className="text-xl">In this guide</h2><ol className="mt-3 list-decimal space-y-2 pl-5">{guide.sections.map((section, index) => <li key={section.heading}><a className="text-primary underline" href={`#section-${index + 1}`}>{section.heading}</a></li>)}</ol></nav>
      {guide.comparison ? <div className="mt-8 overflow-x-auto rounded-md border"><table className="w-full min-w-[600px] text-left text-sm"><caption className="p-4 text-left font-semibold">Compare the cleaning processes</caption><thead className="bg-muted"><tr>{guide.comparison.columns.map((column) => <th scope="col" key={column} className="p-4">{column}</th>)}</tr></thead><tbody>{guide.comparison.rows.map((row) => <tr key={row[0]} className="border-t"><th scope="row" className="p-4">{row[0]}</th>{row.slice(1).map((cell) => <td key={cell} className="p-4">{cell}</td>)}</tr>)}</tbody></table></div> : null}
      {guide.sections.map((section, index) => <section key={section.heading} id={`section-${index + 1}`} className="mt-10 scroll-mt-24"><h2 className="text-2xl">{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 leading-8 text-muted-foreground">{paragraph}</p>)}</section>)}
      {guide.references?.length ? <section className="mt-10 border-t pt-6"><h2 className="text-2xl">Manufacturer references</h2><p className="mt-3 text-sm text-muted-foreground">These references explain equipment principles. They do not establish Moral Clean dealership status or confirm features of a different model.</p><ul className="mt-4 space-y-2">{guide.references.map((reference) => <li key={reference.href}><a href={reference.href} className="text-primary underline">{reference.label}</a></li>)}</ul></section> : null}
      <section className="mt-10 rounded-md bg-muted p-6"><h2 className="text-2xl">Related equipment and support</h2><ul className="mt-4 space-y-3">{guide.links.map((link) => <li key={link.href}><Link href={link.href} className="font-semibold text-primary underline">{link.label}</Link></li>)}</ul><Link href="/contact?subject=Quotation" data-quote-request className="mt-5 inline-block font-semibold text-primary underline">Request a quotation for your requirements</Link></section><GuideLinks currentSlug={guide.slug} />
    </article>
  </>;
}
