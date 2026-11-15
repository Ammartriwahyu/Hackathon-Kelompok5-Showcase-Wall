import type { ReactNode } from "react";
import { AuthGuard } from "@/features/auth";
import { DashboardSidebar } from "@/shared/components/layout/DashboardSidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
        <DashboardSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
