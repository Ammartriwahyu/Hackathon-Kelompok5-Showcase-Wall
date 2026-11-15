import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  outline: "border border-border bg-white text-foreground hover:bg-brand-100/40",
  ghost: "text-muted hover:bg-brand-100/60 hover:text-foreground",
} as const;

const SIZES = {
  md: "h-12 rounded-xl px-5 text-base",
  lg: "h-17 rounded-2xl px-6 text-xl",
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  loading?: boolean;
  loadingText?: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  loadingText,
  type = "button",
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-60",
        SIZES[size],
        VARIANTS[variant],
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="size-5 animate-spin" aria-hidden />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </button>
  );
}