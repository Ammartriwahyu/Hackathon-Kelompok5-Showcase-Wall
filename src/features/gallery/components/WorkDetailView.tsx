"use client";

import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, FileQuestion, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Alert } from "@/shared/components/ui/Alert";
import { Button } from "@/shared/components/ui/Button";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { WorkDetailContent } from "@/shared/components/work/WorkDetailContent";
import { useWorkDetail } from "../hooks/useWorkDetail";

type WorkDetailViewProps = {
  workId: string;
};

export function WorkDetailView({ workId }: WorkDetailViewProps) {
  const { data, isLoading, isError, error, refetch } = useWorkDetail(workId);

  const isNotFound =
    data === null ||
    (isError && axios.isAxiosError(error) && error.response?.status === 404);

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600"
        >
          <ArrowLeft className="size-4" aria-hidden />
          <span>Kembali ke Galeri</span>
        </Link>
      </div>

      {/* 1. Loading State */}
      {isLoading && (
        <div className="space-y-6">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <Skeleton className="h-64 rounded-xl lg:col-span-8" />
            <Skeleton className="h-64 rounded-xl lg:col-span-4" />
          </div>
        </div>
      )}

      {/* 2. Not Found / Unpublished State (404 or WebSocket unpublished/deleted) */}
      {!isLoading && isNotFound && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-xs">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <FileQuestion className="size-7" aria-hidden />
          </div>
          <div className="max-w-md">
            <h1 className="text-lg font-bold text-slate-900">
              Karya tidak ditemukan atau belum dipublikasikan
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Karya mungkin belum diterbitkan, telah disembunyikan oleh Admin, atau sudah dihapus.
            </p>
          </div>
          <Link
            href="/"
            className="mt-1 inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <ArrowLeft className="size-4" aria-hidden />
            <span>Kembali ke Galeri</span>
          </Link>
        </div>
      )}

      {/* 3. Transient Error State */}
      {!isLoading && isError && !isNotFound && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <Alert
            variant="error"
            title="Gagal memuat detail karya"
            description="Terjadi kendala saat mengambil data karya dari server."
            className="max-w-md text-left"
          />
          <Button variant="outline" onClick={() => refetch()} className="h-10 text-sm">
            <RefreshCw className="size-4" aria-hidden />
            <span>Coba Lagi</span>
          </Button>
        </div>
      )}

      {/* 4. Success State */}
      {!isLoading && !isNotFound && !isError && data && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <WorkDetailContent work={data} />
        </motion.div>
      )}
    </div>
  );
}
