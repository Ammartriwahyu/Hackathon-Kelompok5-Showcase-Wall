import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: ReactNode;
  icon?: ReactNode;
  trailing?: ReactNode;
  error?: string;
  ref?: Ref<HTMLInputElement>;
};

export function Input({ id, label, hint, icon, trailing, error, className, ref, ...props }: InputProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-slate-800">
          {label}
        </label>
        {hint && <span className="text-xs text-slate-500">{hint}</span>}
      </div>
      <div
        className={cn(
          "flex h-12 items-center gap-3 rounded-xl border bg-white px-4 transition-colors focus-within:ring-2",
          error
            ? "border-red-400 focus-within:ring-red-100"
            : "border-slate-200 focus-within:border-indigo-500 focus-within:ring-indigo-100",
        )}
      >
        {icon && (
          <span className="text-slate-400" aria-hidden>
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className="h-full w-full min-w-0 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
          {...props}
        />
        {trailing}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}