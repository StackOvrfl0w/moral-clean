import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function getServerUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export async function isAdmin(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", userId)
    .maybeSingle();
    
  if (error) {
    return false;
  }

  return Boolean(data);
}

export async function requireAdmin() {
  const user = await getServerUser();

  if (!user) {
    redirect("/admin/login");
  }

  const allowed = await isAdmin(user.id);

  if (!allowed) {
    redirect("/admin/login");
  }

  return user;
}
