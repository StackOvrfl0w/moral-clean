import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

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

interface FooterProps {
  settings: Record<string, string>;
}

export function Footer({ settings }: FooterProps) {
  const socialLinks = [
    {
      label: "Facebook",
      href:
        settings.social_facebook ||
        "https://www.facebook.com/profile.php?id=61591695643287",
      Icon: FaFacebookF,
    },
    {
      label: "Instagram",
      href:
        settings.social_instagram || "https://www.instagram.com/moral_clean/",
      Icon: FaInstagram,
    },
    {
      label: "LinkedIn",
      href:
        settings.social_linkedin || "https://linkedin.com/company/moralclean",
      Icon: FaLinkedinIn,
    },
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
    "A trusted provider of commercial cleaning equipment and expert repair services across Pakistan.";

  const phoneDigits = phone.replace(/\D/g, "");

  return (
    <footer className="bg-brand-gradient text-brand-navy">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="Moral Clean home"
          >
            <span className="font-etna text-lg font-bold uppercase tracking-wide text-brand-navy">
              Moral Clean
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-brand-navy/80">
            {tagline}
          </p>
        </div>

        <nav aria-label="Footer quick links">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-brand-navy">
            Quick Links
          </h2>
          <ul className="mt-5 space-y-3 text-sm text-brand-navy/80">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-brand-navy"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer product categories">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-brand-navy">
            Product Categories
          </h2>
          <ul className="mt-5 space-y-3 text-sm text-brand-navy/80">
            {productCategories.map((category) => (
              <li key={category}>
                <Link
                  href={categoryHref(category)}
                  className="transition-colors hover:text-brand-navy"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-brand-navy">
            Contact
          </h2>
          <address className="mt-5 space-y-4 text-sm not-italic text-brand-navy/80">
            <p className="flex gap-3">
              <MapPin
                className="mt-0.5 size-4 shrink-0 text-brand-navy"
                aria-hidden="true"
              />
              <span>{address}</span>
            </p>
            <p>
              <Link
                href={`tel:+${phoneDigits}`}
                className="flex gap-3 transition-colors hover:text-brand-navy"
              >
                <Phone
                  className="mt-0.5 size-4 shrink-0 text-brand-navy"
                  aria-hidden="true"
                />
                <span>{phone}</span>
              </Link>
            </p>
            <p>
              <Link
                href={`mailto:${email}`}
                className="flex gap-3 transition-colors hover:text-brand-navy"
              >
                <Mail
                  className="mt-0.5 size-4 shrink-0 text-brand-navy"
                  aria-hidden="true"
                />
                <span>{email}</span>
              </Link>
            </p>
            {hours ? (
              <p className="text-xs text-brand-navy/65">{hours}</p>
            ) : null}
          </address>
        </div>
      </div>

      <div className="border-t border-brand-navy/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-sm text-brand-navy/70 sm:flex-row sm:items-center sm:justify-center sm:px-6 lg:px-8">
          <p className="text-center">
            © {new Date().getFullYear()} Moral Clean. All rights reserved.
          </p>
          {/* {socialLinks.length > 0 ? (
            <div className="flex items-center gap-3" aria-label="Social links">
              {socialLinks.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-9 items-center justify-center rounded-full border border-brand-navy/30 text-brand-navy/70 transition-all duration-200 hover:border-brand-navy hover:text-brand-navy"
                  aria-label={label}
                >
                  <Icon className="size-4" />
                </Link>
              ))}
            </div>
          ) : null} */}
        </div>
      </div>
    </footer>
  );
}
