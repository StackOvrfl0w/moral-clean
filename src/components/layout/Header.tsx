"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Droplets, Menu, Phone } from "lucide-react";

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

const productCategories = [
  "Floor Cleaning Machines",
  "Vacuum Cleaners",
  "High Pressure Cleaners",
  "Steam Cleaners",
  "Sweepers",
  "Single Disc Machines",
  "Cleaning Chemicals",
  "Janitorial Equipment",
];

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function categoryHref(category: string) {
  return `/products?category=${category.toLowerCase().replaceAll(" ", "-")}`;
}

function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Moral Clean home">
      <span className="flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
        <Droplets className="size-5" aria-hidden="true" />
      </span>
      <span className="font-display text-lg font-bold uppercase tracking-wide text-primary">
        Moral Clean
      </span>
    </Link>
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="hidden bg-primary text-primary-foreground md:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-center px-6 text-xs font-medium">
          <Phone className="mr-2 size-3.5 text-accent" aria-hidden="true" />
          <span>
            Authorized distributor of leading international cleaning brands | +92
            331 3195138
          </span>
        </div>
      </div>

      <div
        className={cn(
          "border-b transition-[border-color,box-shadow] duration-200",
          isScrolled ? "border-border shadow-sm" : "border-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Wordmark />

          <nav className="hidden flex-1 justify-center lg:flex" aria-label="Primary">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link className={navigationMenuTriggerStyle()} href="/">
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Products</NavigationMenuTrigger>
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
                        {productCategories.map((category) => (
                          <NavigationMenuLink key={category} asChild>
                            <Link
                              href={categoryHref(category)}
                              className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
                            >
                              {category}
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
                        className={navigationMenuTriggerStyle()}
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
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/contact">Get a Quote</Link>
            </Button>
          </div>

          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open menu">
                  <Menu className="size-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[380px]">
                <SheetHeader className="mb-8 text-left">
                  <SheetTitle asChild>
                    <span className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
                        <Droplets className="size-5" aria-hidden="true" />
                      </span>
                      <span className="font-display text-lg font-bold uppercase tracking-wide text-primary">
                        Moral Clean
                      </span>
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-1" aria-label="Mobile primary">
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
                    {productCategories.map((category) => (
                      <SheetClose key={category} asChild>
                        <Link
                          href={categoryHref(category)}
                          className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          {category}
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
                      className="mt-5 bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <Link href="/contact">Get a Quote</Link>
                    </Button>
                  </SheetClose>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
