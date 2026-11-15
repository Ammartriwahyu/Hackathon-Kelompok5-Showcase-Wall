import type { Metadata } from "next";
import { AuthShell } from "@/features/auth";

export const metadata: Metadata = { title: "Daftar · BCC Showcase Wall" };

export default function RegisterPage() {
  return <AuthShell mode="register" />;
}