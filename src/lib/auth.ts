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

/**
 * Same authorization check as requireAdmin(), but throws a plain Error
 * instead of calling redirect() on failure.
 *
 * Use this instead of requireAdmin() inside actions that get called many
 * times in a tight client-side loop (per CSV chunk, per uploaded image).
 * redirect() inside a server action throws Next's special NEXT_REDIRECT
 * signal, which the client runtime treats as a real navigation — not as a
 * catchable error. That means one transient auth hiccup on one call (a slow
 * token refresh, a momentary blip talking to the auth server) yanks the
 * whole browser tab to /admin/login and abandons an in-progress multi-step
 * import, even though the admin's session may still be perfectly valid.
 *
 * Callers of this function are responsible for deciding what a failure
 * means in their context (e.g. report a failed chunk and let the admin
 * retry, rather than losing the whole import).
 */
export async function requireAdminNoRedirect() {
  const user = await getServerUser();
  if (!user) {
    throw new Error(
      "Your session has expired. Refresh the page and sign in again.",
    );
  }

  const allowed = await isAdmin(user.id);
  if (!allowed) {
    throw new Error(
      "Your session has expired. Refresh the page and sign in again.",
    );
  }

  return user;
}
