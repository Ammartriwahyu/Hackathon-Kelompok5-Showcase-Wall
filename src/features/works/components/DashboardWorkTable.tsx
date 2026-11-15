"use client";

import { motion } from "framer-motion";
import {
  Eye,
  FolderOpen,
  ImageOff,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Alert } from "@/shared/components/ui/Alert";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useAuthStore } from "@/shared/stores/useAuthStore";
import type { ManagedWork } from "@/shared/types/api";
import { useDashboardWorks } from "../hooks/useDashboardWorks";
import {
  useDashboardStore,
  type DashboardStatusFilter,
} from "../stores/useDashboardStore";
import { AdminWorkActions } from "./AdminWorkActions";

const STATUS_TABS: { value: DashboardStatusFilter; label: string }[] = [
  { value: "ALL", label: "Semua" },
  { value: "Draft", label: "Draft" },
  { value: "Published", label: "Published" },
  { value: "Unpublished", label: "Unpublished" },
];

const STATUS_BADGE_VARIANT: Record<
  ManagedWork["status"],
  "neutral" | "success" | "warning"
> = {
  Draft: "neutral",
  Published: "success",
  Unpublished: "warning",
};

export function DashboardWorkTable() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "Admin";

  const searchQuery = useDashboardStore((s) => s.searchQuery);
  const statusFilter = useDashboardStore((s) => s.statusFilter);
  const setSearchQuery = useDashboardStore((s) => s.setSearchQuery);
  const setStatusFilter = useDashboardStore((s) => s.setStatusFilter);
  const setPreviewWork = useDashboardStore((s) => s.setPreviewWork);
  const setDeleteTargetWork = useDashboardStore((s) => s.setDeleteTargetWork);
  const resetFilters = useDashboardStore((s) => s.resetFilters);

  const { data, isLoading, isError, refetch } = useDashboardWorks();
  const works = data?.data ?? [];
  const hasActiveFilter = Boolean(searchQuery.trim() || statusFilter !== "ALL");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-xs">
      {/* Toolbar: Search + Status Filter Tabs */}
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isAdmin
                ? "Cari judul atau nama pemilik..."
                : "Cari berdasarkan judul karya..."
            }
            aria-label="Cari karya"
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-3.5 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div
          role="tablist"
          aria-label="Filter status karya"
          className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-100 p-1"
        >
          {STATUS_TABS.map((tab) => {
            const active = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setStatusFilter(tab.value)}
                className={`relative rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active ? "text-indigo-700" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="dashboard-status-tab"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute inset-0 rounded-lg bg-white shadow-xs"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Loading State */}
      {isLoading && (
        <div className="space-y-3 p-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* 2. Error State */}
      {!isLoading && isError && (
        <div className="flex flex-col items-center justify-center gap-4 p-10 text-center">
          <Alert
            variant="error"
            title="Gagal memuat daftar karya"
            description="Periksa koneksi atau coba muat ulang data dari server."
            className="max-w-md text-left"
          />
          <Button variant="outline" onClick={() => refetch()} className="h-10 px-4 text-sm">
            <RefreshCw className="size-4" aria-hidden />
            <span>Coba Lagi</span>
          </Button>
        </div>
      )}

      {/* 3. Empty State */}
      {!isLoading && !isError && works.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <FolderOpen className="size-6" aria-hidden />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {hasActiveFilter ? "Tidak ada karya yang cocok" : "Belum ada karya"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {hasActiveFilter
                ? "Coba ubah kata kunci pencarian atau filter status."
                : "Mulai buat karya pertamamu dan tampilkan di BCC Showcase Wall."}
            </p>
          </div>
          {hasActiveFilter ? (
            <Button variant="outline" onClick={resetFilters} className="mt-1 h-10 text-sm">
              Reset Filter
            </Button>
          ) : (
            <Link
              href="/dashboard/works/new"
              className="mt-1 inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Plus className="size-4" aria-hidden />
              <span>Buat Karya Baru</span>
            </Link>
          )}
        </div>
      )}

      {/* 4. Success State */}
      {!isLoading && !isError && works.length > 0 && (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3.5">Cover</th>
                  <th className="px-5 py-3.5">Judul</th>
                  {isAdmin && <th className="px-5 py-3.5">Pemilik</th>}
                  <th className="px-5 py-3.5">Kategori</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Unggulan</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {works.map((work) => (
                  <tr key={work.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-5 py-3.5">
                      <div className="aspect-[16/9] w-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                        {work.cover_url ? (
                          <img
                            src={work.cover_url}
                            alt={work.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-400">
                            <ImageOff className="size-4" aria-hidden />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="max-w-xs px-5 py-3.5">
                      <p className="truncate font-semibold text-slate-900">{work.title}</p>
                      <p className="truncate text-xs text-slate-500">{work.summary}</p>
                    </td>
                    {isAdmin && (
                      <td className="px-5 py-3.5 text-slate-700">{work.owner_name}</td>
                    )}
                    <td className="px-5 py-3.5">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                        {work.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={STATUS_BADGE_VARIANT[work.status]}>
                        {work.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      {work.is_featured ? (
                        <Badge variant="primary">
                          <Star className="size-3 fill-indigo-600 text-indigo-600" aria-hidden />
                          Unggulan
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewWork(work)}
                          title="Lihat Preview"
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                        >
                          <Eye className="size-3.5" aria-hidden />
                          <span>Preview</span>
                        </button>

                        {isAdmin && <AdminWorkActions work={work} />}

                        <Link
                          href={`/dashboard/works/${work.id}/edit`}
                          title="Edit Karya"
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                        >
                          <Pencil className="size-3.5" aria-hidden />
                          <span>Edit</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => setDeleteTargetWork(work)}
                          title="Hapus Karya"
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          <Trash2 className="size-3.5" aria-hidden />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="divide-y divide-slate-100 md:hidden">
            {works.map((work) => (
              <div key={work.id} className="space-y-3 p-4">
                <div className="flex gap-3">
                  <div className="aspect-[16/9] w-24 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                    {work.cover_url ? (
                      <img
                        src={work.cover_url}
                        alt={work.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <ImageOff className="size-4" aria-hidden />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant={STATUS_BADGE_VARIANT[work.status]}>
                        {work.status}
                      </Badge>
                      {work.is_featured && <Badge variant="primary">Unggulan</Badge>}
                    </div>
                    <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                      {work.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {work.category}
                      {isAdmin ? ` • ${work.owner_name}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewWork(work)}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700"
                  >
                    <Eye className="size-3.5" aria-hidden />
                    <span>Preview</span>
                  </button>
                  {isAdmin && <AdminWorkActions work={work} />}
                  <Link
                    href={`/dashboard/works/${work.id}/edit`}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700"
                  >
                    <Pencil className="size-3.5" aria-hidden />
                    <span>Edit</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteTargetWork(work)}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 text-xs font-medium text-red-600"
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
