import { pageMetadata } from "@/lib/seo";
import type { ComponentType, ReactNode, SVGProps } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllCategories } from "@/lib/queries/categories";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  BrushCleaning,
  Building2,
  Clock3,
  Gauge,
  Mail,
  MapPin,
  MapPinned,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";

import { GuideLinks } from "@/components/seo/GuideLinks";
import { isIndexableCategory } from "@/content/categories";
import { ContactForm } from "@/components/contact/ContactForm";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { IndustriesStrip } from "@/components/sections/IndustriesStrip";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAllSettings } from "@/lib/queries/settings";
import { getProducts } from "@/lib/queries/products";
import { getAllPosts } from "@/lib/queries/blog";
import { ProductCard } from "@/components/products/ProductCard";
import { HeroCarousel } from "@/components/sections/HeroCarousel";


export const metadata: Metadata = pageMetadata({
  title: 'Commercial Cleaning Equipment in Pakistan', description: 'Compare commercial cleaning machines, industrial vacuums and scrubber dryers. Get equipment, spare parts and repair support from Moral Clean in Pakistan.', path: '/',
});

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const valueProps = [
  {
    title: "Authorized Distribution",
    description:
      "Partnered with leading international brands for original-equipment supply, warranty support, and dependable procurement.",
    icon: ShieldCheck,
  },
  {
    title: "Full After-Sales Service",
    description:
      "Motor repair, parts replacement, brush refilling, and on-site maintenance handled by trained technical teams.",
    icon: Wrench,
  },
  {
    title: "Nationwide Coverage",
    description:
      "Service support across Karachi, Lahore, Islamabad, and major industrial cities where downtime costs money.",
    icon: MapPinned,
  },
];


const services = [
  {
    title: "Motor Repairing",
    href: "/services/cleaning-machine-repair",
    description:
      "Diagnosis, rewinding coordination, fitting, and testing for commercial cleaning machine motors.",
    image: "/assets/services-image/motor-repairing.png",
    imageAlt: "Technician repairing industrial cleaning machine motor",
    imagePosition: "object-[50%_38%]",
  },
  {
    title: "Parts Replacement",
    href: "/services/cleaning-machine-parts",
    description:
      "Brushes, squeegees, hoses, filters, motors, batteries, and consumables sourced to match your machine.",
    image: "/assets/services-image/part-replacement.png",
    imageAlt: "Replacement parts for commercial cleaning equipment",
    imagePosition: "object-[50%_48%]",
  },
  {
    title: "Brush Refilling",
    href: "/services/brush-refilling",
    description:
      "Refilling and replacement support for scrubber, sweeper, and single-disc machine brushes.",
    image: "/assets/services-image/brush.jpeg",
    imageAlt: "Industrial cleaning brushes for maintenance and refilling",
    imagePosition: "object-[50%_56%]",
  },
];


const trustSignals = [
  { label: "Authorized Distributor", icon: BadgeCheck },
  { label: "Nationwide Service", icon: Truck },
  { label: "20+ Years Combined Expertise", icon: Building2 },
];

function SectionReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={className}>{children}</section>;
}

function MediaPlaceholder({
  Icon,
  className,
}: {
  Icon: IconComponent;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-md border border-border bg-[linear-gradient(135deg,#f8fafc_0%,#eef6fb_100%)]",
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(14,165,233,0.18),transparent_32%),radial-gradient(circle_at_70%_75%,rgba(10,37,64,0.08),transparent_35%)]" />
      <Icon className="relative size-10 text-primary/45" />
    </div>
  );
}

