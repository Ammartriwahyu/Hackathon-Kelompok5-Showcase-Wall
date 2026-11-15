import type { Metadata } from "next";
import { AuthHero, RegisterForm } from "@/features/auth";

export const metadata: Metadata = { title: "Daftar · BCC Showcase Wall" };

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-[1450px] px-4 pb-16 pt-12 sm:px-6 lg:pt-16">
      <AuthHero title="Daftar Akun BCC Showcase Wall" />
      <div className="mx-auto mt-12 w-full max-w-xl">
        <RegisterForm />
      </div>
    </div>
  );
}