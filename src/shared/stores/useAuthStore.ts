import { create } from "zustand";
import type { User } from "@/shared/types/api";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isBootstrapped: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  setBootstrapped: (value: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,
  isBootstrapped: false,
  setAuth: (user, accessToken) => set({ user, accessToken }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setBootstrapped: (isBootstrapped) => set({ isBootstrapped }),
  logout: () => set({ user: null, accessToken: null }),
}));