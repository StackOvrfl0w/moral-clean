import { env } from "@/config/env";

const siteUrl = env.siteUrl;

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: "Moral Clean",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/og-image.jpg`,
    description:
      "Moral Clean supplies industrial cleaning machines, replacement parts, and repair services for commercial and facility cleaning teams across Pakistan.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Shop no 01, Plot no 242, Sector 11-E",
      addressLocality: "North Karachi",
      addressRegion: "Sindh",
      postalCode: "75850",
      addressCountry: "PK",
    },
    telephone: "+92-331-3195138",
    email: "info@moralclean.com",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    sameAs: ["#", "#", "#"],
    areaServed: "PK",
    priceRange: "$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
