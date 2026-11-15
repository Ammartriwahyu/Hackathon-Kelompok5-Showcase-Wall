"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import type { ReactNode } from "react";
import { Alert } from "@/shared/components/ui/alert";

export type FormAlertData = { variant: "error" | "warning"; title: string; description?: string } | null;

export function StepHeader({
  label,
  step,
  title,
  description,
}: {
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
        <span className="font-mono text-xs text-slate-400" aria-label={`Langkah ${step} dari 2`}>
          0{step}/02
        </span>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
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

// Alert muncul/hilang dengan animasi tinggi agar perubahan form mudah diikuti
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
          <Alert variant={alert.variant} title={alert.title} description={alert.description} className="mb-5" />
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
      <Icon className="size-5" aria-hidden />
    </button>
  );
}

// Langkah 1 keluar ke kiri, langkah 2 masuk dari kanan (dan sebaliknya)
export function AuthSteps({ step, credentials, otp }: { step: "credentials" | "otp"; credentials: ReactNode; otp: ReactNode }) {
  const isOtp = step === "otp";
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={step}
        initial={{ opacity: 0, x: isOtp ? 40 : -40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: isOtp ? 40 : -40 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {isOtp ? otp : credentials}
      </motion.div>
    </AnimatePresence>
  );
}