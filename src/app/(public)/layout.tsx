import { isIndexableCategory } from "@/content/categories";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { getAllCategories } from "@/lib/queries/categories";
import { getAllSettings } from "@/lib/queries/settings";

export const revalidate = 3600;

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, categories] = await Promise.all([
    getAllSettings(),
    getAllCategories(),
  ]);

  const visibleCategories = categories.filter((category) => isIndexableCategory(category.slug, category.product_count));

  return (
    <PostHogProvider>
      <Header settings={settings} categories={visibleCategories} />
      <main>{children}</main>
      <Footer settings={settings} categories={visibleCategories} />
      <WhatsAppButton whatsapp={settings.contact_form_whatsapp ?? ""} />
    </PostHogProvider>
  );
}
