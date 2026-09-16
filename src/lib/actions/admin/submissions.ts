"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function deleteSubmission(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Submission ID required.");

  const supabase = createClient();
  const { error, count } = await supabase
    .from("contact_submissions")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) throw new Error(error.message);
  if (count !== 1) throw new Error("Submission was not found or was not deleted.");

  revalidatePath("/admin/submissions");
}

export async function bulkDeleteSubmissions(formData: FormData) {
  await requireAdmin();
  let ids: string[];
  try {
    ids = JSON.parse(String(formData.get("ids") ?? "[]")) as string[];
  } catch {
    throw new Error("Invalid submission selection.");
  }

  ids = Array.from(new Set(ids.filter((id) => /^[0-9a-f-]{36}$/i.test(id))));
  if (ids.length === 0) throw new Error("No submissions selected.");

  const supabase = createClient();
  const { error, count } = await supabase
    .from("contact_submissions")
    .delete({ count: "exact" })
    .in("id", ids);
  if (error) throw new Error(error.message);
  if ((count ?? 0) !== ids.length) {
    throw new Error(`Only ${count ?? 0} of ${ids.length} submissions were deleted.`);
  }

  revalidatePath("/admin/submissions");
  return { deletedCount: count ?? 0 };
}
