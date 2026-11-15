import { z } from "zod";

export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 254;

const emailSchema = z
  .string()
  .trim()
  .max(MAX_EMAIL_LENGTH, `Email maksimal ${MAX_EMAIL_LENGTH} karakter`)
  .pipe(z.email("Format email tidak valid"));

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password wajib diisi"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter")
    .max(MAX_NAME_LENGTH, `Nama maksimal ${MAX_NAME_LENGTH} karakter`),
  email: emailSchema,
  password: z.string().min(8, "Password minimal 8 karakter").max(72, "Password maksimal 72 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type OtpPurpose = "login" | "register";