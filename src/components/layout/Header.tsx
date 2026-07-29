"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Droplets, Mail, Menu, Phone } from "lucide-react";
import type { CategoryWithCount } from "@/lib/queries/categories";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// const productCategories = [
//   "Floor Cleaning Machines",
//   "Vacuum Cleaners",
//   "High Pressure Cleaners",
//   "Steam Cleaners",
//   "Sweepers",
//   "Single Disc Machines",
//   "Cleaning Chemicals",
//   "Janitorial Equipment",
// ];

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61591695643287",
    icon: FaFacebookF,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/moral_clean/",
    icon: FaInstagram,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/moralclean",
    icon: FaLinkedinIn,
  },
];

// function categoryHref(category: string) {
//   return `/products?category=${category.toLowerCase().replaceAll(" ", "-")}`;
// }

function Wordmark() {
  return (
    <Link
      href="/"
      className="flex flex-col items-start gap-0.5"
      aria-label="Moral Clean home"
    >
      <span className="bg-brand-gradient bg-clip-text font-etna text-3xl font-bold tracking-wide text-transparent">
        moralclean
      </span>
      {/* <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
        Commercial Cleaning Equipment Supplier
      </span> */}
    </Link>
  );
}

interface HeaderProps {
  settings: Record<string, string>;
  categories: CategoryWithCount[];
}

export function Header({ settings, categories }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const phone = settings.contact_phone || "+92 309 8783242";
  const email = settings.contact_email || "info@moralclean.com";

  return (
    <header className="sticky top-0 z-50 bg-background">
      {/* Top bar */}
      <div className="hidden bg-brand-gradient py-2 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-5 text-xs font-medium">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 text-white/90 transition-colors hover:text-white"
            >
              <Mail className="size-3.5 text-white" aria-hidden="true" />
              {email}
            </a>

            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 text-white/90 transition-colors hover:text-white"
            >
              <Phone className="size-3.5 text-white" aria-hidden="true" />
              {phone}
            </a>
          </div>

          <div className="flex items-center gap-1">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-8 items-center justify-center rounded-full border border-white/40 text-white transition-all duration-200 hover:border-white hover:bg-white/15 hover:shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              >
                <Icon className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div
        className={cn(
          "border-b transition-[border-color,box-shadow] duration-200",
          isScrolled ? "border-border shadow-sm" : "border-transparent",
        )}
      >
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Wordmark />

          <nav
            className="hidden flex-1 items-center justify-center lg:flex"
            aria-label="Primary"
          >
            <NavigationMenu>
              <NavigationMenuList className="gap-4">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "h-12 px-5 text-[16px] font-medium",
                      )}
                      href="/"
                    >
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-12 px-5 text-[16px] font-medium">
                    Products
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[640px] p-5">
                      <div className="mb-4 border-b border-border pb-4">
                        <NavigationMenuLink asChild>
                          <Link
                            href="/products"
                            className="block rounded-md p-3 transition-colors hover:bg-muted"
                          >
                            <span className="font-display text-base font-semibold text-primary">
                              Products
                            </span>
                            <span className="mt-1 block text-sm text-muted-foreground">
                              Browse commercial machines, parts, and cleaning
                              supplies.
                            </span>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => (
                          <NavigationMenuLink key={category.slug} asChild>
                            <Link
                              href={`/products/category/${category.slug}`}
                              className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
                            >
                              {category.name}
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {navItems.slice(1).map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "h-12 px-5 text-[16px] font-medium",
                        )}
                        href={item.href}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Button
              asChild
              className="border-0 bg-brand-gradient text-white hover:opacity-90"
            >
              <Link href="/contact">Get a Quote</Link>
            </Button>
          </div>

          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open menu">
                  <Menu className="size-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[380px]">
                <SheetHeader className="mb-8 text-left">
                  <SheetTitle asChild>
                    <span className="flex items-center gap-3">
                      <span className="flex size-11 items-center justify-center rounded-md bg-accent text-accent-foreground">
                        <Droplets className="size-6" aria-hidden="true" />
                      </span>
                      <span className="bg-brand-gradient bg-clip-text font-etna text-2xl font-bold uppercase tracking-wide text-transparent">
                        Moral Clean
                      </span>
                    </span>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile contact info */}
                <div className="mb-5 flex flex-col gap-2 rounded-md bg-muted px-3 py-3 text-sm">
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                  >
                    <Mail className="size-4 text-accent" />
                    {email}
                  </a>
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                  >
                    <Phone className="size-4 text-accent" />
                    {phone}
                  </a>
                </div>

                <nav
                  className="flex flex-col gap-1"
                  aria-label="Mobile primary"
                >
                  <SheetClose asChild>
                    <Link
                      href="/"
                      className="rounded-md px-2 py-3 text-base font-medium text-foreground hover:bg-muted"
                    >
                      Home
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/products"
                      className="rounded-md px-2 py-3 text-base font-medium text-foreground hover:bg-muted"
                    >
                      Products
                    </Link>
                  </SheetClose>
                  <div className="mb-2 grid gap-1 border-l border-border pl-3">
                    {categories.map((category) => (
                      <SheetClose key={category.slug} asChild>
                        <Link
                          href={`/products/category/${category.slug}`}
                          className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          {category.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                  {navItems.slice(1).map((item) => (
                    <SheetClose key={item.href} asChild>
                      <Link
                        href={item.href}
                        className="rounded-md px-2 py-3 text-base font-medium text-foreground hover:bg-muted"
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <Button
                      asChild
                      size="lg"
                      className="mt-2 h-12 rounded-md bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <Link href="/contact">Get a Quote</Link>
                    </Button>
                  </SheetClose>
                </nav>

                {/* Mobile social icons */}
                <div className="mt-6 flex items-center gap-2">
                  {socialLinks.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex size-8 items-center justify-center rounded border border-border text-muted-foreground hover:border-accent hover:text-primary"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
