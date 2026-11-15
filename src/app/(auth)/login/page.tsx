import type { Metadata } from "next";
import { AuthHero, LoginForm } from "@/features/auth";

export const metadata: Metadata = { title: "Masuk · BCC Showcase Wall" };

export default function LoginPage() {
  return (
    <>
      <AuthHero title="Autentikasi Akun BCC Showcase Wall" />
      <div className="mt-8">
        <LoginForm />
      </div>
    </>
  );
}