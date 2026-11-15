"use client";
import { isFirebaseEnabled } from "@/lib/firebase";
import { useFirebaseOAuthMutation } from "../hooks/useAuthMutations";

export function OAuthButton() {
  const oauth = useFirebaseOAuthMutation();
  if (!isFirebaseEnabled) return null;
  return (
    <button
      type="button"
      onClick={() => oauth.mutate()}
      disabled={oauth.isPending}
      className="w-full rounded-lg border py-2.5 disabled:opacity-60"
    >
      {oauth.isPending ? "Menghubungkan..." : "Lanjutkan dengan Google"}
    </button>
  );
}