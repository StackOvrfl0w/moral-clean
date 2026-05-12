import Link from "next/link";
import { Droplets } from "lucide-react";

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-primary text-white">
            <Droplets className="size-6" aria-hidden="true" />
          </div>
          <CardTitle>Admin Login</CardTitle>
          <p className="text-sm text-muted-foreground">Moral Clean administration panel</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <AdminLoginForm />
          {/* TODO: Wire forgot-password recovery flow when email templates are finalized. */}
          <Link href="#" className="block text-center text-xs text-muted-foreground hover:text-primary">
            Forgot password?
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
