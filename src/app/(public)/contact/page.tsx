import type { Metadata } from "next";
import Link from "next/link";
import type { SVGProps } from "react";
import {
  Clock3,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { env } from "@/config/env";
import { ContactForm } from "@/components/contact/ContactForm";
import { getProductBySlug } from "@/lib/queries/products";
import { getServiceBySlug } from "@/lib/queries/services";

const siteUrl = env.siteUrl;

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Moral Clean at Shop no 01, Plot no 242, Sector 11-E, North Karachi, Karachi or call +92 331 3195138 for equipment and service inquiries.",
  openGraph: {
    title: "Contact Us | Moral Clean",
    description:
      "Contact Moral Clean at Shop no 01, Plot no 242, Sector 11-E, North Karachi, Karachi or call +92 331 3195138 for equipment and service inquiries.",
  },
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
};

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14 8.5h2V5h-2.4C10.9 5 9.2 6.7 9.2 9.4v1.8H7v3.4h2.2V21h3.7v-6.4h2.7l.4-3.4h-3.1V9.7c0-.8.4-1.2 1.1-1.2Z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect width="15" height="15" x="4.5" y="4.5" rx="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="2" />
      <circle cx="16.9" cy="7.4" r="1.1" fill="currentColor" />
    </svg>
  );
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.8 8.9H3.5V20h3.3V8.9ZM5.2 4a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM20.5 13.8c0-3.1-1.7-5.1-4.4-5.1-1.7 0-2.8.9-3.3 1.8V8.9H9.6V20h3.3v-5.8c0-1.6.8-2.5 2.1-2.5 1.2 0 2 .8 2 2.5V20h3.5v-6.2Z" />
    </svg>
  );
}

function getParam(
  searchParams: Record<string, string | string[] | undefined> | undefined,
  key: string,
) {
  const value = searchParams?.[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const productSlug = getParam(searchParams, "product");
  const serviceSlug = getParam(searchParams, "service");

  let defaultSubject = "General Question";
  let defaultMessage = "";

  if (productSlug) {
    const product = await getProductBySlug(productSlug);
    defaultSubject = "Product Inquiry";
    defaultMessage = `Inquiry about: ${product?.name || productSlug}\n`;
  } else if (serviceSlug) {
    const service = await getServiceBySlug(serviceSlug);
    defaultSubject = "Service Request";
    defaultMessage = `Inquiry about: ${service?.name || serviceSlug}\n`;
  }

  return (
    <>
      <section className="bg-muted py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Get In Touch
          </p>
          <h1 className="font-display text-5xl font-extrabold text-primary lg:text-6xl">
            Let&apos;s Talk About Your Equipment Needs
          </h1>
          <p className="mt-5 text-base text-muted-foreground sm:text-lg">
            Send us your quote request, service inquiry, or general question.
            Our team will respond with clear next steps.
          </p>
        </div>
      </section>

      <section className="bg-background py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          <aside className="order-2 rounded-lg bg-primary p-8 text-primary-foreground lg:order-1 lg:col-span-2">
            <h2 className="text-2xl text-white">Reach Us Directly</h2>
            <p className="mt-3 text-sm leading-6 text-white/75">
              For urgent requirements, call us directly. For detailed equipment
              or service discussions, use the contact form.
            </p>

            <div className="mt-7 space-y-5">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/65">
                    Office
                  </p>
                  <p className="mt-1 text-sm text-white/90">
                    Shop no 01, Plot no 242, Sector 11-E, North Karachi, Karachi
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/65">
                    Phone
                  </p>
                  <Link href="tel:+923313195138" className="mt-1 block text-sm text-white hover:text-accent">
                    +92 331 3195138
                  </Link>
                </div>
              </div>

              <div className="flex gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/65">
                    Email
                  </p>
                  <Link href="mailto:info@moralclean.com" className="mt-1 block text-sm text-white hover:text-accent">
                    info@moralclean.com
                  </Link>
                </div>
              </div>

              <div className="flex gap-3">
                <Clock3 className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/65">
                    Hours
                  </p>
                  <p className="mt-1 text-sm text-white/90">
                    Monday - Saturday, 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/15 pt-5">
              <p className="text-sm font-semibold text-white">Follow Us</p>
              <div className="mt-3 flex items-center gap-3">
                {[
                  { label: "Facebook", href: "#", Icon: FacebookIcon },
                  { label: "Instagram", href: "#", Icon: InstagramIcon },
                  { label: "LinkedIn", href: "#", Icon: LinkedinIcon },
                ].map(({ label, href, Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-full border border-white/20 text-white/85 transition-colors hover:border-accent hover:text-accent"
                  >
                    <Icon className="size-4" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <div className="order-1 lg:order-2 lg:col-span-3">
            <ContactForm
              defaultSubject={defaultSubject}
              defaultMessage={defaultMessage}
            />
          </div>
        </div>
      </section>

      <section className="bg-background pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Replace this placeholder iframe URL with official Google Maps embed code from the client account. */}
          <iframe
            title="Moral Clean office map"
            src="https://maps.google.com/maps?q=Shop%20no%2001,%20Plot%20no%20242,%20Sector%2011-E,%20North%20Karachi,%20Karachi&output=embed"
            className="h-[400px] w-full rounded-lg border border-border"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center">Common Questions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                question: "Response time on quotes?",
                answer:
                  "Most quote requests receive an initial response within 2 business hours.",
              },
              {
                question: "Do you offer on-site service?",
                answer:
                  "Yes. On-site visits are available for diagnostics and many service cases.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We support standard business payment methods shared at quotation stage.",
              },
            ].map((item) => (
              <article
                key={item.question}
                className="rounded-md border border-border bg-white p-5"
              >
                <h3 className="text-lg">{item.question}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
              </article>
            ))}
          </div>
          <div className="mt-7 text-center">
            <Link
              href="/services#faq"
              className="text-sm font-semibold text-primary hover:text-accent"
            >
              See all FAQs →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
