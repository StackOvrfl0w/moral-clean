import type { Metadata } from "next";
import {
  BadgeCheck,
  Handshake,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { MapPin, Phone, Mail, Clock3, MessageCircle } from "lucide-react";

import { env } from "@/config/env";
import { IndustriesStrip } from "@/components/sections/IndustriesStrip";
import { ContactForm } from "@/components/contact/ContactForm";

const siteUrl = env.siteUrl;

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Moral Clean is the trusted partner for commercial cleaning equipment supply, technical service, and reliable after-sales support in Pakistan.",
  openGraph: {
    title: "About Us | Moral Clean",
    description:
      "Moral Clean is the trusted partner for commercial cleaning equipment supply, technical service, and reliable after-sales support in Pakistan.",
  },
  alternates: {
    canonical: `${siteUrl}/about`,
  },
};

const address = "Shop no 01, Plot no 242, Sector 11-E, North Karachi, Karachi";
const phone = "+92 309 8783242";
const email = "info@moralclean.com";
const hours = "Monday – Saturday, 9:00 AM – 6:00 PM";
const phoneDigits = phone.replace(/\D/g, "");
const whatsappDigits = phoneDigits;

export default function AboutPage() {
  return (
    <>
      {/* Our Story */}
      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="relative overflow-hidden rounded-lg border border-border bg-[linear-gradient(140deg,#f8fafc_0%,#ebf5ff_100%)]">
            <div className="aspect-[4/3] bg-[radial-gradient(circle_at_20%_25%,rgba(14,165,233,0.22),transparent_40%),radial-gradient(circle_at_80%_75%,rgba(10,37,64,0.12),transparent_45%)]" />
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">
              Our Story
            </p>
            <h2>About Us</h2>
            <p className="mt-4 font-semibold text-primary">
              Your Trusted Partner in Cleaning Equipment and Service
            </p>
            <p className="mt-4 text-muted-foreground">
              Established in 2007, Moralclean is a leading supplier of
              commercial cleaning and janitorial equipment across Pakistan. We
              don&apos;t just supply top-tier machinery; we back it up with
              expert repair and maintenance services to ensure your operations
              run smoothly without avoidable downtime.
            </p>
            <p className="mt-4 text-muted-foreground">
              For over 15 years, we have provided this complete end-to-end
              support to some of the most demanding sectors in the country. By
              combining premium products with reliable after-sales care, we
              proudly serve leading pharmaceutical companies, major hospitals,
              and premium 5-star hotels.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-brand-gradient py-20">
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
                className="rounded-md border border-brand-navy/10 bg-white p-6 shadow-sm"
              >
                <Icon className="size-9 text-accent" aria-hidden="true" />
                <h3 className="mt-5 text-brand-navy">{title}</h3>
                <p className="mt-3 text-sm text-brand-navy/75">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">
              Leadership
            </p>
            <h2>Meet the Team</h2>
          </div>

          <div className="flex flex-col gap-6">
            {/* Muhammad Moiz Khan */}
            <article className="rounded-lg border border-border bg-white p-6 shadow-sm lg:p-8">
              <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
                <div className="overflow-hidden rounded-md border border-border bg-[linear-gradient(135deg,#f8fafc_0%,#e8f4ff_100%)]">
                  <div className="aspect-square bg-[radial-gradient(circle_at_35%_30%,rgba(14,165,233,0.2),transparent_36%),radial-gradient(circle_at_70%_75%,rgba(10,37,64,0.1),transparent_42%)]" />
                </div>
                <div>
                  <h3 className="text-3xl">Muhammad Moiz Khan</h3>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-accent">
                    Chief Executive Officer
                  </p>
                  <p className="mt-5 text-muted-foreground">
                    Muhammad Moiz Khan leads Moralclean with a clear operational
                    focus: delivering reliable equipment and repair support that
                    helps clients maintain measurable cleaning standards in
                    demanding commercial environments. Building on a foundation
                    established in 2007, he ensures that top-tier supply is
                    always backed by dependable service.
                  </p>
                  <p className="mt-4 text-muted-foreground">
                    His direction has shaped the company into a full-service
                    partner for Pakistan&apos;s leading pharmaceutical
                    companies, major hospitals, and premium 5-star hotels. Under
                    his leadership, procurement, maintenance, and technical
                    support are handled with the strict accountability expected
                    in professional facility operations.
                  </p>
                </div>
              </div>
            </article>

            {/* Musharraf Khan */}
            {/* <article className="rounded-lg border border-border bg-white p-6 shadow-sm lg:p-8">
              <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
                <div className="overflow-hidden rounded-md border border-border bg-[linear-gradient(135deg,#f8fafc_0%,#e8f4ff_100%)]">
                  <div className="aspect-square bg-[radial-gradient(circle_at_35%_30%,rgba(14,165,233,0.2),transparent_36%),radial-gradient(circle_at_70%_75%,rgba(10,37,64,0.1),transparent_42%)]" />
                </div>
                <div>
                  <h3 className="text-3xl">Musharraf Khan</h3>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-accent">
                    Partner
                  </p>
                  <p className="mt-5 text-muted-foreground">
                    Musharraf Khan brings decades of industry expertise to
                    Moralclean, having originally founded MK Enterprises Company
                    in 2007. His early vision laid the groundwork for delivering
                    high-quality commercial cleaning and janitorial equipment
                    across Pakistan, building a strong industry reputation
                    rooted in dependable machinery repair and hands-on client
                    service.
                  </p>
                  <p className="mt-4 text-muted-foreground">
                    Today, as a Partner at Moralclean, his foundational
                    experience and dedication to technical excellence continue
                    to drive the company forward. His deep understanding of the
                    sector ensures that our end-to-end equipment solutions
                    consistently meet the rigorous operational standards of the
                    country&apos;s leading pharmaceutical facilities, major
                    hospitals, and premium 5-star hotels.
                  </p>
                </div>
              </div>
            </article> */}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-brand-gradient py-14">
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
              title: "Technicians and Parts",
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
              <p className="mt-2 text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <IndustriesStrip />

      {/* Contact */}
      <section className="bg-background py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          <aside className="order-2 rounded-lg bg-brand-gradient p-8 lg:order-1 lg:col-span-2">
            <h2 className="text-2xl font-bold text-brand-navy">
              Reach Us Directly
            </h2>
            <p className="mt-3 text-sm leading-6 text-brand-navy/80">
              For urgent requirements, call us directly. For detailed equipment
              or service discussions, use the contact form.
            </p>

            <div className="mt-7 space-y-5">
              <div className="flex gap-3">
                <MapPin
                  className="mt-0.5 size-5 shrink-0 text-brand-navy"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-navy">
                    Office
                  </p>
                  <p className="mt-1 text-sm font-medium text-brand-navy">
                    {address}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone
                  className="mt-0.5 size-5 shrink-0 text-brand-navy"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-navy">
                    Phone
                  </p>
                  <a
                    href={`tel:+${phoneDigits}`}
                    className="mt-1 block text-sm font-medium text-brand-navy hover:opacity-75 transition-opacity"
                  >
                    {phone}
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail
                  className="mt-0.5 size-5 shrink-0 text-brand-navy"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-navy">
                    Email
                  </p>
                  <a
                    href={`mailto:${email}`}
                    className="mt-1 block text-sm font-medium text-brand-navy hover:opacity-75 transition-opacity"
                  >
                    {email}
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock3
                  className="mt-0.5 size-5 shrink-0 text-brand-navy"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-navy">
                    Hours
                  </p>
                  <p className="mt-1 text-sm font-medium text-brand-navy">
                    {hours}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-brand-navy/30 pt-5">
              <a
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-2 rounded-full bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-85"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Chat on WhatsApp
              </a>
            </div>
          </aside>

          <div className="order-1 lg:order-2 lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
