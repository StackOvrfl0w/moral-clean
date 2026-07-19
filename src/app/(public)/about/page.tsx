import type { Metadata } from "next";
import {
  BadgeCheck,
  Handshake,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";

import { env } from "@/config/env";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { IndustriesStrip } from "@/components/sections/IndustriesStrip";

const siteUrl = env.siteUrl;

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Moral Clean is Pakistan&apos;s trusted partner for commercial cleaning equipment supply, technical service, and reliable after-sales support.",
  openGraph: {
    title: "About Us | Moral Clean",
    description:
      "Moral Clean is Pakistan&apos;s trusted partner for commercial cleaning equipment supply, technical service, and reliable after-sales support.",
  },
  alternates: {
    canonical: `${siteUrl}/about`,
  },
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-muted py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-accent">
            About Moral Clean
          </p>
          <h1 className="font-display text-5xl font-extrabold text-primary lg:text-6xl">
            Built on Service, Trusted by Industry
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Moral Clean supports commercial and industrial cleaning operations
            across Pakistan with dependable equipment supply and technical
            service support. We work with facility managers, procurement teams,
            and contractors who need consistent machine uptime, not one-time
            transactions. Our focus is practical: right equipment, available
            parts, and responsive service when it matters.
          </p>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="relative overflow-hidden rounded-lg border border-border bg-[linear-gradient(140deg,#f8fafc_0%,#ebf5ff_100%)]">
            {/* Replace this placeholder with a real company/workshop image. */}
            <div className="aspect-[4/3] bg-[radial-gradient(circle_at_20%_25%,rgba(14,165,233,0.22),transparent_40%),radial-gradient(circle_at_80%_75%,rgba(10,37,64,0.12),transparent_45%)]" />
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">
              Our Story
            </p>
            <h2>From Equipment Supply to End-to-End Partner</h2>
            <p className="mt-4 text-muted-foreground">
              Moral Clean began as an equipment supplier serving commercial
              cleaning requirements across Pakistan. As client operations grew,
              one issue became clear: supply alone was not enough when service
              delays could stop work on active sites.
            </p>
            <p className="mt-4 text-muted-foreground">
              We expanded into structured after-sales support to close that
              gap. Today, we combine product supply with maintenance, parts
              replacement, and technical coordination so clients can maintain
              performance standards without avoidable downtime.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Quality",
                description:
                  "We supply authenticated equipment and parts from leading international manufacturers with proven commercial performance.",
              },
              {
                icon: Wrench,
                title: "Service",
                description:
                  "Equipment is only as good as the service behind it. We support every sale with maintenance and parts availability.",
              },
              {
                icon: Handshake,
                title: "Partnership",
                description:
                  "We treat client equipment as our own. Your operational uptime and response requirements guide our service priorities.",
              },
            ].map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-md border border-border bg-white p-6 shadow-sm"
              >
                <Icon className="size-9 text-accent" aria-hidden="true" />
                <h3 className="mt-5">{title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">
              Leadership
            </p>
            <h2>Meet the Team</h2>
          </div>

          <article className="rounded-lg border border-border bg-white p-6 shadow-sm lg:p-8">
            <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
              <div className="overflow-hidden rounded-md border border-border bg-[linear-gradient(135deg,#f8fafc_0%,#e8f4ff_100%)]">
                {/* Replace this placeholder with Muhammad Moiz Khan's photo. */}
                <div className="aspect-square bg-[radial-gradient(circle_at_35%_30%,rgba(14,165,233,0.2),transparent_36%),radial-gradient(circle_at_70%_75%,rgba(10,37,64,0.1),transparent_42%)]" />
              </div>
              <div>
                <h3 className="text-3xl">Muhammad Moiz Khan</h3>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-accent">
                  CEO & Founder
                </p>
                <p className="mt-5 text-muted-foreground">
                  Muhammad Moiz Khan leads Moral Clean with a clear operational
                  focus: deliver reliable equipment support that helps clients
                  maintain measurable cleaning standards in demanding commercial
                  environments.
                </p>
                <p className="mt-4 text-muted-foreground">
                  His direction has shaped the company from a product supply
                  business into a full service partner, where procurement,
                  maintenance, and technical support are handled with the same
                  accountability expected in professional facility operations.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-muted py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-6 lg:px-8">
          {[
            {
              icon: BadgeCheck,
              title: "Authorized Distribution",
              description: "Sourced from leading international brands.",
            },
            {
              icon: Wrench,
              title: "After-Sales Network",
              description: "Service and support across major cities.",
            },
            {
              icon: ShieldCheck,
              title: "Technicians & Parts",
              description: "Trained teams with original compatible parts.",
            },
            {
              icon: Sparkles,
              title: "Transparent Pricing",
              description: "Clear quotes before service work begins.",
            },
          ].map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-md border border-border bg-white p-5 shadow-sm"
            >
              <Icon className="size-6 text-accent" aria-hidden="true" />
              <h3 className="mt-3 text-xl">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <IndustriesStrip />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">
              Trusted By
            </p>
          </div>
          {/* Replace placeholders with real client logos. */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex h-20 items-center justify-center rounded-md border border-dashed border-border bg-muted/60 text-sm font-semibold text-muted-foreground"
              >
                Logo
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        heading="Talk to Our Team"
        subtitle="Connect with Moral Clean for equipment selection consultations, procurement planning, and service inquiries for commercial cleaning operations."
      />
    </>
  );
}
