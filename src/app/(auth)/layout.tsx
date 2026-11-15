import type { ReactNode } from "react";
import { AuthNavbar } from "@/shared/components/layout/AuthNavbar";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 text-slate-900">
      <AuthNavbar />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}