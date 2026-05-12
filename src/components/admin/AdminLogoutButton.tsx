"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function AdminLogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
    setLoading(false);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={loading}
    >
      <LogOut className="size-4" aria-hidden="true" />
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
}
