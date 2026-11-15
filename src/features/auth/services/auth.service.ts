import { api } from "@/lib/axios";
import type { ApiResponse, User } from "@/shared/types/api";
import type { LoginInput, OtpPurpose, RegisterInput } from "../schemas/auth.schema";

export type AuthSession = { access_token: string; user: User };

export async function registerAccount(input: RegisterInput): Promise<void> {
  await api.post("/auth/register", input);
}

export async function loginWithPassword(input: LoginInput): Promise<AuthSession | null> {
  const res = await api.post<Partial<ApiResponse<AuthSession>> | "">("/auth/login", input);
  const session = res.data ? res.data.data : undefined;
  return session?.access_token ? session : null;
}

export async function verifyOtp(payload: { email: string; code: string; purpose: OtpPurpose }) {
  const res = await api.post<ApiResponse<AuthSession>>("/auth/otp/verify", payload);
  return res.data.data;
}

export async function resendOtp(payload: { email: string; purpose: OtpPurpose }): Promise<void> {
  await api.post("/auth/otp/resend", payload);
}

export async function loginWithFirebase(idToken: string) {
  const res = await api.post<ApiResponse<AuthSession>>("/auth/oauth/firebase", { id_token: idToken });
  return res.data.data;
}

export async function logoutSession(): Promise<void> {
  await api.post("/auth/logout");
}

export async function getMe() {
  const res = await api.get<ApiResponse<User>>("/me");
  return res.data.data;
}