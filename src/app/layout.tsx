import type { Metadata } from "next";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { env } from "@/config/env";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
import { WebsiteSchema } from "@/components/seo/WebsiteSchema";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = localFont({
  src: [
    {
      path: "../../public/fonts/inter-v20-latin-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/inter-v20-latin-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/inter-v20-latin-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/inter-v20-latin-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = localFont({
  src: [
    {
      path: "../../public/fonts/plus-jakarta-sans-v12-latin-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/plus-jakarta-sans-v12-latin-700.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/plus-jakarta-sans-v12-latin-800.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  preload: false,
  variable: "--font-jakarta",
  display: "swap",
});

const etna = localFont({
  src: [
    {
      path: "../../public/fonts/etna-sans-serif.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-etna",
  display: "swap",
});

const title =
  "Moral Clean — Commercial Cleaning Equipment & Service in Pakistan";
const description =
  "Moral Clean supplies industrial cleaning machines, replacement parts, and repair services for commercial and facility cleaning teams across Pakistan.";
const siteUrl = env.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Moral Clean",
  },
  description,
  keywords: [
    "commercial cleaning equipment Pakistan",
    "industrial vacuum cleaners Pakistan",
    "floor scrubber dryer Pakistan",
    "high pressure cleaners Pakistan",
    "Biemmedue Pakistan",
    "cleaning machines Karachi",
    "industrial cleaning machines",
    "ride on scrubber dryer",
    "walk behind scrubber dryer",
    "steam cleaner supplier Pakistan",
    "janitorial equipment supplier",
    "cleaning equipment maintenance Pakistan",
    "commercial cleaning machine repair",
    "original cleaning machine parts Pakistan",
    "facility cleaning equipment",
  ],
  authors: [{ name: "Moral Clean" }],
  creator: "Moral Clean",
  publisher: "Moral Clean",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/icon.png", sizes: "800x800", type: "image/png" },
    ],
  },
  openGraph: {
    title,
    description,
    siteName: "Moral Clean",
    locale: "en_PK",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image"],
  },
  robots: {
    googleBot: {
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION?.trim() || undefined },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jakarta.variable} ${etna.variable} font-sans antialiased`}
      >
        <OrganizationSchema />
        <WebsiteSchema />
        {children}
        <Toaster />
        {process.env.VERCEL ? <SpeedInsights /> : null}
      </body>
    </html>
  );
}
