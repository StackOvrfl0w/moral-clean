import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Cog,
  Download,
  Gauge,
  Home,
  PackageCheck,
  Settings,
  Truck,
} from "lucide-react";

import { ProductCard } from "@/components/products/ProductCard";
import { ProductGallery } from "@/components/products/ProductGallery";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getProductBySlug,
  getProductSlugs,
  getRelatedProducts,
} from "@/lib/queries/products";
import type { Json, ProductWithRelations } from "@/lib/types";
import { cn } from "@/lib/utils";

import { env } from "@/config/env";

export const revalidate = 3600;
const siteUrl = env.siteUrl;

type ProductPageProps = {
  params: {
    slug: string;
  };
};

type SpecEntry = {
  key: string;
  label: string;
  value: string;
};

const specIcons = [Gauge, Settings, PackageCheck, Cog];

function isRecord(
  value: Json | null,
): value is Record<string, Json | undefined> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function formatSpecLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatSpecValue(value: Json | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return JSON.stringify(value);
}

function getSpecEntries(specifications: Json | null): SpecEntry[] {
  if (!isRecord(specifications)) {
    return [];
  }

  return Object.entries(specifications)
    .map(([key, value]) => {
      const formattedValue = formatSpecValue(value);

      if (!formattedValue) {
        return null;
      }

      return {
        key,
        label: formatSpecLabel(key),
        value: formattedValue,
      };
    })
    .filter((entry): entry is SpecEntry => Boolean(entry));
}

function getBrochureUrl(specifications: Json | null) {
  if (!isRecord(specifications)) {
    return null;
  }

  const value = specifications.brochure_url;

  return typeof value === "string" && value.trim() ? value : null;
}

function getDescription(product: ProductWithRelations) {
  if (product.short_description) {
    return product.short_description;
  }

  if (product.long_description) {
    return product.long_description.replace(/\s+/g, " ").slice(0, 160);
  }

  return `${product.name} from Moral Clean's commercial cleaning equipment range.`;
}

