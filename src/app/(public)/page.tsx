import type { ComponentType, ReactNode, SVGProps } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  BrushCleaning,
  Building2,
  Droplets,
  Gauge,
  MapPinned,
  PackageCheck,
  Settings,
  ShieldCheck,
  Sparkles,
  SprayCan,
  Truck,
  Wrench,
} from "lucide-react";

import { env } from "@/config/env";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { IndustriesStrip } from "@/components/sections/IndustriesStrip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAllSettings } from "@/lib/queries/settings";
import { HeroCarousel } from "@/components/sections/HeroCarousel"; // ← new import

const siteUrl = env.siteUrl;

export const metadata: Metadata = {
  title: "Home",
  description:
    "Moral Clean supplies commercial cleaning equipment, replacement parts, and technical service support for industrial and facility operations across Pakistan.",
  openGraph: {
    title: "Moral Clean — Commercial Cleaning Equipment & Service in Pakistan",
    description:
      "Moral Clean supplies commercial cleaning equipment, replacement parts, and technical service support for industrial and facility operations across Pakistan.",
  },
  alternates: {
    canonical: `${siteUrl}/`,
  },
};

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const categories = [
  {
    name: "Walk Behind Scrubber Dryer",
    icon: BrushCleaning,
    image: "/assets/categories/walk-behind-scrubber-dryer.png",
  },
  {
    name: "Vacuum Cleaners",
    icon: Gauge,
    image: "/assets/categories/Vaccumcleaners.png",
  },
  {
    name: "High Pressure Cleaners",
    icon: SprayCan,
    image: "/assets/categories/Pressure-washer.png",
  },
  {
    name: "Steam Cleaners",
    icon: Droplets,
    image: "/assets/categories/steam-cleaner.png",
  },
  {
    name: "Ride On Scrubber Dryer",
    icon: Sparkles,
    image: "/assets/categories/Ride-on-scrubber-dryer.png",
  },
  {
    name: "Single Disc Machines",
    icon: Settings,
    image: "/assets/categories/Single-disk-machine.png",
  },
  {
    name: "Cleaning Chemicals",
    icon: PackageCheck,
    image: "/assets/categories/Cleaning-chemical.png",
  },
  {
    name: "Janitorial Equipment",
    icon: Boxes,
    image: "/assets/categories/mop-bucket.png",
  },
];

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

const featuredProducts = [
  {
    brand: "Scrubber Dryer Series",
    name: "Ride-On Scrubber Dryer",
    spec: "High-capacity floor cleaning for warehouses, malls, and factories.",
    slug: "ride-on-scrubber-dryer",
    icon: BrushCleaning,
  },
  {
    brand: "Industrial Vacuum Series",
    name: "Industrial Wet & Dry Vacuum 70L",
    spec: "Heavy-duty suction, stainless tank, and continuous commercial use.",
    slug: "industrial-wet-dry-vacuum-70l",
    icon: Gauge,
  },
  {
    brand: "Pressure Cleaning Series",
    name: "Hot Water High Pressure Cleaner",
    spec: "Built for oil, grease, transport yards, and industrial wash bays.",
    slug: "hot-water-high-pressure-cleaner",
    icon: SprayCan,
  },
  {
    brand: "Floor Care Series",
    name: "Single Disc Floor Machine 17 inch",
    spec: "Reliable scrubbing, polishing, buffing, and restoration work.",
    slug: "single-disc-floor-machine-17-inch",
    icon: Settings,
  },
];

const services = [
  {
    title: "Motor Repairing",
    description:
      "Diagnosis, rewinding coordination, fitting, and testing for commercial cleaning machine motors.",
    image: "/assets/services-image/motor-repairing.png",
    imageAlt: "Technician repairing industrial cleaning machine motor",
    imagePosition: "object-[50%_38%]",
  },
  {
    title: "Parts Replacement",
    description:
      "Brushes, squeegees, hoses, filters, motors, batteries, and consumables sourced to match your machine.",
    image: "/assets/services-image/part-replacement.png",
    imageAlt: "Replacement parts for commercial cleaning equipment",
    imagePosition: "object-[50%_48%]",
  },
  {
    title: "Brush Refilling",
    description:
      "Refilling and replacement support for scrubber, sweeper, and single-disc machine brushes.",
    image: "/assets/services-image/brush.jpeg",
    imageAlt: "Industrial cleaning brushes for maintenance and refilling",
    imagePosition: "object-[50%_56%]",
  },
];

