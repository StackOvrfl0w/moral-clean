import Link from "next/link";

import { ServiceImageField } from "@/components/admin/ServiceImageField";
import { Button } from "@/components/ui/button";
import { updateService } from "@/lib/actions/admin/services";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type EditServicePageProps = {
  params: { id: string };
};

export default async function AdminEditServicePage({ params }: EditServicePageProps) {
  await requireAdmin();
  const supabase = createClient();
  const { data: service } = await supabase
    .from("services")
    .select("id,name,slug,short_description,long_description,icon_name,image_url,sort_order")
    .eq("id", params.id)
    .maybeSingle();

  if (!service) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold text-primary">Service not found</h1>
        <Button asChild className="mt-4">
          <Link href="/admin/services">Go back</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-bold text-primary">Edit Service</h1>
      <form action={updateService} className="space-y-4 rounded-lg border bg-white p-6">
        <input type="hidden" name="id" value={service.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input id="name" name="name" defaultValue={service.name} required className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
          </div>
          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-medium">Slug</label>
            <input id="slug" name="slug" defaultValue={service.slug} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="short_description" className="text-sm font-medium">Short Description</label>
          <textarea id="short_description" name="short_description" rows={2} defaultValue={service.short_description ?? ""} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div className="space-y-2">
          <label htmlFor="long_description" className="text-sm font-medium">Long Description</label>
          <textarea id="long_description" name="long_description" rows={6} defaultValue={service.long_description ?? ""} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="icon_name" className="text-sm font-medium">Icon Name</label>
            <input id="icon_name" name="icon_name" defaultValue={service.icon_name ?? ""} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" placeholder="wrench / settings / brush" />
          </div>
          <div className="space-y-2">
            <label htmlFor="sort_order" className="text-sm font-medium">Sort Order</label>
            <input id="sort_order" name="sort_order" type="number" defaultValue={service.sort_order ?? 0} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" />
          </div>
        </div>
        <ServiceImageField defaultValue={service.image_url ?? ""} />
        <div className="flex gap-3">
          <button type="submit" className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90">
            Update Service
          </button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/services">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
