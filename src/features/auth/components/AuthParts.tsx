"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Alert } from "@/shared/components/ui/Alert";
import { cn } from "@/lib/utils";

export type FormAlertData = {
  variant: "error" | "warning";
  title: string;
  description?: string;
} | null;

export function AuthHero({ title }: { title: string }) {
  return (
    <div>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
        <ShieldCheck className="size-3.5" aria-hidden />
        Alur Autentikasi Pengguna &amp; Kontributor
      </span>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Dua opsi masuk terpadu dengan alur verifikasi dua langkah aman untuk
        kontributor dan kurator karya pameran teknologi.
      </p>
    </div>
  );
}

export function AuthCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-x-10 -top-px h-px bg-linear-to-r from-transparent via-indigo-500 to-transparent"
      />
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
    <div className="mb-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
          {label}
        </span>
        <span
          className="font-mono text-xs text-slate-400"
          aria-label={`Langkah ${step} dari 2`}
        >
          0{step}/02
        </span>
      </div>
      <h2
        id={titleId}
        className="text-xl font-bold tracking-tight text-slate-900"
      >
        {title}
      </h2>
      <div className="mt-1 text-sm leading-relaxed text-slate-500">
        {description}
      </div>
    </div>
  );
}

export function AuthDivider({ text }: { text: string }) {
  return (
    <div className="my-6 flex items-center gap-3" role="separator">
      <span className="h-px flex-1 bg-slate-200" />
      <span className="text-sm text-slate-500">{text}</span>
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
            className="mb-5"
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
              "mt-3 flex items-center justify-center gap-2 text-sm",
              boxed
                ? "rounded-xl border border-indigo-200 bg-indigo-50 py-3 text-indigo-700"
                : "text-slate-500",
            )}
          >
            <Loader2 className="size-4 animate-spin" aria-hidden />
            {label}:{" "}
            <em className={boxed ? "not-italic" : "italic"}>{value}</em>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PasswordToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  const Icon = visible ? EyeOff : Eye;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
      aria-pressed={visible}
      className="-mr-2 grid size-11 place-items-center rounded-lg text-slate-400 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}
