"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  FolderTree,
  LayoutDashboard,
  Package,
  Settings,
  Wrench,
  Mailbox,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const adminNavItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Services", href: "/admin/services", icon: Wrench },
  { label: "Blog Posts", href: "/admin/blog", icon: FileText },
  { label: "Submissions", href: "/admin/submissions", icon: Mailbox },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1 p-3">
      {adminNavItems.map(({ href, label, icon: Icon }) => {
        const isActive =
          pathname === href ||
          (href !== "/admin" && pathname.startsWith(`${href}/`));

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent text-white"
                : "text-white/85 hover:bg-white/10 hover:text-white",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 bg-primary lg:block">
      <AdminSidebarNav />
    </aside>
  );
}
