import Link from "next/link";
import guides from "@/content/guides.json";

export function GuideLinks() {
  return <section className="my-8 rounded-md border border-border bg-white p-6">
    <h2 className="text-2xl">Equipment buying and maintenance guides</h2>
    <ul className="mt-4 space-y-3">{guides.map((guide) => <li key={guide.slug}><Link href={`/guides/${guide.slug}`} className="font-semibold text-primary underline underline-offset-4">{guide.title}</Link></li>)}</ul>
  </section>;
}
