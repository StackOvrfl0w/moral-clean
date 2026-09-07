export const MAX_PRODUCT_CSV_BYTES = 1024 * 1024;
export const MAX_PRODUCT_CSV_ROWS = 250;
export const MAX_PRODUCT_IMAGE_BYTES = 50 * 1024;
export const MAX_PRODUCT_LOCAL_IMAGES = 100;

export const PRODUCT_CSV_HEADERS = [
  "name",
  "slug",
  "category",
  "brand",
  "model_code",
  "short_description",
  "long_description",
  "specifications",
  "tags",
  "featured",
  "in_stock",
  "sort_order",
  "meta_title",
  "meta_description",
  "primary_image",
  "primary_image_alt",
  "gallery_images",
  "gallery_image_alts",
] as const;

export type ProductCsvColumn = (typeof PRODUCT_CSV_HEADERS)[number];
export type ProductCsvRecord = Record<ProductCsvColumn, string>;

export type ParsedProductCsvRow = {
  line: number;
  values: ProductCsvRecord;
};

export type ParsedProductCsv = {
  headers: string[];
  unknownHeaders: string[];
  rows: ParsedProductCsvRow[];
  errors: string[];
};

export type ProductCsvImportError = {
  row: number;
  product: string;
  message: string;
};

export type ProductCsvImportResult = {
  success: boolean;
  created: number;
  updated: number;
  skipped: number;
  errors: ProductCsvImportError[];
  message?: string;
};

const HEADER_ALIASES: Record<string, ProductCsvColumn> = {
  name: "name",
  product_name: "name",
  slug: "slug",
  category: "category",
  category_name: "category",
  brand: "brand",
  model: "model_code",
  model_code: "model_code",
  short_description: "short_description",
  description: "short_description",
  long_description: "long_description",
  details: "long_description",
  specifications: "specifications",
  specs: "specifications",
  tags: "tags",
  featured: "featured",
  in_stock: "in_stock",
  stock: "in_stock",
  sort_order: "sort_order",
  order: "sort_order",
  meta_title: "meta_title",
  seo_title: "meta_title",
  meta_description: "meta_description",
  seo_description: "meta_description",
  primary_image: "primary_image",
  primary_image_url: "primary_image",
  image: "primary_image",
  image_url: "primary_image",
  primary_image_alt: "primary_image_alt",
  image_alt: "primary_image_alt",
  alt_text: "primary_image_alt",
  gallery_images: "gallery_images",
  additional_images: "gallery_images",
  other_images: "gallery_images",
  gallery_image_alts: "gallery_image_alts",
  additional_image_alts: "gallery_image_alts",
  other_image_alts: "gallery_image_alts",
};

function normalizeHeader(value: string) {
  return value
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function emptyRecord(): ProductCsvRecord {
  return Object.fromEntries(
    PRODUCT_CSV_HEADERS.map((header) => [header, ""]),
  ) as ProductCsvRecord;
}

function parseCsvMatrix(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  const errors: string[] = [];

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (inQuotes) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          cell += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      row.push(cell);
      cell = "";
      continue;
    }

    if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    if (char !== "\r") {
      cell += char;
    }
  }

  if (inQuotes) {
    errors.push("The CSV contains an unclosed quoted value.");
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return { rows, errors };
}

export function parseProductCsv(text: string): ParsedProductCsv {
  const { rows: matrix, errors } = parseCsvMatrix(text);

  if (matrix.length === 0) {
    return {
      headers: [],
      unknownHeaders: [],
      rows: [],
      errors: ["The CSV file is empty."],
    };
  }

  const rawHeaders = matrix[0].map(normalizeHeader);
  const mappedHeaders = rawHeaders.map(
    (header) => HEADER_ALIASES[header] ?? null,
  );
  const unknownHeaders = rawHeaders.filter(
    (header, index) => header && !mappedHeaders[index],
  );
  const seen = new Set<string>();
  const duplicateHeaders = mappedHeaders
    .filter((header): header is ProductCsvColumn => Boolean(header))
    .filter((header) => {
      if (seen.has(header)) return true;
      seen.add(header);
      return false;
    });

  if (!mappedHeaders.includes("name")) {
    errors.push('Missing required "name" column.');
  }

  if (duplicateHeaders.length > 0) {
    errors.push(
      `Duplicate CSV columns detected: ${Array.from(new Set(duplicateHeaders)).join(", ")}.`,
    );
  }

  const parsedRows = matrix
    .slice(1)
    .map((cells, rowIndex) => {
      const values = emptyRecord();

      mappedHeaders.forEach((header, columnIndex) => {
        if (header) values[header] = (cells[columnIndex] ?? "").trim();
      });

      return {
        line: rowIndex + 2,
        values,
      };
    })
    .filter((row) =>
      Object.values(row.values).some((value) => value.trim().length > 0),
    );

  return {
    headers: rawHeaders,
    unknownHeaders,
    rows: parsedRows,
    errors,
  };
}

function csvCell(value: string) {
  if (!/[",\n\r]/.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

export function createProductCsvTemplate() {
  const example = [
    "Ride-On Scrubber Dryer",
    "ride-on-scrubber-dryer",
    "Scrubber Dryers",
    "Example Brand",
    "MC-700",
    "Commercial ride-on scrubber dryer for large floor areas.",
    "Use this field for the full product description. Commas are safe when the cell is quoted.",
    "Tank Capacity=80 L|Working Width=700 mm|Power=24 V",
    "scrubber dryer|ride on|floor care",
    "yes",
    "yes",
    "10",
    "Ride-On Scrubber Dryer in Pakistan",
    "Commercial ride-on scrubber dryer with service support in Pakistan.",
    "https://ik.imagekit.io/your_imagekit_id/products/ride-on-scrubber-front.webp",
    "Ride-on scrubber dryer front view",
    "https://ik.imagekit.io/your_imagekit_id/products/ride-on-scrubber-side.webp|https://ik.imagekit.io/your_imagekit_id/products/ride-on-scrubber-rear.webp",
    "Ride-on scrubber dryer side view|Ride-on scrubber dryer rear view",
  ];

  return [PRODUCT_CSV_HEADERS, example]
    .map((row) => row.map((value) => csvCell(String(value))).join(","))
    .join("\r\n");
}
