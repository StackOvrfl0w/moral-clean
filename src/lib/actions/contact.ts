"use server";

import { Resend } from "resend";

import { env } from "@/config/env";
import { createClient } from "@/lib/supabase/server";
import type { ContactFormState, QuickQuoteFormState } from "./contact-types";

function normalizeValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sendEmail(payload: {
  from: string;
  to: string[];
  replyTo?: string;
  subject: string;
  text: string;
}) {
  const resend = new Resend(env.resendApiKey);
  const { data, error } = await resend.emails.send(payload);

  if (error) {
    console.error("[Resend] Failed to send email:", error);
  } else {
    console.log("[Resend] Email sent, id:");
  }
}

export async function submitQuickQuote(
  _prevState: QuickQuoteFormState,
  formData: FormData,
): Promise<QuickQuoteFormState> {
  const name = normalizeValue(formData.get("name"));
  const phone = normalizeValue(formData.get("phone"));
  const email = normalizeValue(formData.get("email"));
  const requirement = normalizeValue(formData.get("requirement"));
  const categorySlug = normalizeValue(formData.get("categorySlug"));
  const categoryName = normalizeValue(formData.get("categoryName"));

  if (!name || !phone || !requirement) {
    return {
      success: false,
      error: "Name, phone number, and product/requirement are required.",
    };
  }

  const supabase = createClient();
  const categoryContext = categoryName || categorySlug || "Unknown";
  const message = `[Category: ${categoryContext}]\n${requirement}`;
  const { error } = await supabase.from("contact_submissions").insert({
    name,
    phone,
    email: email || null,
    message,
  });
  // console.log("[Supabase] insert error:", error);
  if (error) {
    return {
      success: false,
      error: "Unable to send request right now. Please try again.",
    };
  }

  await sendEmail({
    from: `Moral Clean Website <${env.resendFromEmail}>`,
    to: [env.resendToEmail],
    subject: `New Quick Quote Request – ${categoryContext}`,
    text: [
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : null,
      `Category: ${categoryContext}`,
      ``,
      `Requirement:\n${requirement}`,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  return { success: true, error: null };
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = normalizeValue(formData.get("name"));
  const email = normalizeValue(formData.get("email"));
  const phone = normalizeValue(formData.get("phone"));
  const subject = normalizeValue(formData.get("subject"));
  const message = normalizeValue(formData.get("message"));

  if (!name || !email || !phone || !message) {
    return {
      success: false,
      error: "Please fill in all required fields.",
    };
  }

  if (!isValidEmail(email)) {
    return {
      success: false,
      error: "Please enter a valid email address.",
    };
  }

  const composedMessage = subject
    ? `[Subject: ${subject}]\n${message}`
    : message;
  const supabase = createClient();
  const { error } = await supabase.from("contact_submissions").insert({
    name,
    email,
    phone,
    message: composedMessage,
  });
  // console.log("[Supabase] insert error:", error);
  if (error) {
    return {
      success: false,
      error: "Unable to send your message right now. Please try again.",
    };
  }

  await sendEmail({
    from: `Moral Clean Website <${env.resendFromEmail}>`,
    to: [env.resendToEmail],
    replyTo: email,
    subject: subject
      ? `${subject} – ${name}`
      : `New Contact Form Submission – ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      subject ? `Subject: ${subject}` : null,
      ``,
      `Message:\n${message}`,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  return { success: true, error: null };
}
