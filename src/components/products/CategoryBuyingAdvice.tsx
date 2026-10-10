import Link from "next/link";
import { categoryAdvice } from "@/content/categories";
import { GuideLinks } from "@/components/seo/GuideLinks";
import { getCategoryModels } from "@/lib/queries/categories";

export async function CategoryBuyingAdvice({ slug, categoryId }: { slug: string; categoryId: string }) {
  const advice = categoryAdvice[slug];
  if (!advice) return null;
  const models = await getCategoryModels(categoryId);
  return <section className="bg-background py-12">
    <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
      <div><h2 className="text-2xl">How to choose {slug === "steam-cleaners" ? "a steam cleaner" : "equipment for your facility"}</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-muted-foreground">{advice.selection.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
      {models.length > 1 ? <div><h2 className="mb-4 text-2xl">Compare listed models</h2>
        <p className="mb-4 text-sm text-muted-foreground">Specifications below come from the individual catalogue records. Confirm configuration, accessories and current availability in the written quotation.</p>
        <div className="overflow-x-auto rounded-md border"><table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-muted"><tr><th scope="col" className="p-4">Model</th><th scope="col" className="p-4">Selected specifications</th></tr></thead>
          <tbody>{models.map((model) => {
            const specifications = model.specifications && typeof model.specifications === "object" && !Array.isArray(model.specifications) ? model.specifications : {};
            const entries = Object.entries(specifications).filter(([key, value]) => /scrubbing path|work.*width|machine width|tank|capacity|speed|max power|working width/i.test(key) && (typeof value === "string" || typeof value === "number")).slice(0, 4);
            return <tr key={model.slug} className="border-t"><th scope="row" className="p-4 font-semibold"><Link className="text-primary underline underline-offset-4" href={`/products/${model.slug}`}>{model.name}</Link></th><td className="p-4 text-muted-foreground">{entries.length ? <ul className="space-y-1">{entries.map(([key, value]) => <li key={key}>{key}: {String(value)}</li>)}</ul> : "Request the model datasheet"}</td></tr>;
          })}</tbody>
        </table></div>
      </div> : null}
      <div><h2 className="mb-4 text-2xl">Buying questions</h2>{advice.questions.map((item) => <details key={item.question} className="border-b py-4"><summary className="cursor-pointer font-semibold text-primary">{item.question}</summary><p className="mt-3 leading-7 text-muted-foreground">{item.answer}</p></details>)}</div>
      <div className="rounded-md bg-muted p-6"><h2 className="text-2xl">Request a specification-based quotation</h2><p className="mt-3 text-muted-foreground">Send your facility location, floor or surface type, cleaning area, daily workload and required quantities. Ask for the model specification, included accessories, delivery terms and service scope.</p><Link className="mt-4 inline-block font-semibold text-primary underline underline-offset-4" href={`/contact?subject=Quotation&category=${encodeURIComponent(slug)}`}>Send your requirements</Link></div>
      <GuideLinks />
    </div>
  </section>;
}
