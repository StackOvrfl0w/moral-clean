import type { Metadata } from "next";
// import { Inter, Plus_Jakarta_Sans } from "next/font/google";
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
  variable: "--font-jakarta",
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
  openGraph: {
    title,
    description,
    siteName: "Moral Clean",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jakarta.variable} font-sans antialiased`}
      >
        <OrganizationSchema />
        <WebsiteSchema />
        {children}
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}
