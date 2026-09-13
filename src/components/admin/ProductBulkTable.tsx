"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  bulkDeleteProducts,
  deleteProduct,
  toggleFeatured,
  toggleInStock,
} from "@/lib/actions/admin/products";

type ProductRow = {
  id: string;
  name: string;
  brand: string | null;
  featured: boolean | null;
  in_stock: boolean | null;
  categoryName: string | null;
  primaryImageUrl: string | null;
};

type ProductBulkTableProps = {
  products: ProductRow[];
};

export function ProductBulkTable({ products }: ProductBulkTableProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const allSelected = products.length > 0 && selected.size === products.length;
  const someSelected = selected.size > 0 && !allSelected;

  const selectedCount = selected.size;

  const productIds = useMemo(() => products.map((p) => p.id), [products]);

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => {
      if (prev.size === productIds.length) return new Set();
      return new Set(productIds);
    });
  }

  function handleBulkDelete() {
    if (selectedCount === 0) return;
    const confirmed = window.confirm(
      `Delete ${selectedCount} product${selectedCount === 1 ? "" : "s"}? ` +
        `This permanently removes them from the database, along with their images, ` +
        `tags, and uploaded image files. This cannot be undone.`,
    );
    if (!confirmed) return;

    const formData = new FormData();
    formData.set("productIds", JSON.stringify(Array.from(selected)));

    startTransition(async () => {
      try {
        const result = await bulkDeleteProducts(formData);
        toast.success(
          `Deleted ${result.deletedCount} product${result.deletedCount === 1 ? "" : "s"}.`,
        );
        setSelected(new Set());
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Bulk delete failed.",
        );
      }
    });
  }

  function handleSingleDelete(productId: string) {
    const formData = new FormData();
    formData.set("productId", productId);
    startTransition(async () => {
      try {
        await deleteProduct(formData);
        setSelected((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Delete failed.");
      }
    });
  }

  return (
    <div className="space-y-3">
      {selectedCount > 0 && (
        <div className="flex items-center justify-between rounded-md border bg-muted/60 px-4 py-2">
          <span className="text-sm font-medium">
            {selectedCount} product{selectedCount === 1 ? "" : "s"} selected
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelected(new Set())}
              disabled={isPending}
            >
              Clear
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete Selected"}
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={toggleAll}
                  aria-label="Select all products"
                />
              </th>
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
                <td
                  className="px-3 py-8 text-center text-muted-foreground"
                  colSpan={8}
                >
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className={`border-t hover:bg-muted/40 ${selected.has(product.id) ? "bg-muted/30" : ""}`}
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(product.id)}
                      onChange={() => toggleOne(product.id)}
                      aria-label={`Select ${product.name}`}
                    />
                  </td>
                  <td className="px-3 py-3">
                    {product.primaryImageUrl ? (
                      <Image
                        src={product.primaryImageUrl}
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
                  <td className="px-3 py-3 font-medium text-primary">
                    {product.name}
                  </td>
                  <td className="px-3 py-3">{product.brand || "—"}</td>
                  <td className="px-3 py-3">{product.categoryName || "—"}</td>
                  <td className="px-3 py-3">
                    <form action={toggleFeatured}>
                      <input
                        type="hidden"
                        name="productId"
                        value={product.id}
                      />
                      <input
                        type="hidden"
                        name="featured"
                        value={String(!product.featured)}
                      />
                      <Button type="submit" variant="outline" size="sm">
                        {product.featured ? "On" : "Off"}
                      </Button>
                    </form>
                  </td>
                  <td className="px-3 py-3">
                    <form action={toggleInStock}>
                      <input
                        type="hidden"
                        name="productId"
                        value={product.id}
                      />
                      <input
                        type="hidden"
                        name="inStock"
                        value={String(!product.in_stock)}
                      />
                      <Button type="submit" variant="outline" size="sm">
                        {product.in_stock ? "On" : "Off"}
                      </Button>
                    </form>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          Edit
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isPending}
                        onClick={() => {
                          if (
                            window.confirm(
                              "Delete this product? This will also remove linked images and tags.",
                            )
                          ) {
                            handleSingleDelete(product.id);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
