"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Alert } from "@/shared/components/ui/Alert";
import { cn } from "@/lib/utils";

export type FormAlertData = { variant: "error" | "warning"; title: string; description?: string } | null;

export function AuthHero({ title }: { title: string }) {
  return (
    <div className="text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-5 py-2 text-base font-medium text-indigo-700 sm:text-lg">
        <ShieldCheck className="size-5" aria-hidden />
        Alur Autentikasi Pengguna &amp; Kontributor
      </span>
      <h1 className="mt-8 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">{title}</h1>
      <p className="mx-auto mt-6 max-w-4xl text-lg leading-relaxed text-slate-600 sm:text-xl">
        Dua opsi masuk terpadu dengan alur verifikasi dua langkah aman untuk kontributor dan kurator karya pameran
        teknologi.
      </p>
    </div>
  );
}

export function AuthCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cn("flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-11", className)}
    >
      {children}
    </section>
  );
}

export function StepHeader({
  titleId,
  label,
  step,
  title,
  description,
}: {
  titleId: string;
  label: string;
  step: 1 | 2;
  title: string;
  description: ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="mb-10 flex items-center justify-between">
        <span className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-base font-medium text-indigo-700 sm:text-lg">
          {label}
        </span>
        <span className="font-mono text-base text-slate-400 sm:text-lg" aria-label={`Langkah ${step} dari 2`}>
          0{step}/02
        </span>
      </div>
      <h2 id={titleId} className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h2>
      <div className="mt-3 text-base leading-relaxed text-slate-500 sm:text-lg">{description}</div>
    </div>
  );
}

export function AuthDivider({ text }: { text: string }) {
  return (
    <div className="my-8 flex items-center gap-4" role="separator">
      <span className="h-px flex-1 bg-slate-200" />
      <span className="text-base text-slate-500 sm:text-lg">{text}</span>
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

export function FormAlert({ alert }: { alert: FormAlertData }) {
  return (
    <AnimatePresence initial={false}>
      {alert && (
        <motion.div
          key={alert.title}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <Alert
            variant={alert.variant}
            title={alert.title}
            description={alert.description}
            className="mb-6 rounded-2xl p-4 text-base sm:text-lg"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function StatusLine({
  show,
  label,
  value,
  boxed = false,
}: {
  show: boolean;
  label: string;
  value: string;
  boxed?: boolean;
}) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          key="status"
          role="status"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <p
            className={cn(
              "mt-4 flex items-center justify-center gap-2 text-base sm:text-lg",
              boxed ? "rounded-2xl border border-indigo-200 bg-indigo-50 py-4 text-indigo-700" : "text-slate-500",
            )}
          >
            <Loader2 className="size-5 animate-spin" aria-hidden />
            {label}: <em className={boxed ? "not-italic" : "italic"}>{value}</em>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PasswordToggle({ visible, onToggle }: { visible: boolean; onToggle: () => void }) {
  const Icon = visible ? EyeOff : Eye;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
      aria-pressed={visible}
      className="-mr-2 grid size-11 place-items-center rounded-lg text-slate-400 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <Icon className="size-6" aria-hidden />
    </button>
  );
}