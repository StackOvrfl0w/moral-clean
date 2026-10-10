import { beforeEach, describe, expect, mock, test } from "bun:test";

const insert = mock(async (_row) => ({ error: null }));
const send = mock(async (_payload) => ({ data: { id: "test" }, error: null }));
mock.module("@/lib/supabase/server", () => ({ createClient: () => ({ from: () => ({ insert }) }) }));
mock.module("@/config/env", () => ({ env: { resendApiKey: "test", resendFromEmail: "test@example.invalid", resendToEmail: "test@example.invalid" } }));
mock.module("resend", () => ({ Resend: class { emails = { send }; } }));
const { submitContactForm, submitQuickQuote } = await import("../src/lib/actions/contact");

const initial = { success: false, error: null };
function form(values) { const data = new FormData(); for (const [key, value] of Object.entries(values)) data.set(key, value); return data; }
const valid = { name: "Test", email: "test@example.invalid", phone: "+923000000000", message: "Test enquiry", requirement: "Test equipment", subject: "Quotation", categorySlug: "steam-cleaners" };

beforeEach(() => { insert.mockClear(); send.mockClear(); insert.mockImplementation(async () => ({ error: null })); send.mockImplementation(async () => ({ data: { id: "test" }, error: null })); });

describe("genuine enquiry recording", () => {
  for (const [name, action] of [["contact", submitContactForm], ["quick quote", submitQuickQuote]]) {
    test(`${name}: honeypot is never a recorded lead`, async () => {
      const result = await action(initial, form({ ...valid, website: "spam" }));
      expect(result.success).toBe(true); expect(result.recorded).toBe(false); expect(insert).not.toHaveBeenCalled(); expect(send).not.toHaveBeenCalled();
    });
    test(`${name}: database failure is never a recorded lead`, async () => {
      insert.mockImplementation(async () => ({ error: { message: "Unavailable" } }));
      const result = await action(initial, form(valid));
      expect(result.success).toBe(false); expect(result.recorded).not.toBe(true); expect(send).not.toHaveBeenCalled();
    });
    test(`${name}: a saved enquiry is recorded`, async () => {
      const result = await action(initial, form(valid));
      expect(result.success).toBe(true); expect(result.recorded).toBe(true); expect(insert).toHaveBeenCalledTimes(1);
    });
    test(`${name}: notification failure does not lose a saved enquiry`, async () => {
      send.mockImplementation(async () => { throw new Error("Notification unavailable"); });
      const result = await action(initial, form(valid));
      expect(result.success).toBe(true); expect(result.recorded).toBe(true); expect(insert).toHaveBeenCalledTimes(1);
    });
  }
  test("invalid contact data never reaches the database", async () => {
    const result = await submitContactForm(initial, form({ ...valid, email: "invalid" }));
    expect(result.success).toBe(false); expect(insert).not.toHaveBeenCalled();
  });
});
