import { SubmissionsInbox } from "@/components/admin/SubmissionsInbox";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const PAGE_SIZE = 50;

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  await requireAdmin();

  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = createClient();

  const { data, count } = await supabase
    .from("contact_submissions")
    .select("id,name,phone,email,message,created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-display font-bold text-primary">
        Contact Submissions
      </h1>
      <SubmissionsInbox
        submissions={data ?? []}
        page={page}
        totalPages={totalPages}
        totalCount={count ?? 0}
      />
    </div>
  );
}
