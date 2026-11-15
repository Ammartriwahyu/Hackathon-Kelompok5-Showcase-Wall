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
import { useRegisterMutation } from "../hooks/useAuthMutations";
import { AuthCard, AuthDivider, FormAlert, PasswordToggle, StatusLine, StepHeader, type FormAlertData } from "./AuthParts";
import { OAuthButton } from "./OAuthButton";

const FIELDS = ["name", "email", "password"] as const;

type RegisterFormProps = {
  onOtpRequired: (email: string) => void;
  onNotice: (message: string) => void;
};

export function RegisterForm({ onOtpRequired, onNotice }: RegisterFormProps) {
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
        onOtpRequired(values.email);
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
    <AuthCard>
      <form onSubmit={onSubmit} noValidate aria-labelledby="register-title" className="flex flex-1 flex-col">
        <StepHeader
          titleId="register-title"
          label="Langkah 1"
          step={1}
          title="Buat Akun"
          description="Akun baru otomatis menjadi Kontributor"
        />

        {isFirebaseEnabled && (
          <>
            <OAuthButton
              label="Daftar dengan Google"
              onCancelled={() => onNotice("Login dengan Google dibatalkan oleh pengguna.")}
            />
            <AuthDivider text="atau daftar dengan email" />
          </>
        )}

        <FormAlert alert={alert} />

        <div className="space-y-7">
          <Input
            id="register-name"
            inputSize="lg"
            label="Nama"
            autoComplete="name"
            placeholder="Nama lengkap"
            icon={<User className="size-6" />}
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            id="register-email"
            type="email"
            inputSize="lg"
            label="Email"
            hint="Gunakan email aktif"
            autoComplete="email"
            placeholder="nama@email.com"
            icon={<Mail className="size-6" />}
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            id="register-password"
            type={showPassword ? "text" : "password"}
            inputSize="lg"
            label="Password"
            hint="8–72 karakter"
            autoComplete="new-password"
            icon={<Lock className="size-6" />}
            trailing={<PasswordToggle visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />}
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <div className="mt-auto pt-12">
          <Button type="submit" size="lg" className="w-full" disabled={registerMutation.isPending}>
            Daftar
            <ArrowRight className="size-6" aria-hidden />
          </Button>
          <StatusLine show={registerMutation.isPending} label="Status" value="Memproses..." boxed />
          <p className="mt-8 text-center text-base text-slate-600 sm:text-lg">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Masuk
            </Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
}