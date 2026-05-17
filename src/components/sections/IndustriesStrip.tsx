import {
  BriefcaseBusiness,
  Factory,
  GraduationCap,
  Hospital,
  Hotel,
  Layers,
  Pill,
  Store,
  Warehouse,
} from "lucide-react";

const industries = [
  { label: "Hotels", icon: Hotel },
  { label: "Hospitals", icon: Hospital },
  { label: "Pharmaceuticals", icon: Pill },
  { label: "Industrial", icon: Factory },
  { label: "Retail & Malls", icon: Store },
  { label: "Education", icon: GraduationCap },
  { label: "Corporate Offices", icon: BriefcaseBusiness },
  { label: "Warehouses", icon: Warehouse },
  { label: "Textile", icon: Layers },
];

export function IndustriesStrip({
  title = "Industries We Serve",
}: {
  title?: string;
}) {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2>{title}</h2>
        </div>
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="industries-marquee-track pointer-events-none select-none pb-3">
            {[...industries, ...industries].map(({ label, icon: Icon }, index) => (
              <div
                key={`${label}-${index}`}
                className="flex shrink-0 items-center gap-3 rounded-md border border-border bg-white px-4 py-3 text-sm font-semibold text-primary shadow-sm"
                aria-hidden={index >= industries.length}
              >
                <Icon className="size-5 text-accent" aria-hidden="true" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