function renderDescription(product: ProductWithRelations) {
  const content =
    product.long_description ||
    product.short_description ||
    "<p>Detailed product description available on request. Contact Moral Clean with your site requirements, cleaning area, and expected duty cycle for a practical recommendation.</p>";

  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (isHtml) {
    return (
      <div
        className="prose prose-sm max-w-none text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return content
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => (
      <p key={paragraph} className="text-muted-foreground">
        {paragraph}
      </p>
    ));
}

function getPrimaryImage(product: ProductWithRelations) {
  return product.images.find((image) => image.is_primary) ?? product.images[0];
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const description = getDescription(product);
  const primaryImage = getPrimaryImage(product);

  return {
    title: product.name,
    description,
    alternates: {
      canonical: `${siteUrl}/products/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description,
      images: primaryImage?.url ? [{ url: primaryImage.url }] : undefined,
    },
    twitter: {
      card: primaryImage?.url ? "summary_large_image" : "summary",
      title: product.name,
      description,
      images: primaryImage?.url ? [primaryImage.url] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getProductSlugs();

  return slugs.map((slug) => ({ slug }));
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = product.category_id
    ? await getRelatedProducts(product.id, product.category_id)
    : [];
  const specEntries = getSpecEntries(product.specifications);
  const keySpecEntries = specEntries.slice(0, 4);
  const brochureUrl = getBrochureUrl(product.specifications);
  const productUrl = `${siteUrl}/products/${product.slug}`;
  const imageUrls =
    product.images.map((image) => image.url).filter(Boolean).length > 0
      ? product.images.map((image) => image.url)
      : [`${siteUrl}/og-image.jpg`];
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: getDescription(product),
    image: imageUrls,
    url: productUrl,
    brand: product.brand
      ? {
          "@type": "Brand",
          name: product.brand,
        }
      : undefined,
    sku: product.model_code || undefined,
    category: product.category?.name,
    offers: {
      "@type": "Offer",
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: "PKR",
      url: productUrl,
    },
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Products", url: "/products" },
          ...(product.category
            ? [
                {
                  name: product.category.name,
                  url: `/products/category/${product.category.slug}`,
                },
              ]
            : []),
          { name: product.name, url: `/products/${product.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="bg-muted py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-primary"
            >
              <Home className="size-4" aria-hidden="true" />
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/products" className="hover:text-primary">
              Products
            </Link>
            {product.category ? (
              <>
                <span aria-hidden="true">/</span>
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="hover:text-primary"
                >
                  {product.category.name}
                </Link>
              </>
            ) : null}
            <span aria-hidden="true">/</span>
            <span>{product.name}</span>
          </nav>
        </div>
      </section>

      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)] lg:px-8">
          <ProductGallery images={product.images} productName={product.name} />

          <div>
            {product.brand ? (
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {product.brand}
              </p>
            ) : null}
            <h1 className="mt-3 text-4xl font-extrabold text-primary lg:text-5xl">
              {product.name}
            </h1>
            {product.model_code ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Model: {product.model_code}
              </p>
            ) : null}

            {product.category ? (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="mt-5 inline-flex"
              >
                <Badge
                  variant="secondary"
                  className="bg-accent/10 text-primary hover:bg-accent/15"
                >
                  {product.category.name}
                </Badge>
              </Link>
            ) : null}

            <p className="mt-6 text-lg text-muted-foreground">
              {product.short_description ||
                "Professional cleaning equipment selected for commercial and industrial use."}
            </p>

            <Separator className="my-7" />

            <div>
              <h2 className="text-base">Key Specifications</h2>
              {keySpecEntries.length > 0 ? (
                <div className="mt-4 grid gap-3">
                  {keySpecEntries.map((entry, index) => {
                    const Icon = specIcons[index] ?? Gauge;

                    return (
                      <div
                        key={entry.key}
                        className="flex items-center gap-3 rounded-md border border-border bg-muted/60 px-4 py-3"
                      >
                        <Icon
                          className="size-5 text-accent"
                          aria-hidden="true"
                        />
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            {entry.label}
                          </p>
                          <p className="font-semibold text-primary">
                            {entry.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  Key specifications available on request.
                </p>
              )}
            </div>

            <Separator className="my-7" />

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto"
              >
                <Link href={`/contact?product=${product.slug}`}>
                  Request a Quote
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className={cn(
                  "w-full sm:w-auto",
                  !brochureUrl && "pointer-events-none opacity-50",
                )}
              >
                <Link
                  href={brochureUrl ?? "#"}
                  aria-disabled={!brochureUrl}
                  tabIndex={brochureUrl ? undefined : -1}
                >
                  <Download className="size-4" aria-hidden="true" />
                  Download Brochure
                </Link>
              </Button>
            </div>

            <div className="mt-6 grid gap-3 text-sm font-semibold text-primary sm:grid-cols-3">
              {[
                { label: "Authorized Distributor", icon: BadgeCheck },
                { label: "Pakistan-wide Service", icon: Truck },
                { label: "Original Parts Available", icon: PackageCheck },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="size-4 text-accent" aria-hidden="true" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="description">
            <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-md border border-border bg-white p-1 sm:w-auto">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="support">Service & Support</TabsTrigger>
            </TabsList>
            <TabsContent
              value="description"
              className="mt-6 rounded-md border border-border bg-white p-6"
            >
              <div className="space-y-4 text-base leading-7">
                {renderDescription(product)}
              </div>
            </TabsContent>
            <TabsContent
              value="specifications"
              className="mt-6 rounded-md border border-border bg-white p-0"
            >
              {specEntries.length > 0 ? (
                <div className="overflow-hidden rounded-md">
                  <table className="w-full text-left text-sm">
                    <tbody>
                      {specEntries.map((entry, index) => (
                        <tr
                          key={entry.key}
                          className={cn(
                            index % 2 === 0 ? "bg-white" : "bg-muted/60",
                          )}
                        >
                          <th className="w-1/2 px-5 py-4 font-semibold text-primary">
                            {entry.label}
                          </th>
                          <td className="px-5 py-4 text-muted-foreground">
                            {entry.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="p-6 text-sm text-muted-foreground">
                  Detailed specifications available on request.
                </p>
              )}
            </TabsContent>
            <TabsContent
              value="support"
              className="mt-6 rounded-md border border-border bg-white p-6"
            >
              <div className="grid gap-5 text-sm leading-6 text-muted-foreground md:grid-cols-3">
                <p>
                  <span className="font-semibold text-primary">
                    Motor repair:
                  </span>{" "}
                  Moral Clean supports diagnosis, repair coordination, fitting,
                  and testing for compatible motors used in commercial cleaning
                  equipment.
                </p>
                <p>
                  <span className="font-semibold text-primary">
                    Parts replacement:
                  </span>{" "}
                  We source and replace wear parts including squeegees, filters,
                  hoses, switches, batteries, and other operating consumables.
                </p>
                <p>
                  <span className="font-semibold text-primary">
                    Brush refilling:
                  </span>{" "}
                  Brush refilling and replacement support is available for
                  scrubbers, sweepers, and single-disc floor machines.
                </p>
              </div>
              <Link
                href="/services"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent"
              >
                View service options
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="bg-background py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">
                More In This Category
              </p>
              <h2>Related Products</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 className="text-white">
              Need help choosing the right equipment?
            </h2>
            <p className="mt-3 max-w-2xl text-white/70">
              Share your floor area, cleaning schedule, and site conditions. Our
              team will recommend equipment that fits the job and the service
              plan behind it.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="w-fit bg-black text-white hover:bg-brand-black/90"
          >
            <Link href="/contact">Talk to Our Team</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
