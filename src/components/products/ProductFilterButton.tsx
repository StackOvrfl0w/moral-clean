"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductFilterButton({
  href,
  checked,
  children,
}: {
  href: string;
  checked: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      aria-pressed={checked}
      aria-busy={isPending}
      disabled={isPending}
      onClick={() => startTransition(() => router.push(href, { scroll: false }))}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60",
        checked && "bg-accent/10 text-primary",
      )}
    >
      <span
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded border border-border",
          checked && "border-accent bg-accent text-accent-foreground",
        )}
        aria-hidden="true"
      >
        {checked ? <Check className="size-3" /> : null}
      </span>
      {children}
    </button>
  );
}
