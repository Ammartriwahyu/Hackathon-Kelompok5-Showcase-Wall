"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Info,
  Loader2,
  LogIn,
  RectangleEllipsis,
  ShieldCheck,
  SlidersHorizontal,
  UserPlus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/Button";
import { useAuthStore } from "@/shared/stores/useAuthStore";
import { useGuestRedirect } from "../hooks/useAuthMutations";
import { AuthCard } from "./AuthParts";
import { LoginForm } from "./LoginForm";
import { OtpCodeForm } from "./OtpCodeForm";
import { RegisterForm } from "./RegisterForm";

type Mode = "login" | "register";
type TabId = Mode | "otp" | "session";

const TABS = [
  { id: "login", label: "Masuk (/login)", icon: LogIn, href: "/login" },
  { id: "otp", label: "Verifikasi OTP", icon: RectangleEllipsis },
  { id: "register", label: "Buat Akun (/register)", icon: UserPlus, href: "/register" },
  { id: "session", label: "State Khusus & Sesi", icon: SlidersHorizontal },
] as const;

const SESSION_RULES = [
  "Kode OTP berlaku 10 menit dan hanya bisa dipakai sekali.",
  "Maksimal 5 kali percobaan untuk setiap kode.",
  "Kirim ulang kode tersedia setiap 60 detik.",
  "Permintaan berlebih dibatasi sementara (1 kode per menit, 5 per jam).",
  "Masuk dengan Google tidak memerlukan kode OTP.",
  "Sesi dipulihkan otomatis saat halaman dimuat ulang.",
];

export function AuthShell({ mode }: { mode: Mode }) {
  useGuestRedirect();
  const [email, setEmail] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [view, setView] = useState<"form" | "session">("form");

  const activeTab: TabId = view === "session" ? "session" : email ? "otp" : mode;

  const handleOtpRequired = (value: string) => {
    setEmail(value);
    setNotice(null);
  };

  const focusOtp = () => {
    setView("form");
    document.getElementById("otp-digit-0")?.focus();
  };

  return (
    <>
      <AnimatePresence initial={false}>
        {notice && (
          <motion.div
            key="notice"
            role="status"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-900 text-white"
          >
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-12 sm:py-4">
              <p className="flex items-center gap-3 text-base sm:text-lg">
                <Info className="size-5 shrink-0" aria-hidden />
                {notice}
              </p>
              <button
                type="button"
                onClick={() => setNotice(null)}
                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg text-base text-slate-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:text-lg"
              >
                Tutup
                <X className="size-5" aria-hidden />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto w-full max-w-[1450px] px-4 pb-16 pt-12 sm:px-6 lg:pt-16">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-5 py-2 text-base font-medium text-indigo-700 sm:text-lg">
            <ShieldCheck className="size-5" aria-hidden />
            Alur Autentikasi Pengguna &amp; Kontributor
          </span>
          <h1 className="mt-8 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Autentikasi Akun BCC Showcase Wall
          </h1>
          <p className="mx-auto mt-6 max-w-4xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            Dua opsi masuk terpadu dengan alur verifikasi dua langkah aman untuk kontributor dan kurator karya pameran
            teknologi.
          </p>

          <nav
            aria-label="Langkah autentikasi"
            className="mt-12 inline-flex max-w-full flex-wrap justify-center gap-1 rounded-2xl border border-slate-200 bg-slate-100 p-1.5"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              const className = cn(
                "relative inline-flex h-12 items-center rounded-xl px-4 text-base transition-colors sm:px-6 sm:text-lg",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                "disabled:cursor-not-allowed disabled:opacity-50",
                isActive ? "font-medium text-indigo-600" : "text-slate-600 hover:text-slate-900",
              );
              const content = (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="auth-tab"
                      className="absolute inset-0 rounded-xl bg-white shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <Icon className="size-5" aria-hidden />
                    {tab.label}
                  </span>
                </>
              );

              if ("href" in tab) {
                return (
                  <Link key={tab.id} href={tab.href} aria-current={isActive ? "page" : undefined} className={className}>
                    {content}
                  </Link>
                );
              }
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={isActive}
                  disabled={tab.id === "otp" && !email}
                  onClick={tab.id === "otp" ? focusOtp : () => setView((v) => (v === "session" ? "form" : "session"))}
                  className={className}
                >
                  {content}
                </button>
              );
            })}
          </nav>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {view === "form" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="mt-12 grid items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-12"
            >
              {mode === "login" ? (
                <LoginForm onOtpRequired={handleOtpRequired} onNotice={setNotice} />
              ) : (
                <RegisterForm onOtpRequired={handleOtpRequired} onNotice={setNotice} />
              )}
              <StepConnector active={!!email} />
              <OtpCodeForm key={email ?? "locked"} email={email} purpose={mode} onBack={() => setEmail(null)} />
            </motion.div>
          ) : (
            <motion.div
              key="session"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="mx-auto mt-12 max-w-2xl"
            >
              <SessionPanel onBack={() => setView("form")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function StepConnector({ active }: { active: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-center" aria-hidden>
      <motion.span
        animate={active ? { scale: [1, 1.15, 1] } : { scale: 1 }}
        transition={active ? { duration: 0.6, repeat: 2 } : { duration: 0 }}
        className="grid size-14 place-items-center rounded-full border border-slate-200 bg-white text-indigo-600 shadow-sm"
      >
        <ArrowRight className="hidden size-6 lg:block" />
        <ArrowDown className="size-6 lg:hidden" />
      </motion.span>
      <span className="max-w-28 text-sm leading-snug text-slate-500">Langkah Berikutnya (Hanya untuk Email)</span>
    </div>
  );
}

function SessionPanel({ onBack }: { onBack: () => void }) {
  const user = useAuthStore((s) => s.user);
  const isBootstrapped = useAuthStore((s) => s.isBootstrapped);
  const status = !isBootstrapped
    ? "Memulihkan sesi..."
    : user
      ? `Masuk sebagai ${user.display_name} (${user.role})`
      : "Belum masuk";

  return (
    <AuthCard>
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">State Khusus &amp; Sesi</h2>
      <p
        role="status"
        className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-700 sm:text-lg"
      >
        {!isBootstrapped && <Loader2 className="size-5 animate-spin" aria-hidden />}
        Status sesi: <strong className="font-semibold">{status}</strong>
      </p>
      <ul className="mt-6 space-y-3 text-base text-slate-600 sm:text-lg">
        {SESSION_RULES.map((rule) => (
          <li key={rule} className="flex gap-3">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-indigo-500" aria-hidden />
            {rule}
          </li>
        ))}
      </ul>
      <Button variant="outline" size="lg" className="mt-8 w-full" onClick={onBack}>
        Kembali ke formulir
      </Button>
    </AuthCard>
  );
}