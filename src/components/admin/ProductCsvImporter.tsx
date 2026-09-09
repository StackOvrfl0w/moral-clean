"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  ImageIcon,
  Loader2,
  UploadCloud,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getImageKitAuthParams } from "@/lib/actions/admin/imagekit-auth";
import { importProductsCsv } from "@/lib/actions/admin/product-csv-import";
import {
  createProductCsvTemplate,
  MAX_PRODUCT_CSV_BYTES,
  MAX_PRODUCT_CSV_ROWS,
  MAX_PRODUCT_IMAGE_BYTES,
  MAX_PRODUCT_LOCAL_IMAGES,
  parseProductCsv,
  rewriteProductCsvImageRefs,
  type ParsedProductCsv,
  type ProductCsvImportResult,
} from "@/lib/product-csv";

type CategoryOption = {
  name: string;
  slug: string;
};

type ProductCsvImporterProps = {
  categories: CategoryOption[];
};

const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";

const columnRules = [
  ["name", "Required", "Product name shown on the website."],
  [
    "slug",
    "Optional",
    "Website URL name. Leave blank to generate it from the product name. Include it when updating an existing product.",
  ],
  [
    "category",
    "Optional",
    "Existing category name or slug. Missing categories can be created automatically if you enable that option.",
  ],
  ["brand", "Optional", "Brand/manufacturer name."],
  ["model_code", "Optional", "Model number or product code."],
  [
    "short_description",
    "Optional",
    "Short text used on product cards and summaries.",
  ],
  ["long_description", "Optional", "Full product description."],
  [
    "specifications",
    "Optional",
    "Use Label=Value|Label=Value, e.g. Power=1200 W|Tank=70 L. JSON objects are also accepted.",
  ],
  [
    "tags",
    "Optional",
    "Separate tags with |, e.g. vacuum|industrial|wet and dry.",
  ],
  [
    "featured",
    "Optional",
    "yes/no, true/false, or 1/0. Blank means no for new products.",
  ],
  [
    "in_stock",
    "Optional",
    "yes/no, true/false, or 1/0. Blank means yes for new products.",
  ],
  [
    "sort_order",
    "Optional",
    "Whole number. Smaller numbers appear first when sort order is used.",
  ],
  ["meta_title", "Optional", "SEO page title."],
  ["meta_description", "Optional", "SEO meta description."],
  [
    "primary_image",
    "Optional",
    "Exact attached image filename, or a ready-made ImageKit URL. Required when gallery_images is used.",
  ],
  [
    "primary_image_alt",
    "Optional",
    "Accessible description for the primary image. Product name is used when blank.",
  ],
  [
    "gallery_images",
    "Optional",
    "Additional attached image filenames or ImageKit URLs separated with |.",
  ],
  [
    "gallery_image_alts",
    "Optional",
    "Alt text for gallery images in the same order, separated with |. Missing values fall back to product name.",
  ],
];

