import type { Metadata } from "next";
import { AuthShell } from "@/features/auth";

export const metadata: Metadata = { title: "Masuk · BCC Showcase Wall" };

export default function LoginPage() {
  return <AuthShell mode="login" />;
}