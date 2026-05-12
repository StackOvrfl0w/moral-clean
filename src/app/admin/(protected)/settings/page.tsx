import { ChangePasswordDialog } from "@/components/admin/ChangePasswordDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";

export default async function AdminSettingsPage() {
  const user = await requireAdmin();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold text-primary">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>More settings coming soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Additional business, SEO, and integration settings will be added here.
          </p>
        </CardContent>
      </Card>
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
