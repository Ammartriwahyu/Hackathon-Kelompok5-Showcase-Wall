"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
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
    queryKey: ["dashboard", "summary", user?.id, user?.role],
    queryFn: () => (isAdmin ? getAdminSummary() : getMySummary()),
    enabled: Boolean(user),
  });
}

export function useDashboardWorks() {
  const user = useAuthStore((s) => s.user);
  const searchQuery = useDashboardStore((s) => s.searchQuery);
  const statusFilter = useDashboardStore((s) => s.statusFilter);
  const debouncedSearch = useDebouncedValue(searchQuery.trim(), 300);
  const isAdmin = user?.role === "Admin";

  return useInfiniteQuery({
    queryKey: ["dashboard", "works", user?.id, user?.role, debouncedSearch, statusFilter],
    queryFn: ({ pageParam }) => {
      const params = {
        q: debouncedSearch || undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        cursor: pageParam,
        limit: 20,
      };
      return isAdmin ? getAdminWorks(params) : getMyWorks(params);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.meta?.next_cursor ?? undefined,
    enabled: Boolean(user),
  });
}

export function useManagedWork(workId: string) {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ["dashboard", "work", user?.id, workId],
    queryFn: () => getManagedWorkById(workId),
    enabled: Boolean(user && workId),
  });
}
