"use server";

import { createClient } from "@/lib/supabase/server";

export type QuickQuoteFormState = {
  success: boolean;
  error: string | null;
};

export type ContactFormState = {
  success: boolean;
  error: string | null;
};

export const initialQuickQuoteFormState: QuickQuoteFormState = {
  success: false,
  error: null,
};

export const initialContactFormState: ContactFormState = {
  success: false,
  error: null,
};

function normalizeValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

  return {
    success: true,
    error: null,
  };
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

  const composedMessage = subject ? `[Subject: ${subject}]\n${message}` : message;
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

  return {
    success: true,
    error: null,
  };
}
