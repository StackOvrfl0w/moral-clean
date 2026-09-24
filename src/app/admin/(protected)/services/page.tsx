import Link from "next/link";

import { ServicesBulkTable } from "@/components/admin/ServicesBulkTable";
import { Button } from "@/components/ui/button";
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

      <ServicesBulkTable services={services ?? []} />
    </div>
  );
}
