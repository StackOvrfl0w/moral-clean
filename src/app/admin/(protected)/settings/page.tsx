import { ChangePasswordDialog } from "@/components/admin/ChangePasswordDialog";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { getAllSettings } from "@/lib/queries/settings";

export default async function AdminSettingsPage() {
  const user = await requireAdmin();
  const settings = await getAllSettings();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold text-primary">Settings</h1>
      <SettingsForm settings={settings} />
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <ChangePasswordDialog />
        </CardContent>
      </Card>
    </div>
  );
}
