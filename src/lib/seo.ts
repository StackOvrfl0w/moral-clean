import type { Metadata } from "next";
import { env } from "@/config/env";

export type SearchParams = Record<string, string | string[] | undefined>;
export const defaultSocialImage = "/opengraph-image";

export function absoluteUrl(path: string) {
  return new URL(path, `${env.siteUrl}/`).toString();
}

function truncateDescription(value: string, limit = 160) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= limit) return normalized;
  const shortened = normalized.slice(0, limit + 1);
  return `${shortened.slice(0, shortened.lastIndexOf(" ")).replace(/[,:;.!?\s]+$/, "")}…`;
}

export function pageMetadata({
  title,
  description,
  path,
  image = defaultSocialImage,
  noindex = false,
  article = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  noindex?: boolean;
  article?: boolean;
}): Metadata {
  title = title.replace(/(?:\s*[|—–-]\s*Moral Clean)+\s*$/i, "").trim();
  description = truncateDescription(description);
  const socialImage = absoluteUrl(image || defaultSocialImage);
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: noindex
      ? {
          index: false,
          follow: true,
          googleBot: { index: false, follow: true },
        }
      : undefined,
    openGraph: {
      title: `${title} | Moral Clean`,
      description,
      url: absoluteUrl(path),
      siteName: "Moral Clean",
      locale: "en_PK",
      type: article ? "article" : "website",
      images: [{ url: socialImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Moral Clean`,
      description,
      images: [socialImage],
    },
  };
}

export function listingMetadata(
  title: string,
  description: string,
  path: string,
  params: SearchParams = {},
  baseNoindex = false,
): Metadata {
  const value = (key: string) =>
    Array.isArray(params[key]) ? params[key]?.[0] : params[key];
  const rawPage = Number(value("page") || 1);
  const page =
    Number.isFinite(rawPage) && rawPage > 1 ? Math.floor(rawPage) : 1;
  const filters = ["q", "brand", "tag", "category", "sort"].filter(
    (key) => value(key) && !(key === "sort" && value(key) === "featured"),
  );
  const query = new URLSearchParams();
  for (const key of filters) query.set(key, value(key)!);
  if (page > 1) query.set("page", String(page));
  return pageMetadata({
    title: page > 1 ? `${title} — Page ${page}` : title,
    description,
    path: `${path}${query.size ? `?${query}` : ""}`,
    noindex: baseNoindex || filters.length > 0,
  });
}
