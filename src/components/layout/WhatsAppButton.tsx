"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  whatsapp: string;
}

export function WhatsAppButton({ whatsapp }: WhatsAppButtonProps) {
  if (!whatsapp) return null;

  const digits = whatsapp.replace(/\D/g, "");
  const href = `https://wa.me/${digits}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{ backgroundColor: "#25D366" }}
    >
      <MessageCircle className="size-7 text-white" aria-hidden="true" />
    </a>
  );
}
