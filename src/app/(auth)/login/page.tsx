import type { Metadata } from "next";
import { AuthHero, LoginForm } from "@/features/auth";

export const metadata: Metadata = { title: "Masuk · BCC Showcase Wall" };

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-[1450px] px-4 pb-16 pt-12 sm:px-6 lg:pt-16">
      <AuthHero title="Autentikasi Akun BCC Showcase Wall" />
      <div className="mx-auto mt-12 w-full max-w-xl">
        <LoginForm />
      </div>
    </div>
  );
}