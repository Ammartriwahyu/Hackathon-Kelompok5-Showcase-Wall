"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/shared/stores/useAuthStore";
import {
  getAdminSummary,
  getAdminWorks,
  getManagedWorkById,
  getMySummary,
  getMyWorks,
} from "../services/work.service";
import { useDashboardStore } from "../stores/useDashboardStore";

export function useDashboardSummary() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "Admin";

  return useQuery({
    queryKey: ["dashboard", "summary", user?.role],
    queryFn: () => (isAdmin ? getAdminSummary() : getMySummary()),
    enabled: Boolean(user),
  });
}

export function useDashboardWorks() {
  const user = useAuthStore((s) => s.user);
  const searchQuery = useDashboardStore((s) => s.searchQuery);
  const statusFilter = useDashboardStore((s) => s.statusFilter);
  const isAdmin = user?.role === "Admin";

  const params = {
    q: searchQuery.trim() || undefined,
    status: statusFilter === "ALL" ? undefined : statusFilter,
    limit: 20,
  };

  return useQuery({
    queryKey: ["dashboard", "works", user?.role, searchQuery.trim(), statusFilter],
    queryFn: () => (isAdmin ? getAdminWorks(params) : getMyWorks(params)),
    enabled: Boolean(user),
  });
}

export function useManagedWork(workId: string) {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ["dashboard", "work", workId],
    queryFn: () => getManagedWorkById(workId),
    enabled: Boolean(user && workId),
  });
}
