"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Headset, SendHorizontal } from "lucide-react";
import { toast } from "sonner";

import {
  initialQuickQuoteFormState,
  submitQuickQuote,
} from "@/lib/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-white text-primary hover:bg-white/90"
    >
      <SendHorizontal className="size-4" aria-hidden="true" />
      {pending ? "Sending..." : "Send Request"}
    </Button>
  );
}

export function QuickQuoteForm({
  categorySlug,
  categoryName,
}: {
  categorySlug: string;
  categoryName: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(
    submitQuickQuote,
    initialQuickQuoteFormState,
  );

  useEffect(() => {
    if (state.success) {
      toast.success("Request sent. We'll respond within 2 business hours.");
      formRef.current?.reset();
      return;
    }

    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <section className="rounded-md bg-primary p-6 text-primary-foreground shadow-lg">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 rounded-md bg-white/15 p-2">
          <Headset className="size-4 text-accent" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-lg font-bold text-white">Quick Quote</h3>
          <p className="mt-1 text-sm text-white/75">
            We respond within 2 business hours.
          </p>
        </div>
      </div>

      <form ref={formRef} action={formAction} className="mt-5 space-y-3">
        <input type="hidden" name="categorySlug" value={categorySlug} />
        <input type="hidden" name="categoryName" value={categoryName} />

        <Input
          name="name"
          required
          placeholder="Name"
          className="border-white/30 bg-white/5 text-white placeholder:text-white/60"
        />
        <Input
          name="phone"
          required
          placeholder="Phone Number"
          className="border-white/30 bg-white/5 text-white placeholder:text-white/60"
        />
        <Input
          name="email"
          type="email"
          placeholder="Email Address"
          className="border-white/30 bg-white/5 text-white placeholder:text-white/60"
        />
        <Textarea
          name="requirement"
          required
          placeholder="Product / Requirement"
          className="min-h-[110px] border-white/30 bg-white/5 text-white placeholder:text-white/60"
        />

        <SubmitButton />
      </form>
    </section>
  );
}
