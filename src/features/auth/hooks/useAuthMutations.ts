"use client";

import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios";
import { getGoogleIdToken, isPopupCancelled } from "@/lib/firebase";
import { useAuthStore } from "@/shared/stores/useAuthStore";
import {
  loginWithFirebase,
  loginWithPassword,
  logoutSession,
  registerAccount,
  resendOtp,
  verifyOtp,
  type AuthSession,
} from "../services/auth.service";

export function useFinishLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  return (session: AuthSession) => {
    queryClient.removeQueries({ queryKey: ["dashboard"] });
    setAuth(session.user, session.access_token);
    toast.success(`Selamat datang, ${session.user.display_name}!`);
    router.replace("/dashboard");
  };
}

export function useGuestRedirect() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isBootstrapped = useAuthStore((s) => s.isBootstrapped);
  useEffect(() => {
    if (isBootstrapped && user) router.replace("/dashboard");
  }, [isBootstrapped, user, router]);
}

export function useLoginMutation() {
  return useMutation({ mutationFn: loginWithPassword });
}

export function useRegisterMutation() {
  return useMutation({ mutationFn: registerAccount });
}

export function useVerifyOtpMutation() {
  const finish = useFinishLogin();
  return useMutation({ mutationFn: verifyOtp, onSuccess: finish });
}

export function useResendOtpMutation() {
  return useMutation({
    mutationFn: resendOtp,
    onSuccess: () => toast.success("Kode baru telah dikirim ke email kamu."),
    onError: (err) =>
      toast.error(getErrorMessage(err, "Gagal mengirim ulang kode.")),
  });
}

export function useFirebaseOAuthMutation(
  options: { onCancelled?: () => void } = {},
) {
  const finish = useFinishLogin();
  return useMutation({
    mutationFn: async () => loginWithFirebase(await getGoogleIdToken()),
    onSuccess: finish,
    onError: (err) => {
      if (isPopupCancelled(err)) {
        if (options.onCancelled) options.onCancelled();
        else toast.info("Login dengan Google dibatalkan.");
        return;
      }
      toast.error(
        getErrorMessage(err, "Gagal masuk dengan Google. Coba lagi."),
      );
    },
  });
}

export function useLogoutMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: logoutSession,
    onSettled: () => {
      logout();
      queryClient.removeQueries({ queryKey: ["dashboard"] });
      toast.success("Kamu telah keluar.");
      router.replace("/");
    },
  });
}
