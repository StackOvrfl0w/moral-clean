import type {
  BlogPost,
  Category,
  ProductWithRelations,
  Service,
  Tag,
} from "@/lib/types";

export const mockCategories: Category[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    slug: "floor-cleaning-machines",
    name: "Floor Cleaning Machines",
    description: "Scrubber dryers and mechanized floor cleaning equipment.",
    image_url: null,
    parent_id: null,
    sort_order: 1,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    slug: "vacuum-cleaners",
    name: "Vacuum Cleaners",
    description: "Wet and dry vacuums for commercial and industrial sites.",
    image_url: null,
    parent_id: null,
    sort_order: 2,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    slug: "high-pressure-cleaners",
    name: "High Pressure Cleaners",
    description: "Cold and hot water pressure washers for heavy cleaning.",
    image_url: null,
    parent_id: null,
    sort_order: 3,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    slug: "steam-cleaners",
    name: "Steam Cleaners",
    description: "Steam cleaning systems for hygiene-critical environments.",
    image_url: null,
    parent_id: null,
    sort_order: 4,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    slug: "sweepers",
    name: "Sweepers",
    description: "Manual and ride-on sweepers for dust and debris control.",
    image_url: null,
    parent_id: null,
    sort_order: 5,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "66666666-6666-4666-8666-666666666666",
    slug: "single-disc-machines",
    name: "Single Disc Machines",
    description: "Machines for scrubbing, polishing, buffing, and restoration.",
    image_url: null,
    parent_id: null,
    sort_order: 6,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "77777777-7777-4777-8777-777777777777",
    slug: "cleaning-chemicals",
    name: "Cleaning Chemicals",
    description: "Professional detergents and chemicals for machine cleaning.",
    image_url: null,
    parent_id: null,
    sort_order: 7,
    created_at: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "88888888-8888-4888-8888-888888888888",
    slug: "janitorial-equipment",
    name: "Janitorial Equipment",
    description: "Trolleys, tools, and consumables for daily facility cleaning.",
    image_url: null,
    parent_id: null,
    sort_order: 8,
    created_at: "2026-01-01T00:00:00.000Z",
  },
];

