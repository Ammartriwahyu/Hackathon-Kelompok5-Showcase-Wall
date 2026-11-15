"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage, getErrorStatus, getFieldErrors } from "@/lib/axios";
import { isFirebaseEnabled } from "@/lib/firebase";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { loginSchema, type LoginInput } from "../schemas/auth.schema";
import { useFinishLogin, useGuestRedirect, useLoginMutation } from "../hooks/useAuthMutations";
import { AuthCard, AuthDivider, FormAlert, PasswordToggle, StatusLine, StepHeader, type FormAlertData } from "./AuthParts";
import { OAuthButton } from "./OAuthButton";
import { OtpCodeForm } from "./OtpCodeForm";

type OtpState = { email: string; open: boolean; attempt: number } | null;

export function LoginForm() {
  useGuestRedirect();
  const [otp, setOtp] = useState<OtpState>(null);
  const [showPassword, setShowPassword] = useState(false);
  const login = useLoginMutation();
  const finish = useFinishLogin();
  const {
    register,
    handleSubmit,
    resetField,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  const onSubmit = handleSubmit((values) =>
    login.mutate(values, {
      onSuccess: (session) => {
        resetField("password");
        if (session) {
          finish(session);
          return;
        }
        setOtp((prev) => ({ email: values.email, open: true, attempt: (prev?.attempt ?? 0) + 1 }));
      },
      onError: (err) => {
        const fields = getFieldErrors(err);
        if (fields?.email) setError("email", { message: fields.email });
        if (fields?.password) setError("password", { message: fields.password });
      },
    }),
  );

  const status = getErrorStatus(login.error);
  const hasFieldErrors = status === 422 && Boolean(getFieldErrors(login.error));
  const alert: FormAlertData =
    !login.isError || hasFieldErrors
      ? null
      : status === 401
        ? { variant: "error", title: "Email atau password salah", description: "Pastikan kredensial terdaftar pada sistem BCC." }
        : status === 403
          ? { variant: "warning", title: "Email belum diverifikasi", description: getErrorMessage(login.error, "Silakan selesaikan verifikasi registrasi terlebih dahulu.") }
          : status === 429
            ? { variant: "error", title: "Terlalu banyak permintaan", description: "Coba lagi nanti." }
            : { variant: "error", title: "Gagal masuk", description: getErrorMessage(login.error) };

  return (
    <>
      <AuthCard>
        <form onSubmit={onSubmit} noValidate aria-labelledby="login-title">
          <StepHeader
            titleId="login-title"
            label="Langkah 1"
            step={1}
            title="Masuk ke Akun"
            description="Pilih salah satu metode masuk yang tersedia"
          />

          {isFirebaseEnabled && (
            <>
              <OAuthButton label="Lanjutkan dengan Google" />
              <AuthDivider text="atau masuk dengan email" />
            </>
          )}

          <FormAlert alert={alert} />

          <div className="space-y-5">
            <Input
              id="login-email"
              type="email"
              label="Email"
              hint="Gunakan email aktif"
              autoComplete="email"
              placeholder="nama@email.com"
              icon={<Mail className="size-5" />}
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              label="Password"
              hint={
                <button
                  type="button"
                  onClick={() => toast.info("Reset password belum tersedia. Hubungi Admin BCC.")}
                  className="rounded font-medium text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Lupa password?
                </button>
              }
              autoComplete="current-password"
              icon={<Lock className="size-5" />}
              trailing={<PasswordToggle visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />}
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          <div className="pt-8">
            <Button type="submit" className="w-full" disabled={login.isPending}>
              Masuk
              <ArrowRight className="size-5" aria-hidden />
            </Button>
            <StatusLine show={login.isPending} label="Status" value="Memproses..." boxed />
            <p className="mt-6 text-center text-sm text-muted">
              Belum punya akun?{" "}
              <Link href="/register" className="font-semibold text-primary hover:text-primary-hover">
                Daftar
              </Link>
            </p>
          </div>
        </form>
      </AuthCard>

      {otp && (
        <OtpCodeForm
          key={otp.attempt}
          open={otp.open}
          email={otp.email}
          purpose="login"
          onClose={() => setOtp((prev) => (prev ? { ...prev, open: false } : prev))}
        />
      )}
    </>
  );
}