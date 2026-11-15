import type { Metadata } from "next";
import { LoginForm } from "@/features/auth";

export const metadata: Metadata = { title: "Masuk · BCC Showcase Wall" };

export default function LoginPage() {
  return <LoginForm />;
}