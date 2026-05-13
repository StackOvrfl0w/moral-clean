"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { updateSettings } from "@/lib/actions/admin/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  settings: Record<string, string>;
}

function useSection(keys: string[], settings: Record<string, string>) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(keys.map((k) => [k, settings[k] ?? ""])),
  );
  const [saving, setSaving] = useState(false);

  function set(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    try {
      const result = await updateSettings(values);
      if (result.success) {
        toast.success("Settings saved.");
      } else {
        toast.error(result.error ?? "Failed to save settings.");
      }
    } catch {
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  return { values, set, saving, save };
}

function SaveButton({ saving }: { saving: boolean }) {
  return (
    <Button type="button" disabled={saving} className="min-w-[96px]">
      {saving ? <Loader2 className="size-4 animate-spin" /> : "Save Changes"}
    </Button>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function CharCounter({
  value,
  warn,
}: {
  value: string;
  warn: number;
}) {
  const len = value.length;
  return (
    <p
      className={`text-xs ${len > warn ? "font-medium text-destructive" : "text-muted-foreground"}`}
    >
      {len} characters{len > warn ? ` — recommended limit is ${warn}` : ""}
    </p>
  );
}

export function SettingsForm({ settings }: Props) {
  const business = useSection(
    [
      "business_name",
      "business_tagline",
      "business_phone",
      "business_email",
      "business_address",
      "business_hours",
    ],
    settings,
  );

  const social = useSection(
    [
      "social_facebook",
      "social_instagram",
      "social_linkedin",
      "social_youtube",
      "contact_form_whatsapp",
      "google_maps_embed_url",
    ],
    settings,
  );

  const seo = useSection(
    ["seo_default_title", "seo_default_description"],
    settings,
  );

  const homepage = useSection(
    [
      "announcement_bar_text",
      "homepage_hero_heading_line1",
      "homepage_hero_heading_line2",
      "homepage_hero_subheading",
    ],
    settings,
  );

  return (
    <div className="space-y-6">
      {/* Section 1 — Business Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
          <CardTitle>Business Information</CardTitle>
          <SaveButton saving={business.saving} />
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <Field label="Business Name">
            <Input
              value={business.values.business_name}
              onChange={(e) => business.set("business_name", e.target.value)}
              placeholder="Moral Clean"
            />
          </Field>
          <Field label="Tagline">
            <Input
              value={business.values.business_tagline}
              onChange={(e) => business.set("business_tagline", e.target.value)}
              placeholder="Commercial Cleaning Equipment & Service"
            />
          </Field>
          <Field label="Phone">
            <Input
              value={business.values.business_phone}
              onChange={(e) => business.set("business_phone", e.target.value)}
              placeholder="+92 331 3195138"
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={business.values.business_email}
              onChange={(e) => business.set("business_email", e.target.value)}
              placeholder="info@moralclean.com"
            />
          </Field>
          <Field label="Address" hint="Shown in footer, contact page, and schema.">
            <Textarea
              rows={2}
              value={business.values.business_address}
              onChange={(e) => business.set("business_address", e.target.value)}
              placeholder="Shop no 01, Plot no 242, Sector 11-E, North Karachi, Karachi"
            />
          </Field>
          <Field label="Business Hours">
            <Input
              value={business.values.business_hours}
              onChange={(e) => business.set("business_hours", e.target.value)}
              placeholder="Monday – Saturday, 9:00 AM – 6:00 PM"
            />
          </Field>
        </CardContent>
      </Card>

      {/* Section 2 — Social Media & Contact Links */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
          <CardTitle>Social Media &amp; Contact Links</CardTitle>
          <SaveButton saving={social.saving} />
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <Field label="Facebook URL" hint="Leave blank to hide icon.">
            <Input
              value={social.values.social_facebook}
              onChange={(e) => social.set("social_facebook", e.target.value)}
              placeholder="https://facebook.com/moralclean"
            />
          </Field>
          <Field label="Instagram URL" hint="Leave blank to hide icon.">
            <Input
              value={social.values.social_instagram}
              onChange={(e) => social.set("social_instagram", e.target.value)}
              placeholder="https://instagram.com/moralclean"
            />
          </Field>
          <Field label="LinkedIn URL" hint="Leave blank to hide icon.">
            <Input
              value={social.values.social_linkedin}
              onChange={(e) => social.set("social_linkedin", e.target.value)}
              placeholder="https://linkedin.com/company/moralclean"
            />
          </Field>
          <Field label="YouTube URL" hint="Leave blank to hide icon.">
            <Input
              value={social.values.social_youtube}
              onChange={(e) => social.set("social_youtube", e.target.value)}
              placeholder="https://youtube.com/@moralclean"
            />
          </Field>
          <Field
            label="WhatsApp Number"
            hint="Phone number only (digits, +, spaces). Used for the floating chat button. Leave blank to hide."
          >
            <Input
              value={social.values.contact_form_whatsapp}
              onChange={(e) =>
                social.set("contact_form_whatsapp", e.target.value)
              }
              placeholder="+92XXXXXXXXXX"
            />
          </Field>
          <Field
            label="Google Maps Embed URL"
            hint="Paste the src= URL from Google Maps → Share → Embed a map."
          >
            <Textarea
              rows={3}
              value={social.values.google_maps_embed_url}
              onChange={(e) =>
                social.set("google_maps_embed_url", e.target.value)
              }
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </Field>
        </CardContent>
      </Card>

      {/* Section 3 — SEO Defaults */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
          <CardTitle>SEO Defaults</CardTitle>
          <SaveButton saving={seo.saving} />
        </CardHeader>
        <CardContent className="grid gap-5">
          <Field label="Default Meta Title">
            <Input
              value={seo.values.seo_default_title}
              onChange={(e) => seo.set("seo_default_title", e.target.value)}
              placeholder="Moral Clean — Commercial Cleaning Equipment & Service in Pakistan"
            />
            <CharCounter value={seo.values.seo_default_title} warn={60} />
          </Field>
          <Field label="Default Meta Description">
            <Textarea
              rows={3}
              value={seo.values.seo_default_description}
              onChange={(e) =>
                seo.set("seo_default_description", e.target.value)
              }
              placeholder="Moral Clean supplies and services professional commercial cleaning equipment across Pakistan."
            />
            <CharCounter
              value={seo.values.seo_default_description}
              warn={160}
            />
          </Field>
        </CardContent>
      </Card>

      {/* Section 4 — Homepage Content */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
          <CardTitle>Homepage Content</CardTitle>
          <SaveButton saving={homepage.saving} />
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Announcement Bar Text"
            hint="The thin bar displayed above the header on desktop."
          >
            <Input
              value={homepage.values.announcement_bar_text}
              onChange={(e) =>
                homepage.set("announcement_bar_text", e.target.value)
              }
              placeholder="Authorized distributor of leading international cleaning brands  |  +92 331 3195138"
            />
          </Field>
          <Field label="Hero Heading Line 1" hint="Displayed in a lighter weight above line 2.">
            <Input
              value={homepage.values.homepage_hero_heading_line1}
              onChange={(e) =>
                homepage.set("homepage_hero_heading_line1", e.target.value)
              }
              placeholder="Industrial-Grade"
            />
          </Field>
          <Field label="Hero Heading Line 2" hint="Displayed in bold accent colour.">
            <Input
              value={homepage.values.homepage_hero_heading_line2}
              onChange={(e) =>
                homepage.set("homepage_hero_heading_line2", e.target.value)
              }
              placeholder="Cleaning Equipment"
            />
          </Field>
          <Field label="Hero Subheading">
            <Textarea
              rows={3}
              value={homepage.values.homepage_hero_subheading}
              onChange={(e) =>
                homepage.set("homepage_hero_subheading", e.target.value)
              }
              placeholder="Pakistan's trusted partner for professional commercial cleaning machines."
            />
          </Field>
        </CardContent>
      </Card>
    </div>
  );
}