const blogPosts = [
  {
    date: "May 8, 2026",
    title: "How to Select the Right Scrubber Dryer for Your Facility",
    excerpt:
      "Match tank size, brush pressure, runtime, and aisle width to the actual cleaning load before buying.",
    href: "/blog/selecting-scrubber-dryer",
  },
  {
    date: "April 26, 2026",
    title: "When Repair Beats Replacement for Cleaning Machines",
    excerpt:
      "A practical checklist for deciding whether motor repair, parts replacement, or a new machine makes sense.",
    href: "/blog/repair-vs-replacement",
  },
  {
    date: "April 14, 2026",
    title: "Industrial Vacuum Specs Procurement Teams Should Check",
    excerpt:
      "Tank capacity, filtration, hose diameter, and duty cycle matter more than headline suction numbers.",
    href: "/blog/industrial-vacuum-specs",
  },
];

const trustSignals = [
  { label: "Authorized Distributor", icon: BadgeCheck },
  { label: "Nationwide Service", icon: Truck },
  { label: "20+ Years Combined Expertise", icon: Building2 },
];

function slugify(value: string) {
  return value.toLowerCase().replaceAll("&", "and").replaceAll(" ", "-");
}

function SectionReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={className}>{children}</section>;
}

function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  descriptionClassName,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  descriptionClassName?: string;
}) {
  return (
    <div
      className={cn(
        "mb-10 max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">
          {eyebrow}
        </p>
      ) : null}
      <h2>{title}</h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base text-muted-foreground",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
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
  const settings = await getAllSettings();

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
      <div
        style={{ background: "linear-gradient(to right, #00defc, #00a8ff)" }}
      >
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
                  className="rounded-md border border-[#0a2540]/15 bg-white p-5 shadow-sm"
                >
                  <Icon className="size-8 text-[#0a2540]" aria-hidden="true" />
                  <h3 className="mt-4 text-[#0a2540]">{title}</h3>
                  <p className="mt-2 text-sm text-[#0a2540]/75">
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
            {categories.map(({ name, image }) => (
              <Link
                key={name}
                href={`/products?category=${slugify(name)}`}
                className="group rounded-md border border-border bg-white p-3 transition duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="relative aspect-square overflow-hidden rounded-md border border-border bg-[linear-gradient(135deg,#f8fafc_0%,#eef6fb_100%)]">
                  <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                    className="object-contain p-4 transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <h3 className="text-base">{name}</h3>
                  <ArrowRight
                    className="size-4 shrink-0 text-accent transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </SectionReveal>

      <div
        style={{ background: "linear-gradient(to right, #00defc, #00a8ff)" }}
      >
        <SectionReveal className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <h2 className="text-[#0a2540]">
                  <b>Our Services</b>
                </h2>
                <p className="mt-4 text-[#0a2540]/75">
                  Our service team supports procurement teams and facility
                  managers long after delivery, because machine uptime is part
                  of the cost calculation.
                </p>
              </div>
              <Button
                asChild
                className="w-fit bg-[#0a2540] text-white hover:bg-[#0a2540]/85"
              >
                <Link href="/services">
                  View All Services
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {services.map(
                ({ title, description, image, imageAlt, imagePosition }) => (
                  <div
                    key={title}
                    className="group overflow-hidden rounded-md border border-[#0a2540]/15 bg-white/80 p-4 transition duration-300 hover:border-[#0a2540]/30 hover:shadow-lg hover:shadow-[#0a2540]/10"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-[#0a2540]/10 bg-white/20">
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
                    <h3 className="mt-4 text-[#0a2540]">{title}</h3>
                    <p className="mt-3 text-sm text-[#0a2540]/75">
                      {description}
                    </p>
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
            {featuredProducts.map(({ brand, name, spec, slug, icon: Icon }) => (
              <article
                key={slug}
                className="min-w-[250px] snap-start rounded-md border border-border bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-primary/5 lg:min-w-0"
              >
                <MediaPlaceholder Icon={Icon} className="aspect-[4/3]" />
                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                  {brand}
                </p>
                <h3 className="mt-1 text-lg">{name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{spec}</p>
                <Link
                  href={`/products/${slug}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent"
                >
                  View Details
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal>
        <CtaBanner />
      </SectionReveal>

      <SectionReveal className="bg-muted py-12">
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
      </SectionReveal>
    </>
  );
}
