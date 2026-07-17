import type { SVGProps } from "react";
import Link from "next/link";
import { Droplets, Mail, MapPin, Phone } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

const productCategories = [
  "Floor Cleaning Machines",
  "Vacuum Cleaners",
  "High Pressure Cleaners",
  "Steam Cleaners",
  "Sweepers",
  "Single Disc Machines",
];

function categoryHref(category: string) {
  return `/products?category=${category.toLowerCase().replaceAll(" ", "-")}`;
}

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
      <rect
        width="15"
        height="15"
        x="4.5"
        y="4.5"
        rx="4"
        stroke="currentColor"
        strokeWidth="2"
      />
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

function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.8 5 12 5 12 5s-4.8 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.3.9C6.8 19 12 19 12 19s4.8 0 7-.1c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8ZM9.7 14.5V9l5.5 2.8-5.5 2.7Z" />
    </svg>
  );
}

interface FooterProps {
  settings: Record<string, string>;
}

export function Footer({ settings }: FooterProps) {
  const socialLinks = [
    { label: "Facebook", href: settings.social_facebook, Icon: FacebookIcon },
    {
      label: "Instagram",
      href: settings.social_instagram,
      Icon: InstagramIcon,
    },
    { label: "LinkedIn", href: settings.social_linkedin, Icon: LinkedinIcon },
    { label: "YouTube", href: settings.social_youtube, Icon: YoutubeIcon },
  ].filter(({ href }) => Boolean(href));

  const address =
    settings.business_address ||
    "Shop no 01, Plot no 242, Sector 11-E, North Karachi, Karachi";
  const phone = settings.business_phone || "+92 331 3195138";
  const email = settings.business_email || "info@moralclean.com";
  const hours =
    settings.business_hours || "Monday – Saturday, 9:00 AM – 6:00 PM";
  const tagline =
    settings.business_tagline ||
    "Pakistan's trusted partner for commercial cleaning equipment, parts, and responsive service support.";

  const phoneDigits = phone.replace(/\D/g, "");

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="Moral Clean home"
          >
            <span
              className="font-etna text-lg font-bold uppercase tracking-wide"
              style={{
                background: "linear-gradient(to right, #00defc, #00a8ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Moral Clean
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/75">
            {tagline}
          </p>
        </div>

        <nav aria-label="Footer quick links">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
            Quick Links
          </h2>
          <ul className="mt-5 space-y-3 text-sm text-white/75">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer product categories">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
            Product Categories
          </h2>
          <ul className="mt-5 space-y-3 text-sm text-white/75">
            {productCategories.map((category) => (
              <li key={category}>
                <Link
                  href={categoryHref(category)}
                  className="transition-colors hover:text-white"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
            Contact
          </h2>
          <address className="mt-5 space-y-4 text-sm not-italic text-white/75">
            <p className="flex gap-3">
              <MapPin
                className="mt-0.5 size-4 shrink-0 text-accent"
                aria-hidden="true"
              />
              <span>{address}</span>
            </p>
            <p>
              <Link
                href={`tel:+${phoneDigits}`}
                className="flex gap-3 transition-colors hover:text-white"
              >
                <Phone
                  className="mt-0.5 size-4 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span>{phone}</span>
              </Link>
            </p>
            <p>
              <Link
                href={`mailto:${email}`}
                className="flex gap-3 transition-colors hover:text-white"
              >
                <Mail
                  className="mt-0.5 size-4 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span>{email}</span>
              </Link>
            </p>
            {hours ? <p className="text-white/65 text-xs">{hours}</p> : null}
          </address>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-sm text-white/65 sm:flex-row sm:items-center sm:justify-center sm:px-6 lg:px-8">
          <p className="text-center">
            © {new Date().getFullYear()} Moral Clean. All rights reserved.
          </p>
          {socialLinks.length > 0 ? (
            <div className="flex items-center gap-3" aria-label="Social links">
              {socialLinks.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-9 items-center justify-center rounded-full border border-white/20 text-white/60 transition-all duration-200 hover:border-[#00defc] hover:text-[#00defc] hover:shadow-[0_0_8px_rgba(0,222,252,0.4)]"
                  aria-label={label}
                >
                  <Icon className="size-4" />
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
