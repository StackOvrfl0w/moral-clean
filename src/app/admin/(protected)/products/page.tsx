import Link from "next/link";
import Image from "next/image";

import { ConfirmActionButton } from "@/components/admin/ConfirmActionButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  deleteProduct,
  toggleFeatured,
  toggleInStock,
} from "@/lib/actions/admin/products";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type ProductsPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function getParam(searchParams: ProductsPageProps["searchParams"], key: string) {
  const value = searchParams?.[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminProductsPage({ searchParams }: ProductsPageProps) {
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

  let countQuery = supabase.from("products").select("*", { count: "exact", head: true });
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

  const [countResult, productsResult] = await Promise.all([countQuery, dataQuery]);
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

  const imageMap = new Map<string, { url: string; is_primary: boolean | null }[]>();
  for (const image of imagesResult.data ?? []) {
    if (!image.product_id) continue;
    const current = imageMap.get(image.product_id) ?? [];
    current.push({ url: image.url, is_primary: image.is_primary });
    imageMap.set(image.product_id, current);
  }
  const categoryMap = new Map((categoriesMapResult.data ?? []).map((category) => [category.id, category.name]));
  const totalCount = countResult.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-display font-bold text-primary">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>

      <form className="flex flex-wrap gap-3 rounded-md border bg-white p-4" method="get">
        <Input name="q" defaultValue={query} placeholder="Search by product name" className="max-w-sm" />
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

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-3">Image</th>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Brand</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">Featured</th>
              <th className="px-3 py-3">In Stock</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td className="px-3 py-8 text-center text-muted-foreground" colSpan={7}>
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const images = imageMap.get(product.id) ?? [];
                const primaryImage = images.find((image) => image.is_primary) ?? images[0];

                return (
                  <tr key={product.id} className="border-t hover:bg-muted/40">
                    <td className="px-3 py-3">
                      {primaryImage?.url ? (
                        <Image
                          src={primaryImage.url}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="rounded object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="size-12 rounded bg-muted" />
                      )}
                    </td>
                    <td className="px-3 py-3 font-medium text-primary">{product.name}</td>
                    <td className="px-3 py-3">{product.brand || "—"}</td>
                    <td className="px-3 py-3">{(product.category_id ? categoryMap.get(product.category_id) : null) || "—"}</td>
                    <td className="px-3 py-3">
                      <form action={toggleFeatured}>
                        <input type="hidden" name="productId" value={product.id} />
                        <input type="hidden" name="featured" value={String(!product.featured)} />
                        <Button type="submit" variant="outline" size="sm">
                          {product.featured ? "On" : "Off"}
                        </Button>
                      </form>
                    </td>
                    <td className="px-3 py-3">
                      <form action={toggleInStock}>
                        <input type="hidden" name="productId" value={product.id} />
                        <input type="hidden" name="inStock" value={String(!product.in_stock)} />
                        <Button type="submit" variant="outline" size="sm">
                          {product.in_stock ? "On" : "Off"}
                        </Button>
                      </form>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                        </Button>
                        <ConfirmActionButton
                          label="Delete"
                          message="Delete this product? This will also remove linked images and tags."
                          action={deleteProduct}
                          values={{ productId: product.id }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button asChild variant="outline" size="sm" disabled={page <= 1}>
          <Link href={`/admin/products?page=${Math.max(1, page - 1)}&q=${query}&category=${categoryFilter}`}>
            Previous
          </Link>
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNo) => (
          <Button key={pageNo} asChild={pageNo !== page} size="sm" variant={pageNo === page ? "default" : "outline"}>
            {pageNo === page ? (
              <span>{pageNo}</span>
            ) : (
              <Link href={`/admin/products?page=${pageNo}&q=${query}&category=${categoryFilter}`}>{pageNo}</Link>
            )}
          </Button>
        ))}
        <Button asChild variant="outline" size="sm" disabled={page >= totalPages}>
          <Link href={`/admin/products?page=${Math.min(totalPages, page + 1)}&q=${query}&category=${categoryFilter}`}>
            Next
          </Link>
        </Button>
      </div>
    </div>
  );
}
