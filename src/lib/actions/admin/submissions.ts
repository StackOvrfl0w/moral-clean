"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export type SubmissionActionResult =
  | { success: true; deletedCount: number }
  | { success: false; error: string };

export async function deleteSubmission(
  formData: FormData,
): Promise<SubmissionActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return { success: false, error: "A valid submission ID is required." };
  }

  const supabase = createAdminClient();
  const { error, count } = await supabase
    .from("contact_submissions")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  if (count !== 1) {
    return {
      success: false,
      error: "Submission was not found or was already deleted.",
    };
  }

  revalidatePath("/admin/submissions");
  return { success: true, deletedCount: 1 };
}

export async function bulkDeleteSubmissions(
  formData: FormData,
): Promise<SubmissionActionResult> {
  await requireAdmin();
  let submittedIds: unknown;
  try {
    submittedIds = JSON.parse(String(formData.get("ids") ?? "[]"));
  } catch {
    return { success: false, error: "Invalid submission selection." };
  }

  if (!Array.isArray(submittedIds)) {
    return { success: false, error: "Invalid submission selection." };
  }

  const ids = Array.from(
    new Set(
      submittedIds.filter(
        (id): id is string =>
          typeof id === "string" && /^[0-9a-f-]{36}$/i.test(id),
      ),
    ),
  );
  if (ids.length === 0) {
    return { success: false, error: "No submissions selected." };
  }

  const supabase = createAdminClient();
  const { error, count } = await supabase
    .from("contact_submissions")
    .delete({ count: "exact" })
    .in("id", ids);
  if (error) return { success: false, error: error.message };
  if ((count ?? 0) !== ids.length) {
    return {
      success: false,
      error: `Only ${count ?? 0} of ${ids.length} submissions were deleted. Refresh the page and try again.`,
    };
  }

  revalidatePath("/admin/submissions");
  return { success: true, deletedCount: count ?? 0 };
}