export const mockTags: Tag[] = [
  { id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1", slug: "heavy-duty", name: "Heavy Duty" },
  { id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2", slug: "battery-powered", name: "Battery Powered" },
  { id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3", slug: "industrial", name: "Industrial" },
  { id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4", slug: "maintenance", name: "Maintenance" },
  { id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5", slug: "hot-water", name: "Hot Water" },
  { id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa6", slug: "facility-care", name: "Facility Care" },
];

const categoryBySlug = Object.fromEntries(
  mockCategories.map((category) => [category.slug, category]),
);

const tagBySlug = Object.fromEntries(mockTags.map((tag) => [tag.slug, tag]));

function product(
  input: Omit<ProductWithRelations, "category" | "images" | "tags"> & {
    categorySlug: string;
    tagSlugs: string[];
  },
): ProductWithRelations {
  const { categorySlug, tagSlugs, ...productFields } = input;

  return {
    ...productFields,
    category: categoryBySlug[categorySlug] ?? null,
    images: [],
    tags: tagSlugs
      .map((slug) => tagBySlug[slug])
      .filter((tag): tag is Tag => Boolean(tag)),
  };
}

export const mockProducts: ProductWithRelations[] = [
  product({
    id: "90000000-0000-4000-8000-000000000001",
    slug: "ride-on-scrubber-dryer",
    name: "Ride-On Scrubber Dryer",
    short_description:
      "High-capacity scrubber dryer for warehouses, factories, malls, and large commercial floors.",
    long_description: null,
    specifications: {
      cleaning_width: "860 mm",
      tank_capacity: "120 L",
      power: "Battery",
    },
    category_id: categoryBySlug["floor-cleaning-machines"].id,
    categorySlug: "floor-cleaning-machines",
    brand: "Moral Clean Pro",
    model_code: "MC-RS860",
    featured: true,
    in_stock: true,
    sort_order: 1,
    meta_title: null,
    meta_description: null,
    created_at: "2026-04-28T00:00:00.000Z",
    updated_at: "2026-04-28T00:00:00.000Z",
    tagSlugs: ["heavy-duty", "battery-powered", "industrial"],
  }),
  product({
    id: "90000000-0000-4000-8000-000000000002",
    slug: "walk-behind-scrubber-dryer-50l",
    name: "Walk-Behind Scrubber Dryer 50L",
    short_description:
      "Compact scrubber dryer for hospitals, offices, retail floors, and controlled cleaning routes.",
    long_description: null,
    specifications: {
      cleaning_width: "510 mm",
      tank_capacity: "50 L",
      power: "Battery",
    },
    category_id: categoryBySlug["floor-cleaning-machines"].id,
    categorySlug: "floor-cleaning-machines",
    brand: "Moral Clean Pro",
    model_code: "MC-WB510",
    featured: true,
    in_stock: true,
    sort_order: 2,
    meta_title: null,
    meta_description: null,
    created_at: "2026-04-22T00:00:00.000Z",
    updated_at: "2026-04-22T00:00:00.000Z",
    tagSlugs: ["battery-powered", "facility-care"],
  }),
  product({
    id: "90000000-0000-4000-8000-000000000003",
    slug: "industrial-wet-dry-vacuum-70l",
    name: "Industrial Wet & Dry Vacuum 70L",
    short_description:
      "Stainless steel wet and dry vacuum built for workshops, plants, and cleaning contractors.",
    long_description: null,
    specifications: {
      tank_capacity: "70 L",
      motors: "2",
      body: "Stainless steel",
    },
    category_id: categoryBySlug["vacuum-cleaners"].id,
    categorySlug: "vacuum-cleaners",
    brand: "CleanTech Industrial",
    model_code: "CT-WD70",
    featured: true,
    in_stock: true,
    sort_order: 3,
    meta_title: null,
    meta_description: null,
    created_at: "2026-04-18T00:00:00.000Z",
    updated_at: "2026-04-18T00:00:00.000Z",
    tagSlugs: ["heavy-duty", "industrial"],
  }),
  product({
    id: "90000000-0000-4000-8000-000000000004",
    slug: "hot-water-high-pressure-cleaner",
    name: "Hot Water High Pressure Cleaner",
    short_description:
      "Hot water pressure cleaner for grease, oil, transport yards, and industrial wash bays.",
    long_description: null,
    specifications: {
      pressure: "200 bar",
      temperature: "Up to 90 C",
      power: "Diesel boiler",
    },
    category_id: categoryBySlug["high-pressure-cleaners"].id,
    categorySlug: "high-pressure-cleaners",
    brand: "PowerJet",
    model_code: "PJ-HW200",
    featured: true,
    in_stock: true,
    sort_order: 4,
    meta_title: null,
    meta_description: null,
    created_at: "2026-04-12T00:00:00.000Z",
    updated_at: "2026-04-12T00:00:00.000Z",
    tagSlugs: ["hot-water", "industrial"],
  }),
  product({
    id: "90000000-0000-4000-8000-000000000005",
    slug: "single-disc-floor-machine-17-inch",
    name: "Single Disc Floor Machine 17 inch",
    short_description:
      "Reliable single disc machine for scrubbing, polishing, buffing, and floor restoration.",
    long_description: null,
    specifications: {
      brush_size: "17 inch",
      speed: "154 rpm",
      power: "1200 W",
    },
    category_id: categoryBySlug["single-disc-machines"].id,
    categorySlug: "single-disc-machines",
    brand: "FloorMaster",
    model_code: "FM-17",
    featured: false,
    in_stock: true,
    sort_order: 5,
    meta_title: null,
    meta_description: null,
    created_at: "2026-03-30T00:00:00.000Z",
    updated_at: "2026-03-30T00:00:00.000Z",
    tagSlugs: ["maintenance", "facility-care"],
  }),
  product({
    id: "90000000-0000-4000-8000-000000000006",
    slug: "commercial-steam-cleaner",
    name: "Commercial Steam Cleaner",
    short_description:
      "Steam cleaning unit for kitchens, healthcare areas, tile joints, and hygiene-focused jobs.",
    long_description: null,
    specifications: {
      pressure: "8 bar",
      boiler: "Stainless steel",
      application: "Sanitization",
    },
    category_id: categoryBySlug["steam-cleaners"].id,
    categorySlug: "steam-cleaners",
    brand: "SteamPro",
    model_code: "SP-8",
    featured: false,
    in_stock: true,
    sort_order: 6,
    meta_title: null,
    meta_description: null,
    created_at: "2026-03-24T00:00:00.000Z",
    updated_at: "2026-03-24T00:00:00.000Z",
    tagSlugs: ["facility-care", "maintenance"],
  }),
  product({
    id: "90000000-0000-4000-8000-000000000007",
    slug: "walk-behind-industrial-sweeper",
    name: "Walk-Behind Industrial Sweeper",
    short_description:
      "Dust and debris sweeper for parking areas, warehouses, loading bays, and production floors.",
    long_description: null,
    specifications: {
      working_width: "920 mm",
      hopper: "40 L",
      drive: "Manual assist",
    },
    category_id: categoryBySlug["sweepers"].id,
    categorySlug: "sweepers",
    brand: "CleanTech Industrial",
    model_code: "CT-S920",
    featured: false,
    in_stock: true,
    sort_order: 7,
    meta_title: null,
    meta_description: null,
    created_at: "2026-03-12T00:00:00.000Z",
    updated_at: "2026-03-12T00:00:00.000Z",
    tagSlugs: ["industrial", "heavy-duty"],
  }),
  product({
    id: "90000000-0000-4000-8000-000000000008",
    slug: "industrial-degreaser-20l",
    name: "Industrial Degreaser 20L",
    short_description:
      "Concentrated degreaser for workshops, machinery zones, oil stains, and maintenance cleaning.",
    long_description: null,
    specifications: {
      pack_size: "20 L",
      dilution: "Variable",
      application: "Machine and manual cleaning",
    },
    category_id: categoryBySlug["cleaning-chemicals"].id,
    categorySlug: "cleaning-chemicals",
    brand: "Moral Clean Chemicals",
    model_code: "MC-DG20",
    featured: false,
    in_stock: true,
    sort_order: 8,
    meta_title: null,
    meta_description: null,
    created_at: "2026-02-20T00:00:00.000Z",
    updated_at: "2026-02-20T00:00:00.000Z",
    tagSlugs: ["maintenance", "industrial"],
  }),
  product({
    id: "90000000-0000-4000-8000-000000000009",
    slug: "janitorial-service-trolley",
    name: "Janitorial Service Trolley",
    short_description:
      "Multi-purpose trolley for housekeeping teams, facility crews, and daily janitorial operations.",
    long_description: null,
    specifications: {
      buckets: "Dual bucket",
      frame: "Polypropylene",
      use_case: "Housekeeping",
    },
    category_id: categoryBySlug["janitorial-equipment"].id,
    categorySlug: "janitorial-equipment",
    brand: "Moral Clean Essentials",
    model_code: "MC-JT2",
    featured: false,
    in_stock: true,
    sort_order: 9,
    meta_title: null,
    meta_description: null,
    created_at: "2026-02-08T00:00:00.000Z",
    updated_at: "2026-02-08T00:00:00.000Z",
    tagSlugs: ["facility-care"],
  }),
  product({
    id: "90000000-0000-4000-8000-000000000010",
    slug: "compact-dry-vacuum-cleaner",
    name: "Compact Dry Vacuum Cleaner",
    short_description:
      "Quiet daily-use dry vacuum for offices, hotels, education facilities, and corporate buildings.",
    long_description: null,
    specifications: {
      tank_capacity: "15 L",
      filtration: "Cloth filter",
      noise: "Low-noise operation",
    },
    category_id: categoryBySlug["vacuum-cleaners"].id,
    categorySlug: "vacuum-cleaners",
    brand: "Moral Clean Essentials",
    model_code: "MC-DV15",
    featured: false,
    in_stock: true,
    sort_order: 10,
    meta_title: null,
    meta_description: null,
    created_at: "2026-01-28T00:00:00.000Z",
    updated_at: "2026-01-28T00:00:00.000Z",
    tagSlugs: ["facility-care"],
  }),
  product({
    id: "90000000-0000-4000-8000-000000000011",
    slug: "cold-water-pressure-cleaner-150-bar",
    name: "Cold Water Pressure Cleaner 150 Bar",
    short_description:
      "Portable pressure cleaner for building maintenance, outdoor floors, equipment, and fleet washing.",
    long_description: null,
    specifications: {
      pressure: "150 bar",
      flow_rate: "9 L/min",
      power: "Electric",
    },
    category_id: categoryBySlug["high-pressure-cleaners"].id,
    categorySlug: "high-pressure-cleaners",
    brand: "PowerJet",
    model_code: "PJ-CW150",
    featured: false,
    in_stock: true,
    sort_order: 11,
    meta_title: null,
    meta_description: null,
    created_at: "2026-01-14T00:00:00.000Z",
    updated_at: "2026-01-14T00:00:00.000Z",
    tagSlugs: ["maintenance"],
  }),
  product({
    id: "90000000-0000-4000-8000-000000000012",
    slug: "floor-polishing-pads-assorted",
    name: "Floor Polishing Pads Assorted",
    short_description:
      "Color-coded pads for stripping, scrubbing, buffing, polishing, and regular floor care.",
    long_description: null,
    specifications: {
      sizes: "13 inch to 20 inch",
      types: "Black, red, white, green",
      application: "Single disc machines",
    },
    category_id: categoryBySlug["janitorial-equipment"].id,
    categorySlug: "janitorial-equipment",
    brand: "FloorMaster",
    model_code: "FM-PADS",
    featured: false,
    in_stock: true,
    sort_order: 12,
    meta_title: null,
    meta_description: null,
    created_at: "2026-01-03T00:00:00.000Z",
    updated_at: "2026-01-03T00:00:00.000Z",
    tagSlugs: ["maintenance", "facility-care"],
  }),
];

export const mockServices: Service[] = [
  {
    id: "s0000000-0000-4000-8000-000000000001",
    slug: "motor-repairing",
    name: "Motor Repairing",
    short_description:
      "Diagnosis, rewinding coordination, fitting, and performance testing for motors used in commercial cleaning equipment.",
    long_description:
      "Our technicians inspect motor performance, identify root causes of overheating or power loss, and carry out repairs with proper alignment and testing. We support common scrubber, vacuum, pressure cleaner, and single-disc machine motor assemblies.",
    icon_name: "settings",
    image_url: null,
    sort_order: 1,
  },
  {
    id: "s0000000-0000-4000-8000-000000000002",
    slug: "parts-replacement",
    name: "Parts Replacement",
    short_description:
      "Original wear-parts sourcing and replacement for continuous uptime across your cleaning fleet.",
    long_description:
      "We replace brushes, squeegees, hoses, filters, motors, switches, and other consumables using compatible genuine parts whenever available. Our team ensures fitment, calibration, and post-repair checks before handover.",
    icon_name: "wrench",
    image_url: null,
    sort_order: 2,
  },
  {
    id: "s0000000-0000-4000-8000-000000000003",
    slug: "brush-refilling",
    name: "Brush Refilling",
    short_description:
      "Brush refilling and replacement support for scrubbers, sweepers, and single-disc floor machines.",
    long_description:
      "We provide practical brush maintenance services to extend usable life while maintaining cleaning quality. Where required, we replace worn brush sets and advise suitable brush types for your floor surface and duty cycle.",
    icon_name: "brush",
    image_url: null,
    sort_order: 3,
  },
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: "b0000000-0000-4000-8000-000000000001",
    slug: "how-to-choose-the-right-industrial-vacuum-for-your-facility",
    title: "How to Choose the Right Industrial Vacuum for Your Facility",
    excerpt:
      "A practical checklist for selecting industrial vacuums based on debris type, runtime, filtration needs, and site conditions.",
    content: `
      <p>Selecting an industrial vacuum should start with the actual cleaning load, not just motor wattage. Identify what material is being collected—fine dust, metal particles, liquids, or mixed waste—then match tank type and filtration to that requirement.</p>
      <h2>Evaluate the duty cycle first</h2>
      <p>Facilities with continuous cleaning windows should prioritize machines designed for long runtime and easy consumable replacement. For short, periodic usage, compact units may be more cost-effective.</p>
      <h2>Match filtration to risk</h2>
      <p>Where fine particulate is present, filtration quality and seal reliability matter more than headline suction figures. Confirm filter class, replacement availability, and maintenance process before procurement.</p>
      <h2>Check serviceability</h2>
      <p>Choose models with accessible parts and local technical support. A vacuum with fast parts turnaround typically delivers better long-term uptime than a higher-spec machine with poor support coverage.</p>
    `,
    cover_image_url: null,
    author_name: "Moral Clean Team",
    published: true,
    published_at: "2026-05-02T00:00:00.000Z",
    meta_title: null,
    meta_description: null,
    created_at: "2026-05-02T00:00:00.000Z",
    updated_at: "2026-05-02T00:00:00.000Z",
  },
  {
    id: "b0000000-0000-4000-8000-000000000002",
    slug: "5-maintenance-tips-to-extend-your-scrubber-dryers-lifespan",
    title: "5 Maintenance Tips to Extend Your Scrubber Dryer's Lifespan",
    excerpt:
      "Simple maintenance routines that improve scrubber dryer reliability, reduce repairs, and preserve cleaning performance.",
    content: `
      <p>Scrubber dryers perform best when maintenance is consistent and documented. Small checks done daily can prevent larger failures and avoid unplanned downtime.</p>
      <h2>1. Clean recovery and solution tanks daily</h2>
      <p>Residue buildup increases odor risk and affects machine hygiene. Drain, rinse, and dry tanks after every shift.</p>
      <h2>2. Inspect squeegee blades and brushes regularly</h2>
      <p>Uneven wear directly impacts drying quality and floor finish. Replace worn edges early to avoid repeat cleaning passes.</p>
      <h2>3. Monitor battery and charging routines</h2>
      <p>For battery models, charging discipline significantly affects lifecycle. Follow the manufacturer charging window and avoid deep discharge cycles.</p>
      <h2>4. Keep filters and hoses clear</h2>
      <p>Airflow and water flow restrictions force motors to work harder. Scheduled cleaning reduces load and improves consistency.</p>
      <h2>5. Log faults and service actions</h2>
      <p>Maintenance records help identify recurring patterns and improve preventive planning across multiple machines.</p>
    `,
    cover_image_url: null,
    author_name: "Moral Clean Team",
    published: true,
    published_at: "2026-04-20T00:00:00.000Z",
    meta_title: null,
    meta_description: null,
    created_at: "2026-04-20T00:00:00.000Z",
    updated_at: "2026-04-20T00:00:00.000Z",
  },
  {
    id: "b0000000-0000-4000-8000-000000000003",
    slug: "steam-vs-pressure-cleaning-which-is-right-for-your-industry",
    title: "Steam vs Pressure Cleaning: Which Is Right for Your Industry",
    excerpt:
      "Understand where steam cleaning outperforms pressure washing and where high-pressure systems are the better operational choice.",
    content: `
      <p>Steam and pressure cleaning solve different operational problems. Selecting the right method depends on contamination type, surface sensitivity, and turnaround time requirements.</p>
      <h2>When steam cleaning is preferred</h2>
      <p>Steam is often selected for hygiene-focused environments where heat support is useful and controlled moisture output is important.</p>
      <h2>When pressure cleaning is preferred</h2>
      <p>High-pressure systems are effective for heavy soil, outdoor hard surfaces, and rapid bulk cleaning where mechanical force is required.</p>
      <h2>Operational decision framework</h2>
      <p>Assess contamination profile, utility access, operator skill level, and service support before procurement. In many sites, a hybrid approach delivers the best long-term performance.</p>
    `,
    cover_image_url: null,
    author_name: "Moral Clean Team",
    published: true,
    published_at: "2026-04-05T00:00:00.000Z",
    meta_title: null,
    meta_description: null,
    created_at: "2026-04-05T00:00:00.000Z",
    updated_at: "2026-04-05T00:00:00.000Z",
  },
];
