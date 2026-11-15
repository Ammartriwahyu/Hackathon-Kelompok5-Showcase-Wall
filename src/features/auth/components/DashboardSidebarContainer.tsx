"use client";

import { DashboardSidebar } from "@/shared/components/layout/DashboardSidebar";
import { useLogoutMutation } from "../hooks/useAuthMutations";

export function DashboardSidebarContainer() {
  const logout = useLogoutMutation();
  return <DashboardSidebar onLogout={() => logout.mutate()} isLoggingOut={logout.isPending} />;
}