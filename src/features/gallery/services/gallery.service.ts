import { api } from "@/lib/axios";
import type {
  ApiResponse,
  PublicWork,
  PublicWorkDetail,
} from "@/shared/types/api";

export type PublicWorksParams = {
  q?: string;
  category?: string;
  tech_stack?: string;
  cursor?: string;
  limit?: number;
};

export type WorkFacets = {
  categories: string[];
  tech_stack: string[];
};

export async function getPublicWorks(params: PublicWorksParams) {
  const res = await api.get<ApiResponse<PublicWork[]>>("/works", { params });
  return res.data;
}

export async function getFeaturedWork() {
  const res = await api.get<ApiResponse<PublicWork | null>>("/works/featured");
  return res.data.data;
}

export async function getWorkFacets() {
  const res = await api.get<ApiResponse<WorkFacets>>("/works/facets");
  return res.data.data;
}

export async function getPublicWorkDetail(id: string) {
  const res = await api.get<ApiResponse<PublicWorkDetail>>(`/works/${id}`);
  return res.data.data;
}