function formatMb(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function ProductCsvImporter({ categories }: ProductCsvImporterProps) {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<ParsedProductCsv | null>(null);
  const [parseMessage, setParseMessage] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<"create" | "upsert">("create");
  const [createMissingCategories, setCreateMissingCategories] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [result, setResult] = useState<ProductCsvImportResult | null>(null);

  const categoryNames = useMemo(
    () =>
      new Set(
        categories.flatMap((category) => [
          category.name.toLowerCase(),
          category.slug.toLowerCase(),
        ]),
      ),
    [categories],
  );

  const localImageProblems = useMemo(() => {
    const problems: string[] = [];
    const seen = new Set<string>();

    if (imageFiles.length > MAX_PRODUCT_LOCAL_IMAGES) {
      problems.push(
        `Attach no more than ${MAX_PRODUCT_LOCAL_IMAGES} local images per import.`,
      );
    }

    for (const file of imageFiles) {
      const key = file.name.toLowerCase();
      if (seen.has(key))
        problems.push(`Duplicate local image filename: ${file.name}.`);
      seen.add(key);

      if (file.size > MAX_PRODUCT_IMAGE_BYTES) {
        problems.push(
          `${file.name} is ${formatMb(file.size)}; images must be ${formatMb(MAX_PRODUCT_IMAGE_BYTES)} or smaller.`,
        );
      }
      if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
        problems.push(`${file.name} is not JPG, PNG, WebP, or AVIF.`);
      }
    }

    return problems;
  }, [imageFiles]);

  const unknownCategories = useMemo(() => {
    if (!parsed || createMissingCategories) return [];
    return Array.from(
      new Set(
        parsed.rows
          .map((row) => row.values.category.trim())
          .filter(Boolean)
          .filter((category) => !categoryNames.has(category.toLowerCase())),
      ),
    );
  }, [parsed, createMissingCategories, categoryNames]);

  const imageCsvProblems = useMemo(() => {
    if (!parsed) return [];

    const problems: string[] = [];
    for (const row of parsed.rows) {
      const primaryImages = row.values.primary_image
        .split(/[|;]/)
        .map((value) => value.trim())
        .filter(Boolean);
      const galleryImages = row.values.gallery_images
        .split(/[|;]/)
        .map((value) => value.trim())
        .filter(Boolean);
      const galleryAlts = row.values.gallery_image_alts
        .split("|")
        .map((value) => value.trim())
        .filter(Boolean);

      if (primaryImages.length > 1) {
        problems.push(`Row ${row.line}: primary_image accepts only one image.`);
      }
      if (galleryImages.length > 0 && primaryImages.length === 0) {
        problems.push(
          `Row ${row.line}: add primary_image before gallery_images.`,
        );
      }
      if (row.values.primary_image_alt.trim() && primaryImages.length === 0) {
        problems.push(
          `Row ${row.line}: primary_image_alt needs a primary_image.`,
        );
      }
      if (galleryAlts.length > 0 && galleryImages.length === 0) {
        problems.push(
          `Row ${row.line}: gallery_image_alts needs gallery_images.`,
        );
      }
      if (galleryAlts.length > galleryImages.length) {
        problems.push(
          `Row ${row.line}: more gallery alt texts than gallery images.`,
        );
      }
    }

    return problems;
  }, [parsed]);

  async function handleCsvSelection(file: File | null) {
    setCsvFile(file);
    setParsed(null);
    setParseMessage(null);
    setResult(null);

    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setParseMessage("Select a .csv file.");
      return;
    }
    if (file.size > MAX_PRODUCT_CSV_BYTES) {
      setParseMessage("CSV file is too large. Maximum size is 1 MB.");
      return;
    }

    const nextParsed = parseProductCsv(await file.text());
    setParsed(nextParsed);
    if (nextParsed.rows.length > MAX_PRODUCT_CSV_ROWS) {
      setParseMessage(
        `Import up to ${MAX_PRODUCT_CSV_ROWS} product rows at a time.`,
      );
    }
  }

  function downloadTemplate() {
    const blob = new Blob([createProductCsvTemplate()], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "moral-clean-products-template.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  async function uploadFileToImageKit(file: File): Promise<string> {
    const auth = await getImageKitAuthParams();
    console.log("IMAGEKIT AUTH DEBUG:", auth);

    const form = new FormData();
    form.append("file", file);
    form.append("fileName", file.name);
    form.append("useUniqueFileName", "true");
    form.append("folder", "/products/csv");
    form.append("token", auth.token);
    form.append("expire", String(auth.expire));
    form.append("signature", auth.signature);
    form.append("publicKey", auth.publicKey);

    const response = await fetch(IMAGEKIT_UPLOAD_URL, {
      method: "POST",
      body: form,
    });

    if (!response.ok) {
      let detail = "";
      try {
        const body = (await response.json()) as { message?: string };
        detail = body.message ?? "";
      } catch {
        // response wasn't JSON; ignore
      }
      throw new Error(
        `Failed to upload "${file.name}" to ImageKit: ${detail || response.statusText}`,
      );
    }

    const data = (await response.json()) as { url?: string };
    if (!data.url) {
      throw new Error(
        `ImageKit returned an unexpected response for "${file.name}".`,
      );
    }
    return data.url;
  }

  async function runImport() {
    if (!csvFile || !parsed) return;
    if (
      parsed.errors.length > 0 ||
      parseMessage ||
      localImageProblems.length > 0
    )
      return;

    setSubmitting(true);
    setResult(null);
    setUploadStatus(null);

    try {
      const urlByFilename = new Map<string, string>();

      if (imageFiles.length > 0) {
        for (let index = 0; index < imageFiles.length; index += 1) {
          const file = imageFiles[index];
          setUploadStatus(
            `Uploading image ${index + 1} of ${imageFiles.length} to ImageKit…`,
          );
          const url = await uploadFileToImageKit(file);
          urlByFilename.set(file.name.trim().toLowerCase(), url);
        }
      }

      setUploadStatus(null);

      const rewrittenCsvText = rewriteProductCsvImageRefs(
        parsed.rows,
        urlByFilename,
      );
      const rewrittenCsvFile = new File([rewrittenCsvText], csvFile.name, {
        type: "text/csv",
      });

      const formData = new FormData();
      formData.append("csv", rewrittenCsvFile);
      formData.append("mode", mode);
      formData.append(
        "createMissingCategories",
        String(createMissingCategories),
      );
      const response = await importProductsCsv(formData);
      setResult(response);
    } catch (error) {
      setResult({
        success: false,
        created: 0,
        updated: 0,
        skipped: 0,
        errors: [],
        message:
          error instanceof Error
            ? `Import failed: ${error.message}`
            : "Import failed before completion. Check server logs and try again.",
      });
    } finally {
      setSubmitting(false);
      setUploadStatus(null);
    }
  }

  const canImport =
    Boolean(csvFile && parsed && parsed.rows.length > 0) &&
    !parseMessage &&
    (parsed?.errors.length ?? 0) === 0 &&
    localImageProblems.length === 0 &&
    unknownCategories.length === 0 &&
    imageCsvProblems.length === 0 &&
    !submitting;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>1. Download the template</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Keep the column names unchanged. Delete the example product before
              entering real products.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={downloadTemplate}>
            <Download className="size-4" />
            Download CSV Template
          </Button>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Image rules</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-md border border-accent/30 bg-accent/5 p-4">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <UploadCloud className="size-5" />
              Attach images, type the filename
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Put the exact attached filename in
              <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">
                primary_image
              </code>
              or{" "}
              <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">
                gallery_images
              </code>
              , then attach that file below. Your browser uploads it straight to
              ImageKit before the import runs — the file never touches our
              server or Supabase Storage.
            </p>
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              Formats: JPG, PNG, WebP, AVIF. Up to{" "}
              {formatMb(MAX_PRODUCT_IMAGE_BYTES)} each,{" "}
              {MAX_PRODUCT_LOCAL_IMAGES} files per batch.
            </p>
          </div>

          <div className="rounded-md border p-4">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <ImageIcon className="size-5" />
              Or paste a ready-made ImageKit URL
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Already have an image hosted on ImageKit? Paste its HTTPS URL
              directly into
              <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">
                primary_image
              </code>
              or{" "}
              <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">
                gallery_images
              </code>{" "}
              — no upload needed, it&apos;s used as-is.
            </p>
            <p className="mt-2 break-all rounded bg-muted p-2 font-mono text-xs text-primary">
              https://ik.imagekit.io/your_id/products/machine.webp
            </p>
          </div>

          <div className="lg:col-span-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
            <strong>Note:</strong> all product images are hosted on ImageKit,
            not Supabase Storage — this keeps your Supabase storage quota free
            regardless of which method you use above.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Accepted CSV columns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-3">Column</th>
                  <th className="px-3 py-3">Rule</th>
                  <th className="px-3 py-3">What to enter</th>
                </tr>
              </thead>
              <tbody>
                {columnRules.map(([column, rule, explanation]) => (
                  <tr key={column} className="border-t align-top">
                    <td className="px-3 py-3 font-mono text-xs font-semibold text-primary">
                      {column}
                    </td>
                    <td className="px-3 py-3 font-medium">{rule}</td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {explanation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
            <p>
              • CSV maximum: 1 MB and {MAX_PRODUCT_CSV_ROWS} product rows per
              import.
            </p>
            <p>
              • Multiple tags, specifications, gallery images, and gallery alt
              texts use the | separator.
            </p>
            <p>
              • Commas and line breaks are allowed inside properly quoted CSV
              cells.
            </p>
            <p>
              • Unknown extra columns are ignored, but shown as a warning before
              import.
            </p>
            <p>• Create-only mode skips products whose slug already exists.</p>
            <p>
              • Update mode matches by slug; blank optional cells preserve
              existing values.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Select CSV and optional local images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block rounded-md border border-dashed p-4">
              <span className="flex items-center gap-2 font-medium text-primary">
                <FileSpreadsheet className="size-5" /> Product CSV
              </span>
              <input
                type="file"
                accept=".csv,text/csv"
                className="mt-3 block w-full text-sm"
                onChange={(event) =>
                  handleCsvSelection(event.target.files?.[0] ?? null)
                }
              />
              <span className="mt-2 block text-xs text-muted-foreground">
                Maximum 1 MB.
              </span>
            </label>

            <label className="block rounded-md border border-dashed p-4">
              <span className="flex items-center gap-2 font-medium text-primary">
                <ImageIcon className="size-5" /> Local images (only if CSV uses
                filenames)
              </span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="mt-3 block w-full text-sm"
                onChange={(event) =>
                  setImageFiles(Array.from(event.target.files ?? []))
                }
              />
              <span className="mt-2 block text-xs text-muted-foreground">
                {formatMb(MAX_PRODUCT_IMAGE_BYTES)} maximum per image.
              </span>
            </label>
          </div>

          {parseMessage ? (
            <div className="flex gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />{" "}
              {parseMessage}
            </div>
          ) : null}

          {localImageProblems.length > 0 ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              <div className="mb-1 flex items-center gap-2 font-semibold">
                <AlertTriangle className="size-4" /> Fix local image problems
              </div>
              <ul className="list-disc space-y-1 pl-5">
                {localImageProblems.map((problem) => (
                  <li key={problem}>{problem}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {parsed ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="rounded bg-muted px-2 py-1">
                  {parsed.rows.length} product rows
                </span>
                <span className="rounded bg-muted px-2 py-1">
                  {imageFiles.length} local images attached
                </span>
              </div>

              {parsed.errors.length > 0 ? (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  <ul className="list-disc space-y-1 pl-5">
                    {parsed.errors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {parsed.unknownHeaders.length > 0 ? (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
                  Unknown columns will be ignored:{" "}
                  {parsed.unknownHeaders.join(", ")}.
                </div>
              ) : null}

              {unknownCategories.length > 0 ? (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
                  These categories do not exist: {unknownCategories.join(", ")}.
                  Create them first or enable “Create missing categories” below.
                </div>
              ) : null}

              {imageCsvProblems.length > 0 ? (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  <ul className="list-disc space-y-1 pl-5">
                    {imageCsvProblems.map((problem) => (
                      <li key={problem}>{problem}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="overflow-x-auto rounded-md border">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2">CSV row</th>
                      <th className="px-3 py-2">Product</th>
                      <th className="px-3 py-2">Category</th>
                      <th className="px-3 py-2">Brand</th>
                      <th className="px-3 py-2">Primary image</th>
                      <th className="px-3 py-2">Gallery</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.rows.slice(0, 10).map((row) => (
                      <tr key={row.line} className="border-t">
                        <td className="px-3 py-2">{row.line}</td>
                        <td className="px-3 py-2 font-medium text-primary">
                          {row.values.name || "—"}
                        </td>
                        <td className="px-3 py-2">
                          {row.values.category || "—"}
                        </td>
                        <td className="px-3 py-2">{row.values.brand || "—"}</td>
                        <td
                          className="max-w-[260px] truncate px-3 py-2"
                          title={row.values.primary_image}
                        >
                          {row.values.primary_image || "—"}
                        </td>
                        <td className="px-3 py-2">
                          {row.values.gallery_images
                            ? `${row.values.gallery_images.split("|").filter(Boolean).length} image(s)`
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsed.rows.length > 10 ? (
                <p className="text-xs text-muted-foreground">
                  Preview shows the first 10 rows only.
                </p>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. Import options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <label
              className={`cursor-pointer rounded-md border p-4 ${mode === "create" ? "border-accent bg-accent/5" : ""}`}
            >
              <input
                type="radio"
                name="import-mode"
                value="create"
                checked={mode === "create"}
                onChange={() => setMode("create")}
                className="mr-2"
              />
              <span className="font-semibold text-primary">
                Create new products only
              </span>
              <p className="mt-1 text-sm text-muted-foreground">
                Safest option. Existing slugs are skipped instead of changed.
              </p>
            </label>
            <label
              className={`cursor-pointer rounded-md border p-4 ${mode === "upsert" ? "border-accent bg-accent/5" : ""}`}
            >
              <input
                type="radio"
                name="import-mode"
                value="upsert"
                checked={mode === "upsert"}
                onChange={() => setMode("upsert")}
                className="mr-2"
              />
              <span className="font-semibold text-primary">
                Create or update by slug
              </span>
              <p className="mt-1 text-sm text-muted-foreground">
                Existing products with the same slug are updated. Blank optional
                cells keep their current value.
              </p>
            </label>
          </div>

          <label className="flex items-start gap-3 rounded-md border p-4">
            <input
              type="checkbox"
              checked={createMissingCategories}
              onChange={(event) =>
                setCreateMissingCategories(event.target.checked)
              }
              className="mt-1"
            />
            <span>
              <span className="font-semibold text-primary">
                Create missing categories automatically
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                A category not already in the admin will be created using the
                CSV category text. Leave this off if you want typos to stop the
                affected rows.
              </span>
            </span>
          </label>

          <div className="flex flex-col gap-2">
            <Button
              type="button"
              size="lg"
              onClick={runImport}
              disabled={!canImport}
              className="w-fit"
            >
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <UploadCloud className="size-4" />
              )}
              {submitting
                ? (uploadStatus ?? "Importing Products…")
                : "Import Products"}
            </Button>
            {submitting && imageFiles.length > 0 ? (
              <p className="text-xs text-muted-foreground">
                Images upload directly to ImageKit from your browser before the
                product rows are saved.
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {result ? (
        <Card
          className={
            result.errors.length === 0 && result.created + result.updated > 0
              ? "border-emerald-300"
              : "border-amber-300"
          }
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.errors.length === 0 &&
              result.created + result.updated > 0 ? (
                <CheckCircle2 className="size-5 text-emerald-600" />
              ) : (
                <AlertTriangle className="size-5 text-amber-600" />
              )}
              Import result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">{result.message}</p>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="rounded bg-emerald-50 px-2 py-1 text-emerald-800">
                Created: {result.created}
              </span>
              <span className="rounded bg-sky-50 px-2 py-1 text-sky-800">
                Updated: {result.updated}
              </span>
              <span className="rounded bg-muted px-2 py-1">
                Skipped: {result.skipped}
              </span>
              <span className="rounded bg-amber-50 px-2 py-1 text-amber-800">
                Errors: {result.errors.length}
              </span>
            </div>

            {result.errors.length > 0 ? (
              <div className="overflow-x-auto rounded-md border">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2">CSV row</th>
                      <th className="px-3 py-2">Product</th>
                      <th className="px-3 py-2">Problem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.errors.map((error, index) => (
                      <tr
                        key={`${error.row}-${error.product}-${index}`}
                        className="border-t align-top"
                      >
                        <td className="px-3 py-2">{error.row}</td>
                        <td className="px-3 py-2 font-medium">
                          {error.product}
                        </td>
                        <td className="px-3 py-2 text-destructive">
                          {error.message}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
