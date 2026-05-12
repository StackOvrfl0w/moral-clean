import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BrushCleaning,
  CheckCircle2,
  Cog,
  MapPin,
  Settings,
  Wrench,
} from "lucide-react";

import { CtaBanner } from "@/components/sections/CtaBanner";
import { IndustriesStrip } from "@/components/sections/IndustriesStrip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getServices } from "@/lib/queries/services";
import type { Service } from "@/lib/types";
import { cn } from "@/lib/utils";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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

function includedItems(service: Service) {
  if (service.slug === "motor-repairing") {
    return [
      "Fault diagnosis and load testing",
      "Motor dismantling and inspection",
      "Rewinding coordination where required",
      "Bearing, seal, and alignment checks",
      "Post-repair performance validation",
    ];
  }

  if (service.slug === "parts-replacement") {
    return [
      "Part compatibility verification",
      "Original spare parts sourcing",
      "Wear-part replacement and fitting",
      "Calibration and functional checks",
      "Operator handover notes",
    ];
  }

  if (service.slug === "brush-refilling") {
    return [
      "Brush condition assessment",
      "Refilling and balancing support",
      "Brush type recommendation by surface",
      "Replacement where required",
      "Run-test for cleaning consistency",
    ];
  }

  return [
    "Service requirement assessment",
    "Technical work by trained team",
    "Parts and labor transparency",
    "Functional quality checks",
  ];
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-accent">
              After-Sales Support
            </p>
            <h1 className="font-display text-5xl font-extrabold text-primary lg:text-6xl">
              We Keep Your Equipment Running
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              At Moral Clean, sales is only half the job. We support your
              operations with responsive maintenance, technical diagnosis, and
              parts availability to minimize downtime.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link href="/contact">
                Request Service
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="relative overflow-hidden rounded-lg border border-border bg-[linear-gradient(140deg,#f8fafc_0%,#eef8ff_55%,#dff2ff_100%)] p-8 shadow-sm">
            {/* Replace this placeholder panel with a real service hero image later. */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.2),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(10,37,64,0.1),transparent_45%)]" />
            <div className="relative flex aspect-[4/3] items-center justify-center">
              <Wrench className="size-28 text-primary/70" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:px-6 md:grid-cols-3 md:gap-0 lg:px-8">
          {[
            { value: "20+ Years", label: "Combined service expertise" },
            { value: "Nationwide", label: "Service coverage across Pakistan" },
            { value: "Original Parts", label: "Authentic manufacturer parts" },
          ].map((item, index) => (
            <div
              key={item.value}
              className={cn(
                "rounded-md border border-border bg-white px-6 py-6 text-center md:rounded-none md:border-y md:bg-transparent",
                index === 1 && "md:border-x",
              )}
            >
              <p className="text-2xl font-extrabold text-primary">{item.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">
              What We Offer
            </p>
            <h2>Our Services</h2>
          </div>

          <div className="space-y-8">
            {services.map((service, index) => {
              const Icon = serviceIcon(service.icon_name);
              const included = includedItems(service);
              const mediaFirst = index % 2 === 0;

              return (
                <article
                  key={service.id}
                  className="grid gap-6 rounded-lg border border-border bg-white p-6 shadow-sm lg:grid-cols-2 lg:gap-8"
                >
                  <div
                    className={cn(
                      "relative order-2 overflow-hidden rounded-md border border-border bg-[linear-gradient(130deg,#f8fafc_0%,#e9f5ff_100%)] p-6 lg:order-1",
                      !mediaFirst && "lg:order-2",
                    )}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(14,165,233,0.2),transparent_35%),radial-gradient(circle_at_75%_75%,rgba(10,37,64,0.08),transparent_40%)]" />
                    <div className="relative flex h-full min-h-[240px] items-center justify-center">
                      <Icon className="size-20 text-primary/65" aria-hidden="true" />
                    </div>
                  </div>

                  <div className={cn("order-1 lg:order-2", !mediaFirst && "lg:order-1")}>
                    <h2 className="font-display text-3xl">{service.name}</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                      {service.short_description || "Professional service support for commercial cleaning equipment."}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                      {service.long_description || "Detailed service scope is shared after an initial technical assessment."}
                    </p>

                    <div className="mt-5">
                      <h3 className="text-base font-semibold text-primary">What&apos;s included</h3>
                      <ul className="mt-3 space-y-2">
                        {included.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="mt-0.5 size-4 text-accent" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button asChild className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                      <Link href={`/contact?service=${service.slug}`}>Request This Service</Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">
              How It Works
            </p>
            <h2>Our Service Process</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-4 md:gap-6">
            {processSteps.map((step, index) => (
              <div key={step.title} className="relative rounded-md border border-border bg-white p-5 shadow-sm">
                {index < processSteps.length - 1 ? (
                  <div className="absolute left-[calc(100%+0.5rem)] top-9 hidden h-px w-6 bg-border md:block" />
                ) : null}
                <div className="mb-4 inline-flex size-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                  {index + 1}
                </div>
                <h3 className="text-xl">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <IndustriesStrip />

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
                <li key={city} className="flex items-center gap-2 text-sm font-medium text-primary">
                  <MapPin className="size-4 text-accent" aria-hidden="true" />
                  <span>{city}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-[linear-gradient(140deg,#f8fafc_0%,#eef8ff_100%)] p-6">
            {/* Replace this block with a detailed Pakistan coverage SVG map. */}
            <svg
              viewBox="0 0 500 360"
              className="h-full w-full"
              role="img"
              aria-label="Pakistan service coverage map placeholder"
            >
              <path
                d="M143 42l63-16 52 18 34 43 39 25 17 37-20 39 11 45-27 31-62 21-71-9-41-45-19-56 11-44-17-33 30-56z"
                fill="#0a2540"
                opacity="0.15"
                stroke="#0a2540"
                strokeWidth="2"
              />
              {[120, 172, 210, 228, 262, 300, 335].map((x, index) => (
                <circle
                  key={x}
                  cx={x}
                  cy={[248, 205, 170, 156, 210, 244, 130][index]}
                  r="5"
                  fill="#0ea5e9"
                />
              ))}
            </svg>
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
