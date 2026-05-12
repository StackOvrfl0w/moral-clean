import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/auth";

export default async function AdminProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-muted lg:flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <header className="border-b bg-white">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="lg:hidden">
                <AdminMobileNav />
              </div>
              <p className="text-sm font-semibold tracking-wide text-primary">
                MORAL CLEAN — Admin
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="hidden text-sm text-muted-foreground sm:block">
                {user.email}
              </p>
              <AdminLogoutButton />
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
