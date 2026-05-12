import Link from "next/link";

import { ConfirmActionButton } from "@/components/admin/ConfirmActionButton";
import { Button } from "@/components/ui/button";
import { deleteService } from "@/lib/actions/admin/services";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminServicesPage() {
  await requireAdmin();
  const supabase = createClient();
  const { data: services } = await supabase
    .from("services")
    .select("id,name,slug,icon_name,sort_order")
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-primary">Services</h1>
        <Button asChild>
          <Link href="/admin/services/new">Add Service</Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Slug</th>
              <th className="px-3 py-3">Icon</th>
              <th className="px-3 py-3">Order</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(services ?? []).map((service) => (
              <tr key={service.id} className="border-t hover:bg-muted/40">
                <td className="px-3 py-3 font-medium">{service.name}</td>
                <td className="px-3 py-3 text-muted-foreground">{service.slug}</td>
                <td className="px-3 py-3">{service.icon_name || "—"}</td>
                <td className="px-3 py-3">{service.sort_order ?? 0}</td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/services/${service.id}/edit`}>Edit</Link>
                    </Button>
                    <ConfirmActionButton
                      label="Delete"
                      message="Delete this service?"
                      action={deleteService}
                      values={{ id: service.id }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
