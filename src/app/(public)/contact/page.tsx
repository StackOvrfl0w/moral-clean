import type { Metadata } from "next";
import Link from "next/link";
import {
  Link2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import { env } from "@/config/env";
import { ContactForm } from "@/components/contact/ContactForm";
import { getProductBySlug } from "@/lib/queries/products";
import { getServiceBySlug } from "@/lib/queries/services";
import { getAllSettings } from "@/lib/queries/settings";

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

function getParam(
  searchParams: Record<string, string | string[] | undefined> | undefined,
  key: string,
) {
  const value = searchParams?.[key];
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const [settings, productResult, serviceResult] = await Promise.all([
    getAllSettings(),
    getParam(searchParams, "product")
      ? getProductBySlug(getParam(searchParams, "product")!)
      : Promise.resolve(null),
    getParam(searchParams, "service")
      ? getServiceBySlug(getParam(searchParams, "service")!)
      : Promise.resolve(null),
  ]);

  const productSlug = getParam(searchParams, "product");
  const serviceSlug = getParam(searchParams, "service");

  let defaultSubject = "General Question";
  let defaultMessage = "";

  if (productSlug) {
    defaultSubject = "Product Inquiry";
    defaultMessage = `Inquiry about: ${productResult?.name || productSlug}\n`;
  } else if (serviceSlug) {
    defaultSubject = "Service Request";
    defaultMessage = `Inquiry about: ${serviceResult?.name || serviceSlug}\n`;
  }

  const address =
    settings.business_address ||
    "Shop no 01, Plot no 242, Sector 11-E, North Karachi, Karachi";
  const phone = settings.business_phone || "+92 331 3195138";
  const email = settings.business_email || "info@moralclean.com";
  const hours =
    settings.business_hours || "Monday – Saturday, 9:00 AM – 6:00 PM";
  const mapsUrl = settings.google_maps_embed_url || "";
  const whatsappRaw = settings.contact_form_whatsapp || "";
  const whatsappDigits = whatsappRaw.replace(/\D/g, "");

  const phoneDigits = phone.replace(/\D/g, "");

  const socialLinks = [
    { label: "Facebook", href: settings.social_facebook, Icon: Link2 },
    { label: "Instagram", href: settings.social_instagram, Icon: Link2 },
    { label: "LinkedIn", href: settings.social_linkedin, Icon: Link2 },
  ].filter(({ href }) => Boolean(href));

  return (
    <>
      <section className="bg-brand-gradient py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-navy/75">
            Get In Touch
          </p>
          <h1 className="font-display text-5xl font-extrabold text-brand-navy lg:text-6xl">
            Let&apos;s Talk About Your Equipment Needs
          </h1>
          <p className="mt-5 text-base text-brand-navy/75 sm:text-lg">
            Send us your quote request, service inquiry, or general question.
            Our team will respond with clear next steps.
          </p>
        </div>
      </section>

      <section className="bg-background py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          <aside className="order-2 rounded-lg bg-brand-gradient p-8 text-brand-navy lg:order-1 lg:col-span-2">
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
                  <Link
                    href={`tel:+${phoneDigits}`}
                    className="mt-1 block text-sm font-medium text-brand-navy transition-opacity hover:opacity-75"
                  >
                    {phone}
                  </Link>
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
                  <Link
                    href={`mailto:${email}`}
                    className="mt-1 block text-sm font-medium text-brand-navy transition-opacity hover:opacity-75"
                  >
                    {email}
                  </Link>
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

            <div className="mt-8 space-y-5 border-t border-brand-navy/30 pt-5">
              {whatsappDigits ? (
                <a
                  href={`https://wa.me/${whatsappDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-fit items-center gap-2 rounded-full bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-85"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Chat on WhatsApp
                </a>
              ) : null}

              {socialLinks.length > 0 ? (
                <div>
                  <p className="text-sm font-bold text-brand-navy">Follow Us</p>
                  <div className="mt-3 flex items-center gap-3">
                    {socialLinks.map(({ label, href, Icon }) => (
                      <Link
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex size-9 items-center justify-center rounded-full border-2 border-brand-navy/40 text-brand-navy transition-all duration-200 hover:border-brand-navy hover:bg-brand-navy/10"
                      >
                        <Icon className="size-4" />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
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
          {mapsUrl ? (
            <iframe
              title="Moral Clean office map"
              src={mapsUrl}
              className="h-[400px] w-full rounded-lg border border-border"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-[400px] w-full flex-col items-center justify-center gap-3 rounded-lg border border-border bg-muted text-muted-foreground">
              <MapPin
                className="size-10 text-muted-foreground/40"
                aria-hidden="true"
              />
              <p className="font-medium">{address}</p>
              <p className="text-sm">
                Map embed will appear here once configured in admin settings.
              </p>
            </div>
          )}
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
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.answer}
                </p>
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
