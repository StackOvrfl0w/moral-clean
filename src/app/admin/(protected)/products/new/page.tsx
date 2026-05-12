import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/actions/admin/products";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminNewProductPage() {
  await requireAdmin();
  const supabase = createClient();

  const [categoriesResult, tagsResult] = await Promise.all([
    supabase.from("categories").select("id,name").order("name", { ascending: true }),
    supabase.from("tags").select("name").order("name", { ascending: true }),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-display font-bold text-primary">Add Product</h1>
      <ProductForm
        mode="create"
        categories={categoriesResult.data ?? []}
        existingTags={(tagsResult.data ?? []).map((tag) => tag.name)}
        submitAction={createProduct}
      />
    </div>
  );
}
