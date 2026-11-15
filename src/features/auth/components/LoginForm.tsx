"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { getErrorMessage, getErrorStatus } from "@/lib/axios";
import { isFirebaseEnabled } from "@/lib/firebase";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { loginSchema, type LoginInput } from "../schemas/auth.schema";
import { useFinishLogin, useGuestRedirect, useLoginMutation } from "../hooks/useAuthMutations";
import { AuthDivider, AuthSteps, FormAlert, PasswordToggle, StepHeader, type FormAlertData } from "./AuthParts";
import { OAuthButton } from "./OAuthButton";
import { OtpCodeForm } from "./OtpCodeForm";

export function LoginForm() {
  useGuestRedirect();
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");

  return (
    <AuthSteps
      step={step}
      credentials={
        <CredentialsStep
          onOtpRequired={(value) => {
            setEmail(value);
            setStep("otp");
          }}
        />
      }
      otp={<OtpCodeForm email={email} purpose="login" onBack={() => setStep("credentials")} />}
    />
  );
}

function CredentialsStep({ onOtpRequired }: { onOtpRequired: (email: string) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const login = useLoginMutation();
  const finish = useFinishLogin();
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  const onSubmit = handleSubmit((values) =>
    login.mutate(values, {
      onSuccess: (session) => {
        resetField("password"); // password tidak disimpan setelah langkah 1
        if (session) finish(session);
        else onOtpRequired(values.email);
      },
    }),
  );

  const status = getErrorStatus(login.error);
  const alert: FormAlertData = !login.isError
    ? null
    : status === 401
      ? { variant: "error", title: "Email atau password salah", description: "Pastikan kredensial terdaftar pada sistem BCC." }
      : status === 429
        ? { variant: "error", title: "Terlalu banyak percobaan", description: "Coba lagi nanti." }
        : { variant: "error", title: "Gagal masuk", description: getErrorMessage(login.error) };

  return (
    <form onSubmit={onSubmit} noValidate>
      <StepHeader label="Langkah 1" step={1} title="Masuk ke Akun" description="Pilih salah satu metode masuk yang tersedia" />

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
          autoComplete="current-password"
          icon={<Lock className="size-5" />}
          trailing={<PasswordToggle visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />}
          error={errors.password?.message}
          {...register("password")}
        />
      </div>

      <Button type="submit" className="mt-8 w-full" loading={login.isPending} loadingText="Memproses...">
        Masuk
        <ArrowRight className="size-5" aria-hidden />
      </Button>

      <p className="mt-6 text-center text-sm text-slate-600">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
          Daftar
        </Link>
      </p>
    </form>
  );
}