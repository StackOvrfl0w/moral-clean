import { env } from "@/config/env";
import { getAllSettings } from "@/lib/queries/settings";

const siteUrl = env.siteUrl;

export async function OrganizationSchema() {
  const settings = await getAllSettings();

  const name = settings.business_name || "Moral Clean";
  const telephone = settings.business_phone
    ? settings.business_phone.replace(/\s/g, "").replace(/^00/, "+")
    : "+92-331-3195138";
  const email = settings.business_email || "info@moralclean.com";

  const sameAs = [
    settings.social_facebook,
    settings.social_instagram,
    settings.social_linkedin,
    settings.social_youtube,
  ].filter(Boolean);

  const schema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name,
    url: siteUrl,
    "@id": `${siteUrl}/#organization`,
    image: `${siteUrl}/opengraph-image`,
    description:
      "Moral Clean supplies industrial cleaning machines, replacement parts, and repair services for commercial and facility cleaning teams across Pakistan.",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.business_address || "Shop no 01, Plot no 242, Sector 11-E",
      addressLocality: "North Karachi",
      addressRegion: "Sindh",
      postalCode: "75850",
      addressCountry: "PK",
    },
    telephone,
    email,
    openingHoursSpecification: !settings.business_hours ? [
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
    ] : undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    areaServed: "PK",
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
