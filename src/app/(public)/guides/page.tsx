import Link from "next/link";
import guides from "@/content/guides.json";
import { pageMetadata } from "@/lib/seo";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

export const metadata = pageMetadata({ title: "Cleaning Equipment Buying & Maintenance Guides", description: "Practical guides to scrubber dryers, floor cleaning machine costs and maintenance enquiries for commercial facilities in Pakistan.", path: "/guides" });
export default function GuidesPage() {
  return <><BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Guides", url: "/guides" }]} />
    <section className="bg-muted py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><h1>Cleaning equipment guides</h1><p className="mt-4 max-w-3xl text-muted-foreground">Compare equipment against your facility requirements, understand quotation details and prepare useful information for maintenance enquiries.</p></div></section>
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">{guides.map((guide) => <article key={guide.slug} className="rounded-md border p-6"><h2 className="text-2xl"><Link className="hover:underline" href={`/guides/${guide.slug}`}>{guide.title}</Link></h2><p className="mt-4 leading-7 text-muted-foreground">{guide.description}</p><Link className="mt-5 inline-block font-semibold text-primary underline" href={`/guides/${guide.slug}`}>Read guide</Link></article>)}</section>
  </>;
}
