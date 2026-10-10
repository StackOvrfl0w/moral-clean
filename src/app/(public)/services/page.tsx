import { getServicePageByCatalogSlug } from "@/content/service-pages";
import { GuideLinks } from "@/components/seo/GuideLinks";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BrushCleaning, Cog, MapPin, Settings, Wrench } from "lucide-react";

import { CtaBanner } from "@/components/sections/CtaBanner";
import { SectionHeader } from "@/components/ui/section-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getServices } from "@/lib/queries/services";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo";


export const metadata: Metadata = pageMetadata({
  title: 'Cleaning Machine Repair & Maintenance in Pakistan', description: 'Get motor repair, parts replacement, brush refilling and maintenance for commercial cleaning equipment. Send your equipment details and location to confirm service arrangements.', path: '/services',
});

type Step = {
  title: string;
  description: string;
};

const processSteps: Step[] = [
  {
    title: "Diagnose",
    description: "We assess the equipment and identify issues.",
  },
  {
    title: "Quote",
    description: "Transparent pricing on parts and labor before work begins.",
  },
  {
    title: "Service",
    description:
      "Confirm the proposed parts, labour and service arrangements before authorizing work.",
  },
  {
    title: "Test & Deliver",
    description: "Agree the completion checks and collection or return arrangements for the job.",
  },
];

const locationDetails = ["Facility city and access", "Assessment location", "Attendance availability", "Collection and return transport"];

const faqs = [
  {
    question: "How quickly can your team respond to a service request?",
    answer:
      "Send the model, fault symptoms and location. Response and assessment timing must be confirmed for your request; no fixed turnaround is promised.",
  },
  {
    question: "Do you provide on-site service or workshop-only repairs?",
    answer:
      "Assessment location, on-site attendance and workshop handling depend on the equipment and location. Confirm the arrangements before moving the machine or booking work.",
  },
  {
    question: "Do you use original parts?",
    answer:
      "Ask the quote to identify the replacement part, its compatibility and whether it is an original manufacturer component or another specified replacement. Availability and lead time need confirmation.",
  },
  {
    question: "Can you service machines not purchased from Moral Clean?",
    answer:
      "Share the brand, model, serial plate and fault symptoms. Serviceability and parts availability must be confirmed before work is accepted.",
  },
  {
    question: "Is service work covered by warranty?",
    answer:
      "Warranty coverage depends on machine type, part type, and service history. Our team clarifies applicable warranty terms in the quote stage.",
  },
  {
    question: "What payment terms do you offer for service jobs?",
    answer:
      "Confirm the payment terms, assessment charges, parts and labour costs in the agreed quotation before authorizing work.",
  },
];

