import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Mengubah URL media relatif dari backend (mis. `/api/v1/media/works/:id/cover`)
 * menjadi URL lengkap dengan origin `NEXT_PUBLIC_API_URL`, sambil menjaga URL absolut,
 * `blob:`, dan `data:` tetap utuh.
 */
export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^(https?:|blob:|data:|\/\/)/.test(trimmed)) return trimmed;
  if (!trimmed.startsWith("/")) return trimmed;

  const base = (process.env.NEXT_PUBLIC_API_URL ?? "").trim();
  if (!/^https?:/.test(base)) return trimmed;

  try {
    return new URL(trimmed, base.endsWith("/") ? base : `${base}/`).toString();
  } catch {
    return trimmed;
  }
}