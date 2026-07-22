import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BrushCleaning,
  Cog,
  MapPin,
  Settings,
  Wrench,
} from "lucide-react";

import { CtaBanner } from "@/components/sections/CtaBanner";
import { SectionHeader } from "@/components/ui/section-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { env } from "@/config/env";
import { getServices } from "@/lib/queries/services";
import { cn } from "@/lib/utils";

const siteUrl = env.siteUrl;

export const metadata: Metadata = {
  title: "Services",
  description:
    "Moral Clean provides after-sales service for commercial cleaning equipment, including motor repair, parts replacement, and scheduled maintenance support across Pakistan.",
  openGraph: {
    title: "Services | Moral Clean",
    description:
      "Moral Clean provides after-sales service for commercial cleaning equipment, including motor repair, parts replacement, and scheduled maintenance support across Pakistan.",
  },
  alternates: {
    canonical: `${siteUrl}/services`,
  },
};

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
      "Repairs performed by trained technicians using genuine parts.",
  },
  {
    title: "Test & Deliver",
    description: "Equipment tested and returned in working condition.",
  },
];

const cities = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
];

const faqs = [
  {
    question: "How quickly can your team respond to a service request?",
    answer:
      "Most requests are acknowledged within the same business day, and urgent cases are prioritized based on equipment criticality and location.",
  },
  {
    question: "Do you provide on-site service or workshop-only repairs?",
    answer:
      "We provide both. Basic diagnostics and many replacements can be done on-site, while deeper repairs are handled in workshop conditions when required.",
  },
  {
    question: "Do you use original parts?",
    answer:
      "Yes. We prioritize genuine manufacturer-compatible parts and confirm part availability and lead times before starting work.",
  },
  {
    question: "Can you service machines not purchased from Moral Clean?",
    answer:
      "In many cases, yes. Share machine model details and fault symptoms; we will confirm serviceability and recommended next steps.",
  },
  {
    question: "Is service work covered by warranty?",
    answer:
      "Warranty coverage depends on machine type, part type, and service history. Our team clarifies applicable warranty terms in the quote stage.",
  },
  {
    question: "What payment terms do you offer for service jobs?",
    answer:
      "Payment terms vary by scope and client account status. For most jobs, terms are shared in writing with parts and labor breakdown before work starts.",
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
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="What We Offer" title="Our Services" />

          <div className="space-y-8">
            {services.map((service, index) => {
              const Icon = serviceIcon(service.icon_name);
              const mediaFirst = index % 2 === 0;

              return (
                <article
                  key={service.id}
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
                      <div className="min-h-[240px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={service.image_url}
                          alt={service.name}
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
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                      {service.long_description ||
                        "Detailed service scope is shared after an initial technical assessment."}
                    </p>

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

      <section id="faq" className="bg-brand-gradient py-20">
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
                <div className="mb-4 inline-flex size-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
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
            <h2>Nationwide Service Network</h2>
            <p className="mt-4 text-muted-foreground">
              Our service team supports clients across major commercial and
              industrial cities in Pakistan through workshop and field service
              coordination.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {cities.map((city) => (
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
                src="/assets/pakistan-map.svg"
                alt="Map of Pakistan showing Moral Clean service coverage in major cities"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        heading="Equipment Down? Let's Get You Running Again."
        subtitle="Share your machine model and fault details. Our service team will respond with practical next steps, parts guidance, and turnaround expectations."
        primaryLabel="Request Service Support"
        primaryHref="/contact"
        secondaryLabel="Call Service Team"
      />

      <section className="bg-muted py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2>Frequently Asked Questions</h2>
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
    </>
  );
}
