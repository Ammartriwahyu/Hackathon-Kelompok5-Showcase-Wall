"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { getErrorMessage, getErrorStatus, getFieldErrors } from "@/lib/axios";
import { isFirebaseEnabled } from "@/lib/firebase";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { registerSchema, type RegisterInput } from "../schemas/auth.schema";
import { useGuestRedirect, useRegisterMutation } from "../hooks/useAuthMutations";
import { AuthCard, AuthDivider, FormAlert, PasswordToggle, StatusLine, StepHeader, type FormAlertData } from "./AuthParts";
import { OAuthButton } from "./OAuthButton";
import { OtpCodeForm } from "./OtpCodeForm";

const FIELDS = ["name", "email", "password"] as const;

type OtpState = { email: string; open: boolean; attempt: number } | null;

export function RegisterForm() {
  useGuestRedirect();
  const [otp, setOtp] = useState<OtpState>(null);
  const [showPassword, setShowPassword] = useState(false);
  const registerMutation = useRegisterMutation();
  const {
    register,
    handleSubmit,
    resetField,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) =>
    registerMutation.mutate(values, {
      onSuccess: () => {
        resetField("password");
        setOtp((prev) => ({ email: values.email, open: true, attempt: (prev?.attempt ?? 0) + 1 }));
      },
      onError: (err) => {
        if (getErrorStatus(err) === 409) setError("email", { message: "Email sudah terdaftar" });
        const fields = getFieldErrors(err);
        if (fields) {
          for (const key of FIELDS) if (fields[key]) setError(key, { message: fields[key] });
        }
      },
    }),
  );

  const status = getErrorStatus(registerMutation.error);
  const alert: FormAlertData =
    !registerMutation.isError || status === 409 || status === 422
      ? null
      : status === 429
        ? { variant: "error", title: "Terlalu banyak permintaan", description: "Coba lagi nanti." }
        : { variant: "error", title: "Gagal membuat akun", description: getErrorMessage(registerMutation.error) };

  return (
    <>
      <AuthCard>
        <form onSubmit={onSubmit} noValidate aria-labelledby="register-title">
          <StepHeader
            titleId="register-title"
            label="Langkah 1"
            step={1}
            title="Buat Akun"
            description="Akun baru otomatis menjadi Kontributor"
          />

          {isFirebaseEnabled && (
            <>
              <OAuthButton label="Daftar dengan Google" />
              <AuthDivider text="atau daftar dengan email" />
            </>
          )}

          <FormAlert alert={alert} />

          <div className="space-y-5">
            <Input
              id="register-name"
              label="Nama"
              autoComplete="name"
              placeholder="Nama lengkap"
              icon={<User className="size-5" />}
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              id="register-email"
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
              id="register-password"
              type={showPassword ? "text" : "password"}
              label="Password"
              hint="8–72 karakter"
              autoComplete="new-password"
              icon={<Lock className="size-5" />}
              trailing={<PasswordToggle visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />}
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          <div className="pt-8">
            <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
              Daftar
              <ArrowRight className="size-5" aria-hidden />
            </Button>
            <StatusLine show={registerMutation.isPending} label="Status" value="Memproses..." boxed />
            <p className="mt-6 text-center text-sm text-muted">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-semibold text-primary hover:text-primary-hover">
                Masuk
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
          purpose="register"
          onClose={() => setOtp((prev) => (prev ? { ...prev, open: false } : prev))}
        />
      )}
    </>
  );
}