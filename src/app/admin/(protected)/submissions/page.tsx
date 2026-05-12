import { SubmissionsInbox } from "@/components/admin/SubmissionsInbox";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminSubmissionsPage() {
  await requireAdmin();
  const supabase = createClient();
  const { data } = await supabase
    .from("contact_submissions")
    .select("id,name,phone,email,message,created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-display font-bold text-primary">Contact Submissions</h1>
      <SubmissionsInbox submissions={data ?? []} />
    </div>
  );
}
