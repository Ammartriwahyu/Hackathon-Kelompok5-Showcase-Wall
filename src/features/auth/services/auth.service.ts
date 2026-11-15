import { api } from "@/lib/axios";
import type { ApiResponse, User } from "@/shared/types/api";

export async function loginWithFirebase(idToken: string) {
  const res = await api.post<ApiResponse<{ access_token: string; user: User }>>(
    "/auth/oauth/firebase",
    { id_token: idToken },
  );
  return res.data.data;
}