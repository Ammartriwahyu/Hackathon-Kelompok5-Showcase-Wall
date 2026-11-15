"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage, getErrorStatus } from "@/lib/axios";
import { isFirebaseEnabled } from "@/lib/firebase";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { loginSchema, type LoginInput } from "../schemas/auth.schema";
import { useFinishLogin, useLoginMutation } from "../hooks/useAuthMutations";
import { AuthCard, AuthDivider, FormAlert, PasswordToggle, StatusLine, StepHeader, type FormAlertData } from "./AuthParts";
import { OAuthButton } from "./OAuthButton";

type LoginFormProps = {
  onOtpRequired: (email: string) => void;
  onNotice: (message: string) => void;
};

export function LoginForm({ onOtpRequired, onNotice }: LoginFormProps) {
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
        ? { variant: "error", title: "Terlalu banyak permintaan", description: "Coba lagi nanti." }
        : { variant: "error", title: "Gagal masuk", description: getErrorMessage(login.error) };

  return (
    <AuthCard>
      <form onSubmit={onSubmit} noValidate aria-labelledby="login-title" className="flex flex-1 flex-col">
        <StepHeader
          titleId="login-title"
          label="Langkah 1"
          step={1}
          title="Masuk ke Akun"
          description="Pilih salah satu metode masuk yang tersedia"
        />

        {isFirebaseEnabled && (
          <>
            <OAuthButton
              label="Lanjutkan dengan Google"
              onCancelled={() => onNotice("Login dengan Google dibatalkan oleh pengguna.")}
            />
            <AuthDivider text="atau masuk dengan email" />
          </>
        )}

        <FormAlert alert={alert} />

        <div className="space-y-7">
          <Input
            id="login-email"
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
            id="login-password"
            type={showPassword ? "text" : "password"}
            inputSize="lg"
            label="Password"
            hint={
              <button
                type="button"
                onClick={() => toast.info("Reset password belum tersedia. Hubungi Admin BCC.")}
                className="rounded font-medium text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Lupa password?
              </button>
            }
            autoComplete="current-password"
            icon={<Lock className="size-6" />}
            trailing={<PasswordToggle visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />}
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <div className="mt-auto pt-12">
          <Button type="submit" size="lg" className="w-full" disabled={login.isPending}>
            Masuk
            <ArrowRight className="size-6" aria-hidden />
          </Button>
          <StatusLine show={login.isPending} label="Status" value="Memproses..." boxed />
          <p className="mt-8 text-center text-base text-slate-600 sm:text-lg">
            Belum punya akun?{" "}
            <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Daftar
            </Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
}