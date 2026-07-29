import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
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
    <>
      <Header settings={settings} categories={categories} />
      <main>{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton whatsapp={settings.contact_form_whatsapp ?? ""} />
    </>
  );
}
