"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, SendHorizontal } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

import {
  initialContactFormState,
  submitContactForm,
} from "@/lib/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const subjectOptions = [
  "Product Inquiry",
  "Service Request",
  "Parts & Replacement",
  "Quotation",
  "General Question",
] as const;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Sending...
        </>
      ) : (
        <>
          <SendHorizontal className="size-4" aria-hidden="true" />
          Send Message
        </>
      )}
    </Button>
  );
}

export function ContactForm({
  defaultSubject,
  defaultMessage,
}: {
  defaultSubject?: string;
  defaultMessage?: string;
}) {
  const initialSubject = useMemo(
    () =>
      subjectOptions.includes(defaultSubject as (typeof subjectOptions)[number])
        ? defaultSubject
        : "General Question",
    [defaultSubject],
  );
  const initialMessage = useMemo(() => defaultMessage ?? "", [defaultMessage]);
  const [state, formAction] = useFormState(submitContactForm, initialContactFormState);
  const [subject, setSubject] = useState(initialSubject);
  const [formKey, setFormKey] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (state.success) {
      setShowSuccess(true);
    }

    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error, state.success]);

  if (showSuccess) {
    return (
      <div className="rounded-lg border border-border bg-white p-8 shadow-sm">
        <div className="rounded-md border border-accent/30 bg-accent/5 p-6 text-center">
          <CheckCircle2 className="mx-auto size-12 text-accent" aria-hidden="true" />
          <h2 className="mt-4 text-2xl">Message Received</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            We&apos;ll respond within 2 business hours. For urgent service
            requests, please call +92 331 3195138.
          </p>
          <Button
            type="button"
            onClick={() => {
              setShowSuccess(false);
              setFormKey((value) => value + 1);
              setSubject(initialSubject);
            }}
            className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-white p-8 shadow-sm">
      <h2 className="text-2xl">Send Us a Message</h2>
      <form key={formKey} action={formAction} className="mt-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" required />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <input type="hidden" name="subject" value={subject} />
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger id="subject">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjectOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            required
            rows={4}
            defaultValue={initialMessage}
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
