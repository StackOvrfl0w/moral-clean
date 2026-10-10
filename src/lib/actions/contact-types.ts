export type QuickQuoteFormState = {
  recorded?: boolean;
  success: boolean;
  error: string | null;
};

export type ContactFormState = {
  recorded?: boolean;
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
