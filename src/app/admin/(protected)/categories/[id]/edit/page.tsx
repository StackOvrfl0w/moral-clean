import Link from "next/link";

import { Button } from "@/components/ui/button";
import { updateCategory } from "@/lib/actions/admin/categories";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type EditCategoryPageProps = {
  params: { id: string };
};

export default async function AdminEditCategoryPage({ params }: EditCategoryPageProps) {
  await requireAdmin();
  const supabase = createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("id,name,slug,description,image_url,sort_order")
    .eq("id", params.id)
    .maybeSingle();

  if (!category) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold text-primary">Category not found</h1>
        <Button asChild className="mt-4">
          <Link href="/admin/categories">Go back</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-display font-bold text-primary">Edit Category</h1>
      <form action={updateCategory} className="space-y-4 rounded-lg border bg-white p-6">
        <input type="hidden" name="id" value={category.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input id="name" name="name" defaultValue={category.name} required className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
          </div>
          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-medium">Slug</label>
            <input id="slug" name="slug" defaultValue={category.slug} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">Description</label>
          <textarea id="description" name="description" rows={4} defaultValue={category.description ?? ""} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="image_url" className="text-sm font-medium">Image URL</label>
            <input id="image_url" name="image_url" defaultValue={category.image_url ?? ""} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
          </div>
          <div className="space-y-2">
            <label htmlFor="image_file" className="text-sm font-medium">Upload Image</label>
            <input id="image_file" name="image_file" type="file" accept="image/*" className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="sort_order" className="text-sm font-medium">Sort Order</label>
            <input id="sort_order" name="sort_order" type="number" defaultValue={category.sort_order ?? 0} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90">
            Update Category
          </button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/categories">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
