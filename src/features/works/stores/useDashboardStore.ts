import { create } from "zustand";
import type { ManagedWork } from "@/shared/types/api";

export type DashboardStatusFilter = "ALL" | ManagedWork["status"];

type DashboardState = {
  searchQuery: string;
  statusFilter: DashboardStatusFilter;
  previewWork: ManagedWork | null;
  deleteTargetWork: ManagedWork | null;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: DashboardStatusFilter) => void;
  setPreviewWork: (work: ManagedWork | null) => void;
  setDeleteTargetWork: (work: ManagedWork | null) => void;
  resetFilters: () => void;
};

export const useDashboardStore = create<DashboardState>()((set) => ({
  searchQuery: "",
  statusFilter: "ALL",
  previewWork: null,
  deleteTargetWork: null,
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setPreviewWork: (previewWork) => set({ previewWork }),
  setDeleteTargetWork: (deleteTargetWork) => set({ deleteTargetWork }),
  resetFilters: () => set({ searchQuery: "", statusFilter: "ALL" }),
}));
