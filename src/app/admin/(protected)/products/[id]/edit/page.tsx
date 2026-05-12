import Link from "next/link";

import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import { updateProduct } from "@/lib/actions/admin/products";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type EditProductPageProps = {
  params: {
    id: string;
  };
};

export default async function AdminEditProductPage({ params }: EditProductPageProps) {
  await requireAdmin();
  const supabase = createClient();

  const [productResult, categoriesResult, tagsResult] = await Promise.all([
    supabase
      .from("products")
      .select("id,name,slug,brand,model_code,category_id,short_description,long_description,specifications,featured,in_stock,sort_order,meta_title,meta_description")
      .eq("id", params.id)
      .maybeSingle(),
    supabase.from("categories").select("id,name").order("name", { ascending: true }),
    supabase.from("tags").select("name").order("name", { ascending: true }),
  ]);

  const product = productResult.data;
  if (!product) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold text-primary">Product not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">The requested product record does not exist.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/products">Go back</Link>
        </Button>
      </div>
    );
  }

  const specs =
    product.specifications && typeof product.specifications === "object" && !Array.isArray(product.specifications)
      ? (product.specifications as Record<string, string>)
      : {};

  const [imagesResult, productTagsResult] = await Promise.all([
    supabase
      .from("product_images")
      .select("id,url,alt_text,is_primary,sort_order")
      .eq("product_id", product.id)
      .order("sort_order", { ascending: true }),
    supabase.from("product_tags").select("tag_id").eq("product_id", product.id),
  ]);

  const tagIds = (productTagsResult.data ?? []).map((item) => item.tag_id);
  const tagNamesResult =
    tagIds.length > 0
      ? await supabase.from("tags").select("id,name").in("id", tagIds)
      : { data: [] as Array<{ id: string; name: string }> };
  const tagNameMap = new Map((tagNamesResult.data ?? []).map((tag) => [tag.id, tag.name]));

  const initialData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: product.brand || "",
    model_code: product.model_code || "",
    category_id: product.category_id || "",
    short_description: product.short_description || "",
    long_description: product.long_description || "<p></p>",
    specifications: specs,
    tags: (productTagsResult.data ?? [])
      .map((productTag) => tagNameMap.get(productTag.tag_id))
      .filter((name): name is string => Boolean(name)),
    featured: Boolean(product.featured),
    in_stock: product.in_stock !== false,
    sort_order: product.sort_order ?? 0,
    meta_title: product.meta_title || "",
    meta_description: product.meta_description || "",
    images: (imagesResult.data ?? []).map((image) => ({
      uid: image.id || image.url,
      url: image.url,
      alt_text: image.alt_text || "",
      is_primary: Boolean(image.is_primary),
    })),
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-display font-bold text-primary">Edit Product</h1>
      <ProductForm
        mode="edit"
        categories={categoriesResult.data ?? []}
        existingTags={(tagsResult.data ?? []).map((tag) => tag.name)}
        initialData={initialData}
        submitAction={updateProduct}
      />
    </div>
  );
}
