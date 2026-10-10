import Link from "next/link";
import { Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getAllSettings } from "@/lib/queries/settings";

export async function CtaBanner({
  heading = "Ready to Upgrade Your Cleaning Operations?",
  subtitle = "Tell us your site type, floor area, and cleaning schedule. We will recommend practical machines, service options, and parts support.",
  primaryLabel = "Get a Quote",
  primaryHref = "/contact",
  secondaryLabel = "Call Us",
  secondaryHref,
}: {
  heading?: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  if (!secondaryHref) {
    const settings = await getAllSettings();
    const phone = settings.business_phone || settings.contact_phone || "+92 309 8783242";
    secondaryHref = `tel:${phone.replace(/[^+\d]/g, "")}`;
  }
  return (
    <section
      className="bg-brand-gradient py-16 text-accent-foreground"
    >
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mx-auto max-w-3xl text-primary">{heading}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-primary/75">{subtitle}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href={primaryHref} data-quote-request="true">{primaryLabel}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white bg-white text-primary hover:bg-white/90"
          >
            <Link href={secondaryHref}>
              <Phone className="size-4" aria-hidden="true" />
              {secondaryLabel}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
