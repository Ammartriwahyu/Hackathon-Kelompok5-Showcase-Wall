import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/shared/stores/useAuthStore";
import type { ApiError, ApiResponse } from "@/shared/types/api";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise: Promise<string> | null = null;

export function refreshAccessToken(): Promise<string> {
  refreshPromise ??= axios
    .post<ApiResponse<{ access_token: string }>>(
      `${baseURL}/auth/refresh`,
      null,
      {
        withCredentials: true,
      },
    )
    .then((res) => {
      const token = res.data.data.access_token;
      useAuthStore.getState().setAccessToken(token);
      return token;
    })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiError>) => {
    const original = error.config as RetryConfig | undefined;
    const isAuthRoute = original?.url?.includes("/auth/");

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isAuthRoute
    ) {
      original._retry = true;
      try {
        const token = await refreshAccessToken();
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(
  err: unknown,
  fallback = "Terjadi kesalahan. Coba lagi.",
) {
  if (axios.isAxiosError<ApiError>(err))
    return err.response?.data?.error?.message ?? fallback;
  return fallback;
}

export function getFieldErrors(
  err: unknown,
): Record<string, string> | undefined {
  if (axios.isAxiosError<ApiError>(err)) {
    return err.response?.data?.error?.fields;
  }
  return undefined;
}
