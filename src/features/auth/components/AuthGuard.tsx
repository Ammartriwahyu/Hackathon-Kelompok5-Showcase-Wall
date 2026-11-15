"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/shared/stores/useAuthStore";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isBootstrapped = useAuthStore((s) => s.isBootstrapped);

  useEffect(() => {
    if (isBootstrapped && !user) {
      router.replace("/login");
    }
  }, [isBootstrapped, user, router]);

  if (!isBootstrapped) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-brand-100/30">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-indigo-600" />
        <p className="text-sm font-medium text-muted">Memulihkan sesi...</p>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
