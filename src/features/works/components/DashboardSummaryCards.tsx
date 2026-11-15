"use client";

import { Eye, EyeOff, FileEdit, RefreshCw, Star } from "lucide-react";
import { Alert } from "@/shared/components/ui/Alert";
import { Button } from "@/shared/components/ui/Button";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useAuthStore } from "@/shared/stores/useAuthStore";
import { useDashboardSummary } from "../hooks/useDashboardWorks";

export function DashboardSummaryCards() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "Admin";
  const { data, isLoading, isError, refetch } = useDashboardSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-red-200 bg-red-50/70 p-4 sm:flex-row sm:items-center">
        <Alert
          variant="error"
          title="Gagal memuat ringkasan"
          description="Statistik dashboard tidak dapat diambil dari server."
          className="border-0 bg-transparent p-0"
        />
        <Button variant="outline" onClick={() => refetch()} className="h-9 px-3 text-xs">
          <RefreshCw className="size-3.5" aria-hidden />
          <span>Coba Lagi</span>
        </Button>
      </div>
    );
  }

  const cards = [
    {
      label: "Draft",
      value: data.total_draft,
      icon: FileEdit,
      tone: "bg-brand-100/60 text-brand-700",
      hint: isAdmin ? "Seluruh karya draft" : "Karya draft milikmu",
    },
    {
      label: "Published",
      value: data.total_published,
      icon: Eye,
      tone: "bg-emerald-50 text-emerald-700",
      hint: isAdmin ? "Tayang di galeri" : "Karyamu yang tayang",
    },
    {
      label: "Unpublished",
      value: data.total_unpublished,
      icon: EyeOff,
      tone: "bg-amber-50 text-amber-700",
      hint: "Disembunyikan sementara",
    },
    {
      label: "Unggulan",
      value: data.total_featured,
      icon: Star,
      tone: "bg-primary-soft text-brand-600",
      hint: "Maksimal 1 karya sorotan",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, tone, hint }) => (
        <div
          key={label}
          className="rounded-2xl border border-border bg-white p-5 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">
              {label}
            </span>
            <span className={`inline-flex size-8 items-center justify-center rounded-lg ${tone}`}>
              <Icon className="size-4" aria-hidden />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          <p className="mt-1 text-xs text-brand-500">{hint}</p>
        </div>
      ))}
    </div>
  );
}
