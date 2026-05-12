"use client";

import { Menu } from "lucide-react";

import { AdminSidebarNav } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function AdminMobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="size-5" aria-hidden="true" />
          <span className="sr-only">Open admin menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-primary p-0 text-white">
        <SheetHeader className="border-b border-white/10 px-4 py-3 text-left">
          <SheetTitle className="text-white">Admin Menu</SheetTitle>
        </SheetHeader>
        <AdminSidebarNav />
      </SheetContent>
    </Sheet>
  );
}
