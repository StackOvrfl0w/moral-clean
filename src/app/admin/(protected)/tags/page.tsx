import { ConfirmActionButton } from "@/components/admin/ConfirmActionButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTag, deleteTag, updateTag } from "@/lib/actions/admin/tags";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminTagsPage() {
  await requireAdmin();
  const { data: tags, error } = await createClient()
    .from("tags")
    .select("id,name,slug")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-display font-bold text-primary">Tags</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create, rename, and remove product tags.</p>
      </div>

      <form action={createTag} className="flex max-w-xl items-end gap-2 rounded-md border bg-white p-4">
        <label className="flex-1 text-sm font-medium">
          New tag
          <Input name="name" required placeholder="e.g. Industrial" className="mt-2" />
        </label>
        <Button type="submit">Add Tag</Button>
      </form>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-muted/80 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Slug</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(tags ?? []).map((tag) => (
              <tr key={tag.id} className="border-t align-middle">
                <td className="px-3 py-3">
                  <form action={updateTag} className="flex max-w-sm gap-2">
                    <input type="hidden" name="id" value={tag.id} />
                    <Input name="name" defaultValue={tag.name} aria-label={`Name for ${tag.name}`} />
                    <Button type="submit" variant="outline">Save</Button>
                  </form>
                </td>
                <td className="px-3 py-3 text-muted-foreground">{tag.slug}</td>
                <td className="px-3 py-3">
                  <ConfirmActionButton
                    label="Delete"
                    message={`Delete the tag "${tag.name}"? Products using it will be untagged.`}
                    action={deleteTag}
                    values={{ id: tag.id }}
                  />
                </td>
              </tr>
            ))}
            {(tags ?? []).length === 0 ? (
              <tr><td colSpan={3} className="px-3 py-8 text-center text-muted-foreground">No tags yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}