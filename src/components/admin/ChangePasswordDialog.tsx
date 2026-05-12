"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function ChangePasswordDialog() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  async function handleChangePassword() {
    if (!password.trim()) {
      toast.error("Password is required.");
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setPending(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password updated.");
    setPassword("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Change Password</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Update your admin account password.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <Button type="button" onClick={handleChangePassword} disabled={pending}>
          {pending ? "Updating..." : "Save Password"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
