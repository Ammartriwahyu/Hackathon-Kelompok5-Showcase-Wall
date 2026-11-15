import { CircleAlert, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertProps = {
  variant?: "error" | "warning";
  title: string;
  description?: string;
  className?: string;
};

export function Alert({ variant = "error", title, description, className }: AlertProps) {
  const Icon = variant === "error" ? CircleAlert : TriangleAlert;
  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-xl border p-3 text-sm",
        variant === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-amber-200 bg-amber-50 text-amber-800",
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>
        <p className="font-medium">{title}</p>
        {description && <p className="mt-0.5 text-xs opacity-90">{description}</p>}
      </div>
    </div>
  );
}