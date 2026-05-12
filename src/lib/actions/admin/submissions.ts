"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function deleteSubmission(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Submission ID required.");

  const supabase = createClient();
  const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/submissions");
}
