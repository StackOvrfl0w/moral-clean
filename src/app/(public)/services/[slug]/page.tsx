import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { JsonLd } from "@/components/seo/JsonLd";
import { getServicePage, servicePages } from "@/content/service-pages";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return servicePages.map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = getServicePage(params.slug);
  return page ? pageMetadata({ title: `${page.title} in Pakistan`, description: page.description, path: `/services/${page.slug}`, image: page.image }) : { title: "Service not found", robots: { index: false, follow: false } };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const page = getServicePage(params.slug);
  if (!page) notFound();
  const path = `/services/${page.slug}`;
  return <>
    <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Services", url: "/services" }, { name: page.title, url: path }]} />
    <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", "@id": absoluteUrl(`${path}#service`), url: absoluteUrl(path), name: page.title, description: page.description, image: absoluteUrl(page.image), serviceType: page.title, provider: { "@id": absoluteUrl("/#organization") } }} />
    <section className="bg-brand-navy py-12 text-white lg:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap gap-2 text-sm text-white/80"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/services">Services</Link></nav>
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#00defc]">Equipment service support</p>
          <h1 className="font-display text-4xl leading-tight text-white lg:text-5xl">{page.title}</h1>
          <p className="mt-6 leading-8 text-white/85">{page.intro}</p>
          <Link href={`/contact?service=${page.serviceSlug}`} className="mt-7 inline-flex rounded-md bg-brand-gradient px-6 py-3 font-semibold text-brand-navy hover:brightness-110">Request an assessment</Link>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/20 bg-white">
          <Image src={page.image} alt={page.imageAlt} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-contain p-4" />
        </div>
      </div>
    </section>
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8 lg:py-16">
      <div className="min-w-0 space-y-10" aria-label="Service details">
        {page.sections.map((section) => <section key={section.heading}><h2 className="text-2xl text-brand-navy">{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 leading-8 text-muted-foreground">{paragraph}</p>)}</section>)}
        <section aria-labelledby="service-faq"><h2 id="service-faq" className="mb-5 text-2xl text-brand-navy">Service questions</h2><div className="divide-y rounded-xl border border-border bg-white px-5">{page.faqs.map((faq) => <details key={faq.question} className="py-5"><summary className="cursor-pointer font-semibold text-brand-navy">{faq.question}</summary><p className="mt-4 leading-7 text-muted-foreground">{faq.answer}</p></details>)}</div></section>
        <section><h2 className="text-2xl text-brand-navy">Related equipment and advice</h2><ul className="mt-5 space-y-3">{page.links.map((link) => <li key={link.href}><Link className="font-medium text-primary underline decoration-accent underline-offset-4" href={link.href}>{link.label}</Link></li>)}</ul></section>
      </div>
      <aside className="self-start rounded-xl border border-border bg-muted p-6 lg:sticky lg:top-40" aria-labelledby="enquiry-checklist">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Prepare your enquiry</p><h2 id="enquiry-checklist" className="mt-3 text-2xl text-brand-navy">Send these details</h2>
        <ul className="mt-5 list-disc space-y-4 pl-5 text-sm leading-6 text-muted-foreground">{page.checklist.map((item) => <li key={item}>{item}</li>)}</ul>
        <p className="mt-6 text-sm leading-6 text-muted-foreground">Confirm serviceability, parts, location, timing and costs before authorizing work.</p>
        <Link className="mt-6 inline-flex rounded-md bg-brand-navy px-5 py-3 font-semibold text-white" href={`/contact?service=${page.serviceSlug}`}>Send a service enquiry</Link>
      </aside>
    </div>
  </>;
}
