import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary: "border-brand-200 bg-primary-soft text-brand-600",
  neutral: "border-border bg-brand-100/60 text-brand-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  danger: "border-red-200 bg-red-50 text-red-700",
} as const;

type BadgeProps = {
  variant?: keyof typeof VARIANTS;
  className?: string;
  children: ReactNode;
};

export function Badge({
  variant = "neutral",
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
