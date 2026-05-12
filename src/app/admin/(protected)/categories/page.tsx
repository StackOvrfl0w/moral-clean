import Link from "next/link";

import { CategoryTable } from "@/components/admin/CategoryTable";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const supabase = createClient();

  const [categoriesResult, productsCountResult] = await Promise.all([
    supabase
      .from("categories")
      .select("id,name,slug,image_url,sort_order")
      .order("sort_order", { ascending: true }),
    supabase.from("products").select("id,category_id"),
  ]);

  const countMap = (productsCountResult.data ?? []).reduce<Record<string, number>>((acc, product) => {
    if (!product.category_id) return acc;
    acc[product.category_id] = (acc[product.category_id] ?? 0) + 1;
    return acc;
  }, {});

  const categories = (categoriesResult.data ?? []).map((category) => ({
    ...category,
    product_count: countMap[category.id] ?? 0,
  }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-primary">Categories</h1>
        <Button asChild>
          <Link href="/admin/categories/new">Add Category</Link>
        </Button>
      </div>
      <CategoryTable categories={categories} />
    </div>
  );
}
