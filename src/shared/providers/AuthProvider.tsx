"use client";

import { useEffect, type ReactNode } from "react";
import { api, refreshAccessToken } from "@/lib/axios";
import { useAuthStore } from "@/shared/stores/useAuthStore";
import type { ApiResponse, User } from "@/shared/types/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setBootstrapped = useAuthStore((s) => s.setBootstrapped);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    let active = true;

    async function bootstrapSession() {
      try {
        const token = await refreshAccessToken();
        const res = await api.get<ApiResponse<User>>("/me");
        if (active) {
          setAuth(res.data.data, token);
        }
      } catch {
        if (active) {
          logout();
        }
      } finally {
        if (active) {
          setBootstrapped(true);
        }
      }
    }

    bootstrapSession();
    return () => {
      active = false;
    };
  }, [setAuth, setBootstrapped, logout]);

  return <>{children}</>;
}
