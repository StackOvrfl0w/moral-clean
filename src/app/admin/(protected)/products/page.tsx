import Link from "next/link";

import { ProductBulkTable } from "@/components/admin/ProductBulkTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type ProductsPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function getParam(
  searchParams: ProductsPageProps["searchParams"],
  key: string,
) {
  const value = searchParams?.[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminProductsPage({
  searchParams,
}: ProductsPageProps) {
  await requireAdmin();
  const supabase = createClient();

  const query = getParam(searchParams, "q") ?? "";
  const categoryFilter = getParam(searchParams, "category") ?? "";
  const page = Math.max(1, Number(getParam(searchParams, "page") ?? 1));
  const pageSize = 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const categoriesResult = await supabase
    .from("categories")
    .select("id,name")
    .order("name", { ascending: true });

  let countQuery = supabase
    .from("products")
    .select("*", { count: "exact", head: true });
  let dataQuery = supabase
    .from("products")
    .select("id,name,slug,brand,featured,in_stock,category_id")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (query) {
    countQuery = countQuery.ilike("name", `%${query}%`);
    dataQuery = dataQuery.ilike("name", `%${query}%`);
  }
  if (categoryFilter) {
    countQuery = countQuery.eq("category_id", categoryFilter);
    dataQuery = dataQuery.eq("category_id", categoryFilter);
  }

  const [countResult, productsResult] = await Promise.all([
    countQuery,
    dataQuery,
  ]);
  const products = productsResult.data ?? [];

  const [imagesResult, categoriesMapResult] = await Promise.all([
    products.length > 0
      ? supabase
          .from("product_images")
          .select("product_id,url,is_primary,sort_order")
          .in(
            "product_id",
            products.map((product) => product.id),
          )
          .order("sort_order", { ascending: true })
      : Promise.resolve({
          data: [] as Array<{
            product_id: string | null;
            url: string;
            is_primary: boolean | null;
            sort_order: number | null;
          }>,
        }),
    supabase.from("categories").select("id,name"),
  ]);

  const imageMap = new Map<
    string,
    { url: string; is_primary: boolean | null }[]
  >();
  for (const image of imagesResult.data ?? []) {
    if (!image.product_id) continue;
    const current = imageMap.get(image.product_id) ?? [];
    current.push({ url: image.url, is_primary: image.is_primary });
    imageMap.set(image.product_id, current);
  }
  const categoryMap = new Map(
    (categoriesMapResult.data ?? []).map((category) => [
      category.id,
      category.name,
    ]),
  );
  const totalCount = countResult.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const tableRows = products.map((product) => {
    const images = imageMap.get(product.id) ?? [];
    const primaryImage = images.find((image) => image.is_primary) ?? images[0];
    return {
      id: product.id,
      name: product.name,
      brand: product.brand,
      featured: product.featured,
      in_stock: product.in_stock,
      categoryName:
        (product.category_id ? categoryMap.get(product.category_id) : null) ??
        null,
      primaryImageUrl: primaryImage?.url ?? null,
    };
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-display font-bold text-primary">
          Products
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/products/import">Import CSV</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/products/new">Add Product</Link>
          </Button>
        </div>
      </div>

      <form
        className="flex flex-wrap gap-3 rounded-md border bg-white p-4"
        method="get"
      >
        <Input
          name="q"
          defaultValue={query}
          placeholder="Search by product name"
          className="max-w-sm"
        />
        <select
          name="category"
          defaultValue={categoryFilter}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">All categories</option>
          {(categoriesResult.data ?? []).map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <Button type="submit" variant="outline">
          Filter
        </Button>
      </form>

      <ProductBulkTable products={tableRows} />

      <div className="flex items-center justify-center gap-2">
        <Button asChild variant="outline" size="sm" disabled={page <= 1}>
          <Link
            href={`/admin/products?page=${Math.max(1, page - 1)}&q=${query}&category=${categoryFilter}`}
          >
            Previous
          </Link>
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNo) => (
          <Button
            key={pageNo}
            asChild={pageNo !== page}
            size="sm"
            variant={pageNo === page ? "default" : "outline"}
          >
            {pageNo === page ? (
              <span>{pageNo}</span>
            ) : (
              <Link
                href={`/admin/products?page=${pageNo}&q=${query}&category=${categoryFilter}`}
              >
                {pageNo}
              </Link>
            )}
          </Button>
        ))}
        <Button
          asChild
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
        >
          <Link
            href={`/admin/products?page=${Math.min(totalPages, page + 1)}&q=${query}&category=${categoryFilter}`}
          >
            Next
          </Link>
        </Button>
      </div>
    </div>
  );
}
