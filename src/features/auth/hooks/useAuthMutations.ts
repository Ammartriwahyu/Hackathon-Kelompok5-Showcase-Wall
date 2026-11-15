"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getGoogleIdToken, isPopupCancelled } from "@/lib/firebase";
import { useAuthStore } from "@/shared/stores/useAuthStore";
import { loginWithFirebase } from "../services/auth.service";

export function useFirebaseOAuthMutation() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async () => loginWithFirebase(await getGoogleIdToken()),
    onSuccess: ({ access_token, user }) => {
      setAuth(user, access_token);
      router.replace("/dashboard");
    },
    onError: (err) => {
      if (isPopupCancelled(err)) return;
      toast.error("Gagal masuk dengan Google. Coba lagi.");
    },
  });
}