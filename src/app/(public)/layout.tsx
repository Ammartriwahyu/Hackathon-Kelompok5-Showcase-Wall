import type { ReactNode } from "react";
import { PublicNavbar } from "@/shared/components/layout/PublicNavbar";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PublicNavbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      <SiteFooter />
    </div>
  );
}