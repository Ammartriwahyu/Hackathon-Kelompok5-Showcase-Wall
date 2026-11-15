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
import { AuthDivider, AuthSteps, FormAlert, PasswordToggle, StepHeader, type FormAlertData } from "./AuthParts";
import { OAuthButton } from "./OAuthButton";
import { OtpCodeForm } from "./OtpCodeForm";

const FIELDS = ["name", "email", "password"] as const;

export function RegisterForm() {
  useGuestRedirect();
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");

  return (
    <AuthSteps
      step={step}
      credentials={
        <RegisterStep
          onOtpRequired={(value) => {
            setEmail(value);
            setStep("otp");
          }}
        />
      }
      otp={<OtpCodeForm email={email} purpose="register" onBack={() => setStep("credentials")} />}
    />
  );
}

function RegisterStep({ onOtpRequired }: { onOtpRequired: (email: string) => void }) {
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
    <form onSubmit={onSubmit} noValidate>
      <StepHeader label="Langkah 1" step={1} title="Buat Akun" description="Akun baru otomatis menjadi Kontributor" />

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

      <Button type="submit" className="mt-8 w-full" loading={registerMutation.isPending} loadingText="Memproses...">
        Daftar
        <ArrowRight className="size-5" aria-hidden />
      </Button>

      <p className="mt-6 text-center text-sm text-slate-600">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
          Masuk
        </Link>
      </p>
    </form>
  );
}