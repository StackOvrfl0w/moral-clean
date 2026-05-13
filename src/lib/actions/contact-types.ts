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
