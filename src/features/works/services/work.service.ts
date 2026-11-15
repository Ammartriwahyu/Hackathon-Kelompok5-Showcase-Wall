import { api } from "@/lib/axios";
import type { ApiResponse, DashboardSummary, ManagedWork } from "@/shared/types/api";

export type DashboardWorksParams = {
  q?: string;
  status?: ManagedWork["status"];
  cursor?: string;
  limit?: number;
};

export async function getMySummary() {
  const res = await api.get<ApiResponse<DashboardSummary>>("/me/summary");
  return res.data.data;
}

export async function getAdminSummary() {
  const res = await api.get<ApiResponse<DashboardSummary>>("/admin/summary");
  return res.data.data;
}

export async function getMyWorks(params: DashboardWorksParams) {
  const res = await api.get<ApiResponse<ManagedWork[]>>("/me/works", { params });
  return res.data;
}

export async function getAdminWorks(params: DashboardWorksParams) {
  const res = await api.get<ApiResponse<ManagedWork[]>>("/admin/works", { params });
  return res.data;
}

export async function getManagedWorkById(id: string) {
  const res = await api.get<ApiResponse<ManagedWork>>(`/me/works/${id}`);
  return res.data.data;
}

export async function createWork(formData: FormData) {
  const res = await api.post<ApiResponse<ManagedWork>>("/works", formData);
  return res.data.data;
}

export async function updateWork(id: string, formData: FormData) {
  const res = await api.patch<ApiResponse<ManagedWork>>(`/works/${id}`, formData);
  return res.data.data;
}

export async function deleteWork(id: string) {
  await api.delete(`/works/${id}`);
}

export async function publishWork(id: string) {
  const res = await api.post<ApiResponse<ManagedWork>>(`/admin/works/${id}/publish`);
  return res.data.data;
}

export async function unpublishWork(id: string) {
  const res = await api.post<ApiResponse<ManagedWork>>(`/admin/works/${id}/unpublish`);
  return res.data.data;
}

export async function toggleFeaturedWork(id: string, is_featured: boolean) {
  const res = await api.patch<ApiResponse<ManagedWork>>(`/admin/works/${id}/feature`, {
    is_featured,
  });
  return res.data.data;
}
