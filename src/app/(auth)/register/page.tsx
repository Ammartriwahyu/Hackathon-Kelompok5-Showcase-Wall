import type { Metadata } from "next";
import { AuthHero, RegisterForm } from "@/features/auth";

export const metadata: Metadata = { title: "Daftar · BCC Showcase Wall" };

export default function RegisterPage() {
  return (
    <>
      <AuthHero title="Daftar Akun BCC Showcase Wall" />
      <div className="mt-8">
        <RegisterForm />
      </div>
    </>
  );
}