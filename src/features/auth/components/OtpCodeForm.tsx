"use client";

import { useEffect, useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from "react";
import { ArrowLeft, BadgeCheck, Clock } from "lucide-react";
import { getErrorStatus } from "@/lib/axios";
import { Button } from "@/shared/components/ui/Button";
import { cn } from "@/lib/utils";
import type { OtpPurpose } from "../schemas/auth.schema";
import { useResendOtpMutation, useVerifyOtpMutation } from "../hooks/useAuthMutations";
import { FormAlert, StepHeader, type FormAlertData } from "./AuthParts";

const LENGTH = 6;
const RESEND_SECONDS = 60;
const emptyDigits = () => Array<string>(LENGTH).fill("");

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  return domain ? `${name.slice(0, 1)}***@${domain}` : email;
}

type OtpCodeFormProps = { email: string; purpose: OtpPurpose; onBack: () => void };

export function OtpCodeForm({ email, purpose, onBack }: OtpCodeFormProps) {
  const [digits, setDigits] = useState<string[]>(emptyDigits);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const verify = useVerifyOtpMutation();
  const resend = useResendOtpMutation();
  const code = digits.join("");

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

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
    if (code.length === LENGTH) verify.mutate({ email, code, purpose });
  };

  const handleResend = () =>
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

  const alert: FormAlertData = verify.isError
    ? getErrorStatus(verify.error) === 429
      ? { variant: "warning", title: "Terlalu banyak percobaan. Minta kode baru." }
      : { variant: "warning", title: "Kode salah atau sudah kedaluwarsa. Periksa email terbaru." }
    : null;

  const canResend = seconds <= 0 && !resend.isPending;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StepHeader
        label="Langkah 2: OTP"
        step={2}
        title={purpose === "login" ? "Verifikasi Masuk" : "Verifikasi Email"}
        description={
          <>
            Kode 6 digit telah dikirim ke <span className="font-mono text-slate-800">{maskEmail(email)}</span>. Berlaku 10
            menit.
          </>
        }
      />

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-slate-800">Kode OTP</legend>
        <div className="grid grid-cols-6 gap-2 sm:gap-3">
          {digits.map((digit, i) => (
            <input
              key={i}
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
              aria-label={`Digit ${i + 1} dari ${LENGTH}`}
              aria-invalid={verify.isError}
              className={cn(
                "h-14 w-full rounded-xl border bg-white text-center text-xl font-semibold text-slate-900 outline-none transition",
                "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100",
                verify.isError ? "border-amber-400" : "border-slate-200",
              )}
            />
          ))}
        </div>
      </fieldset>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600" aria-live="polite">
        <span className="flex items-center gap-2">
          <Clock className="size-4" aria-hidden />
          {canResend ? "Kode belum masuk?" : "Kirim ulang kode"}
        </span>
        {seconds > 0 && <span className="rounded-md bg-slate-200/70 px-2 py-0.5 font-mono text-xs">{seconds} dtk</span>}
      </div>

      <div className="mt-4">
        <FormAlert alert={alert} />
      </div>

      <Button
        type="submit"
        className="mt-2 w-full"
        disabled={code.length !== LENGTH}
        loading={verify.isPending}
        loadingText="Memverifikasi..."
      >
        Verifikasi
        <BadgeCheck className="size-5" aria-hidden />
      </Button>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Kembali
        </button>
        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend}
          className="min-h-11 rounded-lg text-sm font-semibold text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:text-slate-400"
        >
          {resend.isPending ? "Mengirim..." : "Kirim ulang kode"}
        </button>
      </div>
    </form>
  );
}