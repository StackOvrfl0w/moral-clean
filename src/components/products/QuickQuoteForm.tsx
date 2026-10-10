"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Headset, SendHorizontal } from "lucide-react";
import { toast } from "sonner";

import { trackInquiry } from "@/lib/analytics";
import { initialQuickQuoteFormState } from "@/lib/actions/contact-types";
import { submitQuickQuote } from "@/lib/actions/contact";
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

  const measuredState = useRef<typeof state>();
  useEffect(() => {
    if (state.recorded && measuredState.current !== state) {
      measuredState.current = state;
      trackInquiry("inquiry_submitted", { form_type: "quick_quote", category_slug: categorySlug });
    }
    if (state.success) {
      toast.success("Request received. Our team will review your requirements.");
      formRef.current?.reset();
      return;
    }

    if (state.error) {
      toast.error(state.error);
    }
  }, [state, categorySlug]);

  return (
    <section className="rounded-md bg-primary p-6 text-primary-foreground shadow-lg">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 rounded-md bg-white/15 p-2">
          <Headset className="size-4 text-accent" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-lg font-bold text-white">Quick Quote</h3>
          <p className="mt-1 text-sm text-white/75">
            Share the equipment and cleaning task you need help with.
          </p>
        </div>
      </div>

      <form ref={formRef} action={formAction} className="mt-5 space-y-3">
        <input type="hidden" name="categorySlug" value={categorySlug} />
        <input type="hidden" name="categoryName" value={categoryName} />
        <input
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px overflow-hidden"
        />

        <Input
          aria-label="Name"
          name="name"
          required
          placeholder="Name"
          className="border-white/30 bg-white/5 text-white placeholder:text-white/60"
        />
        <Input
          aria-label="Phone number"
          name="phone"
          required
          placeholder="Phone Number"
          className="border-white/30 bg-white/5 text-white placeholder:text-white/60"
        />
        <Input
          aria-label="Email address"
          name="email"
          type="email"
          placeholder="Email Address"
          className="border-white/30 bg-white/5 text-white placeholder:text-white/60"
        />
        <Textarea
          aria-label="Product or requirement"
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