export default async function Home() {
  const [settings, categories, catalog, posts] = await Promise.all([
    getAllSettings(), getAllCategories(), getProducts({ sort: "featured" }), getAllPosts({ limit: 9 }),
  ]);
  const featuredProducts = catalog.products.slice(0, 4);
  const blogPosts = posts.posts.slice(0, 3).map((post) => ({
    title: post.title, excerpt: post.excerpt, href: `/blog/${post.slug}`,
    date: post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { dateStyle: "long" }) : "",
  }));
  const HOME_CATEGORY_LIMIT = 8;
  const visibleCategories = categories.filter((category) => isIndexableCategory(category.slug, category.product_count)).slice(0, HOME_CATEGORY_LIMIT);
  const hasMoreCategories = categories.length > HOME_CATEGORY_LIMIT;
  const address =
    settings.business_address ||
    "Shop no 01, Plot no 242, Sector 11-E, North Karachi, Karachi";
  const phone = settings.business_phone || "+92 331 3195138";
  const email = settings.business_email || "info@moralclean.com";
  const hours =
    settings.business_hours || "Monday – Saturday, 9:00 AM – 6:00 PM";
  const phoneDigits = phone.replace(/\D/g, "");
  const whatsappDigits = (
    settings.contact_form_whatsapp || phone
  ).replace(/\D/g, "");

  const heroLine1 = settings.homepage_hero_heading_line1 || "Industrial-Grade";
  const heroLine2 =
    settings.homepage_hero_heading_line2 || "Cleaning Equipment";
  const heroSub =
    settings.homepage_hero_subheading ||
    "Moral Clean supplies, installs, and services professional cleaning machines for factories, hospitals, hotels, malls, and cleaning contractors across Pakistan.";

  return (
    <>
      <section className="relative bg-white">
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-0 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          {" "}
          <div>
            <p className="mb-4 inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground shadow-sm">
              Commercial Cleaning Equipment Pakistan
            </p>
            <h1 className="max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl">
              <span className="block font-medium text-primary/70">
                {heroLine1}
              </span>
              <span className="block text-accent">{heroLine2}</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              {heroSub}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/products">
                  Browse Products
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary/20 bg-white/80 text-primary hover:bg-muted"
              >
                <Link href="/contact">Talk to Our Team</Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {trustSignals.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-md border border-border bg-white/85 px-3 py-2 text-sm font-semibold text-primary shadow-sm"
                >
                  <Icon className="size-4 text-accent" aria-hidden="true" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
          {/* ↓ Only this block changed — client island, rest of page stays server */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[720px]">
              <HeroCarousel />
            </div>
          </div>
        </div>
      </section>

      <SectionReveal>
        <IndustriesStrip />
      </SectionReveal>
      <div className="bg-brand-gradient">
        <SectionReveal className="py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Why Moral Clean"
              description="Equipment supply is only useful when technical support, parts, and response time are handled with the same discipline."
              descriptionClassName="text-white"
            />
            <div className="grid gap-6 lg:grid-cols-3">
              {valueProps.map(({ title, description, icon: Icon }) => (
                <div
                  key={title}
                  className="rounded-md border border-brand-navy/15 bg-white p-5 shadow-sm"
                >
                  <Icon className="size-8 text-brand-navy" aria-hidden="true" />
                  <h3 className="mt-4 text-brand-navy">{title}</h3>
                  <p className="mt-2 text-sm text-brand-navy/75">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      </div>
      <SectionReveal className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Product Range" title="Explore by Category" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {visibleCategories.map((category) => (
              <Link
                key={category.id}
                href={`/products/category/${category.slug}`}
                className="group rounded-md border border-border bg-white p-3 transition duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="relative aspect-square overflow-hidden rounded-md border border-border bg-[linear-gradient(135deg,#f8fafc_0%,#eef6fb_100%)]">
                  {category.image_url ? (
                    <Image
                      src={category.image_url}
                      alt={category.name}
                      fill
                      sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                      className="object-contain p-4 transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <MediaPlaceholder Icon={Boxes} className="h-full w-full" />
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <h3 className="text-base">{category.name}</h3>
                  <ArrowRight
                    className="size-4 shrink-0 text-accent transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))}
          </div>
          {hasMoreCategories ? (
            <div className="mt-8 flex justify-center">
              <Button asChild variant="outline">
                <Link href="/products">
                  Show More
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          ) : null}
        </div>
      </SectionReveal>

      <div className="bg-brand-gradient">
        <SectionReveal className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <h2 className="text-brand-navy">
                  <b>Our Services</b>
                </h2>
                <p className="mt-4 text-brand-navy/75">
                  Our service team supports procurement teams and facility
                  managers long after delivery, because machine uptime is part
                  of the cost calculation.
                </p>
              </div>
              <Button
                asChild
                className="w-fit bg-brand-navy text-white hover:bg-brand-navy/85"
              >
                <Link href="/services">
                  View All Services
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {services.map(
                ({ title, description, href, image, imageAlt, imagePosition }) => (
                  <div
                    key={title}
                    className="group overflow-hidden rounded-md border border-brand-navy/15 bg-white/80 p-4 transition duration-300 hover:border-brand-navy/30 hover:shadow-lg hover:shadow-brand-navy/10"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-brand-navy/10 bg-white/20">
                      <Image
                        src={image}
                        alt={imageAlt}
                        fill
                        sizes="(min-width: 1024px) 22vw, 100vw"
                        className={cn(
                          "object-cover transition duration-500 group-hover:scale-105",
                          imagePosition,
                        )}
                      />
                    </div>
                    <h3 className="mt-4 text-brand-navy">{title}</h3>
                    <p className="mt-3 text-sm text-brand-navy/75">
                      {description}
                    </p>
                    <Link href={href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-navy underline underline-offset-4">View service details<ArrowRight size={16} aria-hidden="true" /></Link>
                  </div>
                ),
              )}
            </div>
          </div>
        </SectionReveal>
      </div>

      <SectionReveal className="bg-background py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Top Picks" title="Featured Equipment" />
          <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
            {featuredProducts.map((product) => (
              <div key={product.id} className="min-w-[250px] snap-start lg:min-w-0"><ProductCard product={product} /></div>
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal>
        <CtaBanner />
      </SectionReveal>

      {blogPosts.length > 0 && <SectionReveal className="bg-muted py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Insights & Guides" />
          <div className="grid gap-4 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <article
                key={post.href}
                className="rounded-md border border-border bg-white p-3 shadow-sm"
              >
                <MediaPlaceholder
                  Icon={[BrushCleaning, Wrench, Gauge][index]}
                  className="aspect-[16/9]"
                />
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {post.date}
                </p>
                <h3 className="mt-1 text-lg">{post.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                  {post.excerpt}
                </p>
                <Link
                  href={post.href}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent"
                >
                  Read more
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </SectionReveal>}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><GuideLinks /></div>
      <SectionReveal className="border-t border-border bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
              Get In Touch
            </p>
            <h2 className="mt-3">Tell Us What Your Facility Needs</h2>
            <p className="mt-4 text-muted-foreground">
              Share your site type, floor area, machine requirement, or service
              issue. Our team will respond with practical next steps.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
            <aside className="rounded-lg bg-brand-gradient p-8 text-brand-navy lg:col-span-2">
              <h3 className="text-2xl text-brand-navy">Contact Moral Clean</h3>
              <p className="mt-3 text-sm leading-6 text-brand-navy/80">
                Call for urgent support or send the details through the form
                for equipment, parts, quotations, and service requests.
              </p>

              <div className="mt-8 space-y-5 text-sm">
                <div className="flex gap-3">
                  <MapPin
                    className="mt-0.5 size-5 shrink-0 text-brand-navy"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-brand-navy">Office</p>
                    <p className="mt-1 leading-6 text-brand-navy/80">{address}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone
                    className="mt-0.5 size-5 shrink-0 text-brand-navy"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-brand-navy">Phone</p>
                    <a
                      href={`tel:+${phoneDigits}`}
                      className="mt-1 block text-brand-navy/80 transition-opacity hover:opacity-75"
                    >
                      {phone}
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail
                    className="mt-0.5 size-5 shrink-0 text-brand-navy"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-brand-navy">Email</p>
                    <a
                      href={`mailto:${email}`}
                      className="mt-1 block break-all text-brand-navy/80 transition-opacity hover:opacity-75"
                    >
                      {email}
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock3
                    className="mt-0.5 size-5 shrink-0 text-brand-navy"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-brand-navy">Business Hours</p>
                    <p className="mt-1 text-brand-navy/80">{hours}</p>
                  </div>
                </div>
              </div>

              {whatsappDigits ? (
                <a
                  href={`https://wa.me/${whatsappDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-85"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Chat on WhatsApp
                </a>
              ) : null}
            </aside>

            <div className="lg:col-span-3">
              <ContactForm supportPhone={settings.business_phone || settings.contact_phone} />
            </div>
          </div>
        </div>
      </SectionReveal>
    </>
  );
}
