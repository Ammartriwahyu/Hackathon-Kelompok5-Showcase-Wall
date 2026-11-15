export const isFirebaseEnabled = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

export async function getGoogleIdToken(): Promise<string> {
  if (!isFirebaseEnabled) throw new Error("Firebase belum dikonfigurasi");

  const { initializeApp, getApps } = await import("firebase/app");
  const { getAuth, GoogleAuthProvider, signInWithPopup, signOut } = await import("firebase/auth");

  const app =
    getApps()[0] ??
    initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  const auth = getAuth(app);

  const result = await signInWithPopup(auth, new GoogleAuthProvider());
  const idToken = await result.user.getIdToken();
  await signOut(auth);
  return idToken;
}

export function isPopupCancelled(err: unknown) {
  const code = (err as { code?: string })?.code;
  return code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request";
}