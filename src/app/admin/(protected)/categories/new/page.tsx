import { createCategory } from "@/lib/actions/admin/categories";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export default async function AdminNewCategoryPage() {
  await requireAdmin();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-display font-bold text-primary">Add Category</h1>
      <form action={createCategory} className="space-y-4 rounded-lg border bg-white p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input
              id="name"
              name="name"
              required
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-medium">Slug</label>
            <input
              id="slug"
              name="slug"
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              placeholder={slugify("Category name")}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">Description</label>
          <textarea id="description" name="description" rows={4} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="image_url" className="text-sm font-medium">Image URL</label>
            <input id="image_url" name="image_url" className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
          </div>
          <div className="space-y-2">
            <label htmlFor="image_file" className="text-sm font-medium">Upload Image</label>
            <input id="image_file" name="image_file" type="file" accept="image/*" className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="sort_order" className="text-sm font-medium">Sort Order</label>
            <input id="sort_order" name="sort_order" type="number" defaultValue={0} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
          </div>
        </div>
        <button type="submit" className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90">
          Save Category
        </button>
      </form>
    </div>
  );
}
