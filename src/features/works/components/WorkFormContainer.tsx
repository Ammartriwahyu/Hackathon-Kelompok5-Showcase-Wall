"use client";

import { RefreshCw } from "lucide-react";
import Link from "next/link";
import { Alert } from "@/shared/components/ui/Alert";
import { Button } from "@/shared/components/ui/Button";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useManagedWork } from "../hooks/useDashboardWorks";
import { WorkForm } from "./WorkForm";

type WorkFormContainerProps = {
  workId?: string;
};

export function WorkFormContainer({ workId }: WorkFormContainerProps) {
  const isEdit = Boolean(workId);
  const { data, isLoading, isError, refetch } = useManagedWork(workId ?? "");

  if (!isEdit) {
    return <WorkForm />;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <Skeleton className="h-[520px] rounded-2xl xl:col-span-7" />
        <Skeleton className="h-[360px] rounded-2xl xl:col-span-5" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-red-200 bg-white p-6">
        <Alert
          variant="error"
          title="Karya tidak dapat dimuat"
          description="Pastikan karya tersedia dan kamu memiliki hak akses untuk mengeditnya."
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()} className="h-10 text-sm">
            <RefreshCw className="size-4" aria-hidden />
            <span>Coba Lagi</span>
          </Button>
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <WorkForm initialData={data} />;
}
