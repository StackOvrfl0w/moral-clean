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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildNotificationHtml(params: {
  heading: string;
  rows: { label: string; value: string }[];
  messageLabel: string;
  messageValue: string;
}) {
  const { heading, rows, messageLabel, messageValue } = params;

  const rowsHtml = rows
    .map(
      (r) => `
        <tr>
          <td style="padding:6px 0; font-size:14px; color:#555555; width:140px; vertical-align:top;">${escapeHtml(r.label)}</td>
          <td style="padding:6px 0; font-size:14px; color:#111111;">${escapeHtml(r.value)}</td>
        </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family: Arial, Helvetica, sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding: 32px 0;">
  <tr>
    <td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e5e5;">
        <tr>
          <td style="background-color:#01122e; padding: 24px 32px;">
            <span style="color:#ffffff; font-size: 18px; font-weight: bold;">Moral Clean</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 32px;">
            <h2 style="margin:0 0 20px 0; font-size:18px; color:#01122e;">${escapeHtml(heading)}</h2>
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              ${rowsHtml}
            </table>
            <div style="margin-top:20px; padding-top:16px; border-top:1px solid #e5e5e5;">
              <p style="margin:0 0 6px 0; font-size:14px; color:#555555;">${escapeHtml(messageLabel)}</p>
              <p style="margin:0; font-size:14px; color:#111111; white-space:pre-wrap;">${escapeHtml(messageValue)}</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background-color:#f9f9f9; padding: 16px 32px; border-top:1px solid #e5e5e5;">
            <p style="margin:0; font-size:12px; color:#888888;">Automated notification from moralclean.com</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

async function sendEmail(payload: {
  from: string;
  to: string[];
  replyTo?: string;
  subject: string;
  html: string;
}) {
  const resend = new Resend(env.resendApiKey);
  const { data, error } = await resend.emails.send(payload);

  if (error) {
    console.error("[Resend] Failed to send email:", error);
  } else {
    console.log("[Resend] Email sent, id:", data?.id);
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

  if (error) {
    return {
      success: false,
      error: "Unable to send request right now. Please try again.",
    };
  }

  const rows = [
    { label: "Name", value: name },
    { label: "Phone", value: phone },
    ...(email ? [{ label: "Email", value: email }] : []),
    { label: "Category", value: categoryContext },
  ];

  await sendEmail({
    from: `Moral Clean Website <${env.resendFromEmail}>`,
    to: [env.resendToEmail],
    subject: `New Quick Quote Request – ${categoryContext}`,
    html: buildNotificationHtml({
      heading: "New Quick Quote Request",
      rows,
      messageLabel: "Requirement",
      messageValue: requirement,
    }),
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

  if (error) {
    return {
      success: false,
      error: "Unable to send your message right now. Please try again.",
    };
  }

  const rows = [
    { label: "Name", value: name },
    { label: "Email", value: email },
    { label: "Phone", value: phone },
    ...(subject ? [{ label: "Subject", value: subject }] : []),
  ];

  await sendEmail({
    from: `Moral Clean Website <${env.resendFromEmail}>`,
    to: [env.resendToEmail],
    replyTo: email,
    subject: subject
      ? `${subject} – ${name}`
      : `New Contact Form Submission – ${name}`,
    html: buildNotificationHtml({
      heading: "New Contact Form Submission",
      rows,
      messageLabel: "Message",
      messageValue: message,
    }),
  });

  return { success: true, error: null };
}