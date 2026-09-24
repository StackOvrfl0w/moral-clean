import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import {
  BadgeCheck,
  Handshake,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { MapPin, Phone, Mail, Clock3, MessageCircle } from "lucide-react";

import { IndustriesStrip } from "@/components/sections/IndustriesStrip";
import { ContactForm } from "@/components/contact/ContactForm";


export const metadata: Metadata = pageMetadata({
  title: 'About Our Cleaning Equipment Company', description: 'Meet Moral Clean, a Pakistan supplier of commercial cleaning equipment since 2007, with machine repair, spare parts and after-sales support.', path: '/about',
});

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
            <h1>About Moral Clean</h1>
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
          <h2 className="mb-8 text-brand-navy">Our Values</h2>
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

      {/* Why Choose Us */}
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-brand-navy px-6 py-12 shadow-[0_24px_60px_rgba(10,37,64,0.22)] sm:px-10 lg:px-12 lg:py-16">
          <div
            className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-accent/20 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-36 -left-20 size-72 rounded-full bg-sky-300/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative grid gap-10 lg:grid-cols-[0.8fr_2fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
                The Moral Clean Difference
              </p>
              <h2 className="mt-4 text-white">Why Choose Moral Clean</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
                Reliable equipment matters. The service, parts and accountability
                behind it determine its long-term value.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
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
                <article
                  key={title}
                  className="group rounded-xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm transition-colors hover:border-sky-300/40 hover:bg-white/[0.11]"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-sky-300/15 ring-1 ring-inset ring-sky-200/20">
                    <Icon className="size-5 text-sky-300" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
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
