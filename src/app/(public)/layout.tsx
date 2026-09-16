import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { getAllCategories } from "@/lib/queries/categories";
import { getAllSettings } from "@/lib/queries/settings";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, categories] = await Promise.all([
    getAllSettings(),
    getAllCategories(),
  ]);

  return (
    <PostHogProvider>
      <Header settings={settings} categories={categories} />
      <main>{children}</main>
      <Footer settings={settings} categories={categories} />
      <WhatsAppButton whatsapp={settings.contact_form_whatsapp ?? ""} />
    </PostHogProvider>
  );
}
