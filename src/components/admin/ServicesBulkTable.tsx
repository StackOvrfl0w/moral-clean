"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { bulkDeleteServices, deleteService } from "@/lib/actions/admin/services";

type ServiceRow = { id: string; name: string; slug: string; icon_name: string | null; sort_order: number | null };

export function ServicesBulkTable({ services }: { services: ServiceRow[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const ids = useMemo(() => services.map((service) => service.id), [services]);
  const allSelected = ids.length > 0 && selected.size === ids.length;

  function toggleAll() { setSelected(allSelected ? new Set() : new Set(ids)); }
  function toggle(id: string) { setSelected((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; }); }
  function deleteSelected() {
    if (!selected.size || !window.confirm(`Permanently delete ${selected.size} service${selected.size === 1 ? "" : "s"}?`)) return;
    const formData = new FormData(); formData.set("ids", JSON.stringify(Array.from(selected)));
    startTransition(async () => { try { const result = await bulkDeleteServices(formData); setSelected(new Set()); toast.success(`Deleted ${result.deletedCount} service${result.deletedCount === 1 ? "" : "s"}.`); } catch (error) { toast.error(error instanceof Error ? error.message : "Bulk delete failed."); } });
  }

  return <div className="space-y-3">
    {selected.size > 0 ? <div className="flex items-center justify-between rounded-md border bg-muted/60 px-4 py-2"><span className="text-sm font-medium">{selected.size} selected</span><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setSelected(new Set())} disabled={pending}>Clear</Button><Button size="sm" variant="destructive" onClick={deleteSelected} disabled={pending}>{pending ? "Deleting..." : "Delete Selected"}</Button></div></div> : null}
    <div className="overflow-x-auto rounded-lg border bg-white"><table className="w-full text-left text-sm"><thead className="sticky top-0 bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-3 py-3"><input type="checkbox" checked={allSelected} ref={(element) => { if (element) element.indeterminate = selected.size > 0 && !allSelected; }} onChange={toggleAll} aria-label="Select all services" /></th><th className="px-3 py-3">Name</th><th className="px-3 py-3">Slug</th><th className="px-3 py-3">Icon</th><th className="px-3 py-3">Order</th><th className="px-3 py-3">Actions</th></tr></thead><tbody>
      {services.map((service) => <tr key={service.id} className="border-t hover:bg-muted/40"><td className="px-3 py-3"><input type="checkbox" checked={selected.has(service.id)} onChange={() => toggle(service.id)} aria-label={`Select ${service.name}`} /></td><td className="px-3 py-3 font-medium">{service.name}</td><td className="px-3 py-3 text-muted-foreground">{service.slug}</td><td className="px-3 py-3">{service.icon_name || "-"}</td><td className="px-3 py-3">{service.sort_order ?? 0}</td><td className="px-3 py-3"><div className="flex gap-2"><Button asChild size="sm" variant="outline"><Link href={`/admin/services/${service.id}/edit`}>Edit</Link></Button><Button size="sm" variant="destructive" disabled={pending} onClick={() => { if (!window.confirm("Delete this service?")) return; const formData = new FormData(); formData.set("id", service.id); startTransition(async () => { try { await deleteService(formData); setSelected((current) => { const next = new Set(current); next.delete(service.id); return next; }); toast.success("Service deleted."); } catch (error) { toast.error(error instanceof Error ? error.message : "Delete failed."); } }); }}>Delete</Button></div></td></tr>)}
      {services.length === 0 ? <tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">No services found.</td></tr> : null}
    </tbody></table></div>
  </div>;
}
