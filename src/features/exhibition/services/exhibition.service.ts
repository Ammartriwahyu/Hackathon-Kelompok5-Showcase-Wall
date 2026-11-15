import { api } from "@/lib/axios";
import type { ApiResponse, PublicWork } from "@/shared/types/api";

export async function getExhibitionWorks() {
  const res = await api.get<ApiResponse<PublicWork[]>>("/works/exhibition");
  return res.data.data;
}