function serviceIcon(iconName: string | null) {
  const value = iconName?.toLowerCase().trim();

  if (value === "wrench") return Wrench;
  if (value === "settings") return Settings;
  if (value === "brush") return BrushCleaning;

  return Cog;
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": services.map((service) => ({
          "@type": "Service",
          "@id": absoluteUrl(getServicePageByCatalogSlug(service.slug) ? `/services/${getServicePageByCatalogSlug(service.slug)!.slug}#service` : `/services#${service.slug}`),
          url: absoluteUrl(getServicePageByCatalogSlug(service.slug) ? `/services/${getServicePageByCatalogSlug(service.slug)!.slug}` : `/services#${service.slug}`),
          name: service.name,
          description: service.short_description || undefined,
          serviceType: service.name,
          provider: { "@id": absoluteUrl("/#organization") },
        })),
      }} />
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="What We Offer" title="Cleaning Machine Repair, Parts & Brush Refilling" as="h1" />

          <div className="space-y-8">
            {services.map((service, index) => {
              const details = getServicePageByCatalogSlug(service.slug);
              const Icon = serviceIcon(service.icon_name);
              const mediaFirst = index % 2 === 0;

              return (
                <article
                  key={service.id}
                  id={service.slug}
                  className="grid gap-6 rounded-lg border border-border bg-white p-6 shadow-sm lg:grid-cols-2 lg:gap-8"
                >
                  <div
                    className={cn(
                      "relative order-2 overflow-hidden rounded-md border border-border lg:order-1",
                      service.image_url
                        ? "bg-muted"
                        : "bg-[linear-gradient(130deg,rgb(var(--color-brand-surface))_0%,rgb(var(--color-brand-background))_100%)] p-6",
                      !mediaFirst && "lg:order-2",
                    )}
                  >
                    {service.image_url ? (
                      <div className="relative min-h-[240px] aspect-[4/3]">
                        <Image
                          src={service.image_url}
                          alt={`${service.name} for commercial cleaning equipment`}
                          fill
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className="h-full w-full object-contain rounded-md"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(var(--color-brand-accent),0.2),transparent_35%),radial-gradient(circle_at_75%_75%,rgba(var(--color-navy),0.08),transparent_40%)]" />
                        <div className="relative flex h-full min-h-[240px] items-center justify-center">
                          <Icon
                            className="size-20 text-primary/65"
                            aria-hidden="true"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div
                    className={cn(
                      "order-1 lg:order-2",
                      !mediaFirst && "lg:order-1",
                    )}
                  >
                    <h2 className="font-display text-3xl">{service.name}</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                      {service.short_description ||
                        "Professional service support for commercial cleaning equipment."}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground whitespace-pre-line">
                      {service.long_description ||
                        "Detailed service scope is shared after an initial technical assessment."}
                    </p>

                    {details ? <p className="mt-5"><Link className="font-semibold text-primary underline decoration-accent underline-offset-4" href={`/services/${details.slug}`}>View {details.title.toLowerCase()} details</Link></p> : null}
                    <Button
                      asChild
                      className="mt-6 border-0 bg-brand-gradient text-white hover:opacity-100 hover:brightness-110 transition-all"
                    >
                      <Link href={`/contact?service=${service.slug}`}>
                        Request This Service
                      </Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="service-process" className="bg-brand-gradient py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="How It Works"
            title="Our Service Process"
            descriptionClassName="text-brand-navy/80"
            className="[&>p:first-child]:text-brand-navy/80 [&>h2]:text-brand-navy"
          />

          <div className="grid gap-4 md:grid-cols-4 md:gap-6">
            {processSteps.map((step, index) => (
              <div
                key={step.title}
                className="relative rounded-md border border-brand-navy/15 bg-white p-5 shadow-sm"
              >
                {index < processSteps.length - 1 ? (
                  <div className="absolute left-[calc(100%+1px)] top-9 hidden h-[calc(100%+1.5rem)] w-[calc(gap)] bg-transparent md:block" />
                ) : null}
                <div className="mb-4 inline-flex size-9 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="text-xl text-brand-navy">{step.title}</h3>
                <p className="mt-2 text-sm text-brand-navy/75">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2>Plan the Service Location and Transport</h2>
            <p className="mt-4 text-muted-foreground">
              Share your city and facility location with the equipment details. Confirm where assessment can take place, whether attendance is available and how the equipment will be transported before arranging service.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {locationDetails.map((city) => (
                <li
                  key={city}
                  className="flex items-center gap-2 text-sm font-medium text-primary"
                >
                  <MapPin className="size-4 text-accent" aria-hidden="true" />
                  <span>{city}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-lg border border-border bg-white p-4">
            <div className="relative aspect-[4/3]">
              <Image
                src="/assets/map.jpg"
                alt="Map of Pakistan for service-location enquiries"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        heading="Request an Equipment Assessment"
        subtitle="Share your machine model and fault details. Our service team will respond with practical next steps, parts guidance, and turnaround expectations."
        primaryLabel="Request Service Support"
        primaryHref="/contact"
        secondaryLabel="Call Service Team"
      />

      <section className="bg-muted py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 id="faq">Frequently Asked Questions</h2>
          </div>
          <div className="rounded-md border border-border bg-white px-6">
            <Accordion type="single" collapsible>
              {faqs.map((item) => (
                <AccordionItem key={item.question} value={item.question}>
                  <AccordionTrigger className="text-base font-semibold text-primary">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-7 text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><GuideLinks /></div>
    </>
  );
}
