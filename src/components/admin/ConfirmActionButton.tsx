"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type ConfirmActionButtonProps = {
  label: string;
  pendingLabel?: string;
  message: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  action: (formData: FormData) => Promise<void>;
  values: Record<string, string>;
};

export function ConfirmActionButton({
  label,
  pendingLabel = "Working...",
  message,
  variant = "destructive",
  action,
  values,
}: ConfirmActionButtonProps) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(message)) return;

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.set(key, value);
    });

    startTransition(async () => {
      try {
        await action(formData);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Action failed.");
      }
    });
  }

  return (
    <Button type="button" size="sm" variant={variant} onClick={handleClick} disabled={pending}>
      {pending ? pendingLabel : label}
    </Button>
  );
}
