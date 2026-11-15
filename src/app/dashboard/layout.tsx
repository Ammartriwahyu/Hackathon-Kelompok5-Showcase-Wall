import type { ReactNode } from "react";
import { AuthGuard, DashboardSidebarContainer } from "@/features/auth";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-dvh flex-col bg-brand-100/30 text-foreground lg:flex-row">
        <DashboardSidebarContainer />
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}