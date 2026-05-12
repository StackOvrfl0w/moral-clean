"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterStrip() {
  const [email, setEmail] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter an email address.");
      return;
    }

    // TODO: Replace this local acknowledgement with real newsletter integration.
    toast.success("Thanks for subscribing");
    setEmail("");
  }

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-accent p-8 text-accent-foreground">
          <h2 className="text-center text-primary">
            Get Cleaning Industry Insights in Your Inbox
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-primary/80">
            Receive practical updates on equipment selection, maintenance
            planning, and cleaning operations.
          </p>
          <form
            onSubmit={onSubmit}
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email address"
              className="border-primary/25 bg-white text-primary placeholder:text-primary/55"
            />
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
