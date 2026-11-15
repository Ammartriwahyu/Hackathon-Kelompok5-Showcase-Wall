import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

const SIZES = {
  md: { box: "h-12 rounded-xl px-4", input: "text-base", label: "text-sm", hint: "text-xs" },
  lg: { box: "h-17 rounded-2xl px-5", input: "text-xl", label: "text-lg", hint: "text-base" },
} as const;

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: ReactNode;
  icon?: ReactNode;
  trailing?: ReactNode;
  error?: string;
  inputSize?: keyof typeof SIZES;
  ref?: Ref<HTMLInputElement>;
};

export function Input({
  id,
  label,
  hint,
  icon,
  trailing,
  error,
  inputSize = "md",
  className,
  ref,
  ...props
}: InputProps) {
  const errorId = error ? `${id}-error` : undefined;
  const s = SIZES[inputSize];

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <label htmlFor={id} className={cn("font-medium text-brand-800", s.label)}>
          {label}
        </label>
        {hint && <span className={cn("text-brand-500", s.hint)}>{hint}</span>}
      </div>
      <div
        className={cn(
          "flex items-center gap-3 border bg-white transition-colors focus-within:ring-2",
          s.box,
          error
            ? "border-red-400 focus-within:ring-red-100"
            : "border-border focus-within:border-brand-400 focus-within:ring-brand-100",
        )}
      >
        {icon && (
          <span className="text-brand-400" aria-hidden>
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={cn(
            "h-full w-full min-w-0 bg-transparent text-foreground outline-none placeholder:text-brand-400",
            s.input,
          )}
          {...props}
        />
        {trailing}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-base text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}