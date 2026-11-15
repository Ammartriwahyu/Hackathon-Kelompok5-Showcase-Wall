"use client";

import { useEffect, useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BadgeCheck, Clock } from "lucide-react";
import { getErrorStatus } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/Button";
import type { OtpPurpose } from "../schemas/auth.schema";
import { useResendOtpMutation, useVerifyOtpMutation } from "../hooks/useAuthMutations";
import { AuthCard, FormAlert, StepHeader, type FormAlertData } from "./AuthParts";

const LENGTH = 6;
const RESEND_SECONDS = 60;
const emptyDigits = () => Array<string>(LENGTH).fill("");

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  return domain ? `${name.slice(0, 1)}***@${domain}` : email;
}

type OtpCodeFormProps = { email: string | null; purpose: OtpPurpose; onBack: () => void };

export function OtpCodeForm({ email, purpose, onBack }: OtpCodeFormProps) {
  const locked = !email;
  const [digits, setDigits] = useState<string[]>(emptyDigits);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const verify = useVerifyOtpMutation();
  const resend = useResendOtpMutation();
  const code = digits.join("");

  useEffect(() => {
    if (!locked) inputs.current[0]?.focus();
  }, [locked]);

  useEffect(() => {
    if (locked || seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [locked, seconds]);

  const updateDigit = (index: number, value: string) => {
    verify.reset();
    setDigits((prev) => prev.map((d, i) => (i === index ? value : d)));
  };

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    updateDigit(index, digit);
    if (digit && index < LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) inputs.current[index - 1]?.focus();
    if (e.key === "ArrowLeft" && index > 0) inputs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!pasted) return;
    e.preventDefault();
    verify.reset();
    setDigits(Array.from({ length: LENGTH }, (_, i) => pasted[i] ?? ""));
    inputs.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email && code.length === LENGTH) verify.mutate({ email, code, purpose });
  };

  const handleResend = () => {
    if (!email) return;
    resend.mutate(
      { email, purpose },
      {
        onSuccess: () => {
          setSeconds(RESEND_SECONDS);
          setDigits(emptyDigits());
          inputs.current[0]?.focus();
        },
      },
    );
  };

  const alert: FormAlertData = verify.isError
    ? getErrorStatus(verify.error) === 429
      ? { variant: "warning", title: "Terlalu banyak percobaan. Minta kode baru." }
      : { variant: "warning", title: "Kode salah atau sudah kedaluwarsa. Periksa email terbaru." }
    : null;

  const canResend = !locked && seconds <= 0 && !resend.isPending;

  return (
    <motion.div
      className="h-full"
      initial={locked ? false : { opacity: 0.55, scale: 0.98 }}
      animate={{ opacity: locked ? 0.55 : 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <AuthCard>
        <form onSubmit={handleSubmit} noValidate aria-labelledby="otp-title" className="flex flex-1 flex-col">
          <fieldset disabled={locked} className="flex min-w-0 flex-1 flex-col">
            <StepHeader
              titleId="otp-title"
              label="Langkah 2: OTP"
              step={2}
              title={purpose === "login" ? "Verifikasi Masuk" : "Verifikasi Email"}
              description={
                email ? (
                  <>
                    Kode 6 digit telah dikirim ke <span className="font-mono text-slate-900">{maskEmail(email)}</span>.
                    Berlaku 10 menit.
                  </>
                ) : (
                  "Selesaikan langkah 1 dengan email dan password untuk menerima kode 6 digit."
                )
              }
            />

            <fieldset>
              <legend className="mb-3 text-base font-medium text-slate-800 sm:text-lg">Kode OTP</legend>
              <div className="grid grid-cols-6 gap-2 sm:gap-3">
                {digits.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-digit-${i}`}
                    ref={(el) => {
                      inputs.current[i] = el;
                    }}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    inputMode="numeric"
                    autoComplete={i === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    placeholder="•"
                    aria-label={`Digit ${i + 1} dari ${LENGTH}`}
                    aria-invalid={verify.isError}
                    className={cn(
                      "h-16 w-full rounded-2xl border bg-white text-center text-2xl font-semibold text-slate-900 outline-none transition sm:h-20 sm:text-3xl",
                      "placeholder:text-base placeholder:text-slate-300",
                      "focus:border-2 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-50",
                      verify.isError ? "border-amber-400" : "border-slate-200",
                    )}
                  />
                ))}
              </div>
            </fieldset>

            <div
              className="mt-6 flex h-17 items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 text-base text-slate-600 sm:text-lg"
              aria-live="polite"
            >
              <span className="flex items-center gap-3">
                <Clock className="size-5" aria-hidden />
                {canResend ? "Kode belum masuk?" : "Kirim ulang kode"}
              </span>
              {!locked && seconds > 0 && (
                <span className="rounded-md bg-slate-200/70 px-3 py-1 font-mono text-base">{seconds} dtk</span>
              )}
            </div>

            <div className="mt-6">
              <FormAlert alert={alert} />
            </div>

            <div className="flex-1" />

            <Button
              type="submit"
              size="lg"
              className="mt-6 w-full"
              disabled={code.length !== LENGTH}
              loading={verify.isPending}
              loadingText="Memverifikasi..."
            >
              Verifikasi
              <BadgeCheck className="size-6" aria-hidden />
            </Button>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg text-base text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:text-lg"
              >
                <ArrowLeft className="size-5" aria-hidden />
                Kembali
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend}
                className="min-h-11 rounded-lg text-base font-semibold text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:text-slate-400 sm:text-lg"
              >
                {resend.isPending ? "Mengirim..." : "Kirim ulang kode"}
              </button>
            </div>
          </fieldset>
        </form>
      </AuthCard>
    </motion.div>
  );
}