import Link from "next/link";
import { categoryAdvice } from "@/content/categories";
import { GuideLinks } from "@/components/seo/GuideLinks";
import { getCategoryModels } from "@/lib/queries/categories";
import { isDisplayableSpecification } from "@/lib/product-specifications";

export async function CategoryBuyingAdvice({ slug, categoryId }: { slug: string; categoryId: string }) {
  const advice = categoryAdvice[slug];
  if (!advice) return null;
  const models = await getCategoryModels(categoryId);
  return <section className="bg-background py-12">
    <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
      {advice.applications ? <div>
        <h2 className="text-2xl">Applications and operating limits</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {advice.applications.map((item) => <section key={item.heading} className="rounded-md border bg-white p-5">
            <h3 className="text-lg">{item.heading}</h3>
            <p className="mt-3 leading-7 text-muted-foreground">{item.body}</p>
          </section>)}
        </div>
      </div> : null}
      <div><h2 className="text-2xl">How to choose {slug === "steam-cleaners" ? "a steam cleaner" : "equipment for your facility"}</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-muted-foreground">{advice.selection.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
      {models.length > 1 ? <div><h2 className="mb-4 text-2xl">Compare listed models</h2>
        <p className="mb-4 text-sm text-muted-foreground">Specifications below come from the individual catalogue records. Confirm configuration, accessories and current availability in the written quotation.</p>
        <div className="overflow-x-auto rounded-md border"><table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-muted"><tr><th scope="col" className="p-4">Model</th><th scope="col" className="p-4">Selected specifications</th></tr></thead>
          <tbody>{models.map((model) => {
            const specifications = model.specifications && typeof model.specifications === "object" && !Array.isArray(model.specifications) ? model.specifications : {};
            const entries = Object.entries(specifications).filter(([key, value]) => isDisplayableSpecification(model.slug, key) && /scrubbing path|work.*width|machine width|tank|capacity|speed|max power|working width/i.test(key) && (typeof value === "string" || typeof value === "number")).slice(0, 4);
            return <tr key={model.slug} className="border-t"><th scope="row" className="p-4 font-semibold"><Link className="text-primary underline underline-offset-4" href={`/products/${model.slug}`}>{model.name}</Link></th><td className="p-4 text-muted-foreground">{entries.length ? <ul className="space-y-1">{entries.map(([key, value]) => <li key={key}>{key}: {String(value)}</li>)}</ul> : "Request the model datasheet"}</td></tr>;
          })}</tbody>
        </table></div>
      </div> : null}
      <div><h2 className="mb-4 text-2xl">Buying questions</h2>{advice.questions.map((item) => <details key={item.question} className="border-b py-4"><summary className="cursor-pointer font-semibold text-primary">{item.question}</summary><p className="mt-3 leading-7 text-muted-foreground">{item.answer}</p></details>)}</div>
      <div className="rounded-md bg-muted p-6"><h2 className="text-2xl">Request a specification-based quotation</h2><p className="mt-3 text-muted-foreground">Send your facility location, floor or surface type, cleaning area, daily workload and required quantities. Ask for the model specification, included accessories, delivery terms and service scope.</p><Link className="mt-4 inline-block font-semibold text-primary underline underline-offset-4" href={`/contact?subject=Quotation&category=${encodeURIComponent(slug)}`}>Send your requirements</Link></div>
      <GuideLinks categorySlug={slug} />
      {slug === "single-disk-machine" || slug === "ride-on-scrubber-dryer" ? <nav aria-label="Related equipment and support" className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
        <Link className="text-primary underline underline-offset-4" href="/products/category/walk-behind-scrubber">Compare walk-behind scrubber dryers</Link>
        {slug === "single-disk-machine" ? <Link className="text-primary underline underline-offset-4" href="/products/category/vacuum-cleaner">Vacuum cleaners for compatible water recovery</Link> : null}
        <Link className="text-primary underline underline-offset-4" href="/services/cleaning-machine-parts">Model and replacement-part identification</Link>
        <Link className="text-primary underline underline-offset-4" href="/services/cleaning-machine-repair">Repair assessment requirements</Link>
      </nav> : null}
    </div>
  </section>;
}
