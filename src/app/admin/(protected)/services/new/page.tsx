import { ServiceImageField } from "@/components/admin/ServiceImageField";
import { createService } from "@/lib/actions/admin/services";
import { requireAdmin } from "@/lib/auth";

export default async function AdminNewServicePage() {
  await requireAdmin();

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-bold text-primary">
        Add Service
      </h1>
      <form
        action={createService}
        className="space-y-4 rounded-lg border bg-white p-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-medium">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="short_description" className="text-sm font-medium">
            Short Description
          </label>
          <textarea
            id="short_description"
            name="short_description"
            rows={2}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="long_description" className="text-sm font-medium">
            Long Description
          </label>
          <textarea
            id="long_description"
            name="long_description"
            rows={6}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="icon_name" className="text-sm font-medium">
              Icon Name
            </label>
            <input
              id="icon_name"
              name="icon_name"
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              placeholder="wrench / settings / brush"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="sort_order" className="text-sm font-medium">
              Sort Order
            </label>
            <input
              id="sort_order"
              name="sort_order"
              type="number"
              defaultValue={0}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            />
          </div>
        </div>
        <ServiceImageField />
        <button
          type="submit"
          className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90"
        >
          Save Service
        </button>
      </form>
    </div>
  );
}
