import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProductCsvImporter } from "@/components/admin/ProductCsvImporter";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function ProductCsvImportPage() {
  await requireAdmin();
  const supabase = createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("name,slug")
    .order("name", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">
            Import Products from CSV
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Bulk-create products without editing them one by one. Download the template,
            follow the rules below, preview the file, and import only after the rows look correct.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/products">
            <ArrowLeft className="size-4" /> Back to Products
          </Link>
        </Button>
      </div>

      <ProductCsvImporter categories={categories ?? []} />
    </div>
  );
}
