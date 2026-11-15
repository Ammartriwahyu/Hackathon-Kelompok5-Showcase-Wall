"use client";

import { AnimatePresence, motion } from "framer-motion";
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
import { cn, resolveMediaUrl } from "@/lib/utils";
import { Alert } from "@/shared/components/ui/Alert";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { Mascot } from "@/shared/components/ui/Mascot";
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

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const actionClass = cn(
  "inline-flex h-9 items-center gap-1 rounded-lg border border-border bg-white px-2.5 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100/40",
  focusRing,
);

const deleteClass = cn(
  "inline-flex h-9 items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50",
  focusRing,
);

function Cover({ work, className }: { work: ManagedWork; className: string }) {
  return (
    <div
      className={cn(
        "aspect-video shrink-0 overflow-hidden rounded-lg border border-border bg-brand-100/60",
        className,
      )}
    >
      {work.cover_url ? (
        <img
          src={resolveMediaUrl(work.cover_url)}
          alt={work.title}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-brand-400">
          <ImageOff className="size-4" aria-hidden />
        </div>
      )}
    </div>
  );
}

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

  const {
    data,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useDashboardWorks();
  const works = data?.pages.flatMap((page) => page.data) ?? [];
  const hasActiveFilter = Boolean(searchQuery.trim() || statusFilter !== "ALL");

  return (
    <section className="rounded-2xl border border-border bg-white shadow-xs">
      <div className="flex flex-col gap-4 border-b border-brand-100 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-brand-400"
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
            className="h-11 w-full rounded-xl border border-border bg-brand-100/30 pr-3.5 pl-10 text-sm text-foreground placeholder:text-brand-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div
          role="tablist"
          aria-label="Filter status karya"
          className="flex flex-wrap items-center gap-1 rounded-xl bg-brand-100/60 p-1"
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
                className={cn(
                  "relative min-h-9 rounded-lg px-3 text-xs font-semibold transition-colors",
                  focusRing,
                  active
                    ? "text-brand-700"
                    : "text-muted hover:text-foreground",
                )}
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

      {isLoading && (
        <div className="space-y-3 p-5" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <div className="flex flex-col items-center justify-center gap-4 p-10 text-center">
          <Alert
            variant="error"
            title="Gagal memuat daftar karya"
            description="Periksa koneksi atau coba muat ulang data dari server."
            className="max-w-md text-left"
          />
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="h-10 px-4 text-sm"
          >
            <RefreshCw className="size-4" aria-hidden />
            <span>Coba Lagi</span>
          </Button>
        </div>
      )}

      {!isLoading && !isError && works.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
          {hasActiveFilter ? (
            <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-100/60 text-brand-400">
              <FolderOpen className="size-6" aria-hidden />
            </div>
          ) : (
            <Mascot variant="excited" className="w-32" />
          )}
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {hasActiveFilter
                ? "Tidak ada karya yang cocok"
                : "Belum ada karya"}
            </h3>
            <p className="mt-1 text-sm text-brand-500">
              {hasActiveFilter
                ? "Coba ubah kata kunci pencarian atau filter status."
                : "Mulai buat karya pertamamu dan tampilkan di BCC Showcase Wall."}
            </p>
          </div>
          {hasActiveFilter ? (
            <Button
              variant="outline"
              onClick={resetFilters}
              className="mt-1 h-10 text-sm"
            >
              Reset Filter
            </Button>
          ) : (
            <Link
              href="/dashboard/works/new"
              className={cn(
                "mt-1 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover",
                focusRing,
              )}
            >
              <Plus className="size-4" aria-hidden />
              <span>Buat Karya Baru</span>
            </Link>
          )}
        </div>
      )}

      {!isLoading && !isError && works.length > 0 && (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-100 bg-brand-100/20 text-xs font-semibold uppercase tracking-wider text-brand-500">
                  <th scope="col" className="px-5 py-3.5">
                    Cover
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Judul
                  </th>
                  {isAdmin && (
                    <th scope="col" className="px-5 py-3.5">
                      Pemilik
                    </th>
                  )}
                  <th scope="col" className="px-5 py-3.5">
                    Kategori
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Unggulan
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100">
                <AnimatePresence initial={false}>
                  {works.map((work) => (
                    <motion.tr
                      key={work.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="transition-colors hover:bg-brand-100/20"
                    >
                      <td className="px-5 py-3.5">
                        <Cover work={work} className="w-20" />
                      </td>
                      <td className="max-w-xs px-5 py-3.5">
                        <p className="truncate font-semibold text-foreground">
                          {work.title}
                        </p>
                        <p className="truncate text-xs text-brand-500">
                          {work.summary}
                        </p>
                      </td>
                      {isAdmin && (
                        <td className="px-5 py-3.5 text-brand-700">
                          {work.owner_name}
                        </td>
                      )}
                      <td className="px-5 py-3.5 text-sm text-brand-700">
                        {work.category}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={STATUS_BADGE_VARIANT[work.status]}>
                          {work.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        {work.is_featured ? (
                          <Badge variant="primary">
                            <Star className="size-3 fill-current" aria-hidden />
                            Unggulan
                          </Badge>
                        ) : (
                          <span className="text-xs text-brand-400">-</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewWork(work)}
                            className={actionClass}
                          >
                            <Eye className="size-3.5" aria-hidden />
                            <span>Preview</span>
                          </button>
                          {isAdmin && <AdminWorkActions work={work} />}
                          <Link
                            href={`/dashboard/works/${work.id}/edit`}
                            className={actionClass}
                          >
                            <Pencil className="size-3.5" aria-hidden />
                            <span>Edit</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTargetWork(work)}
                            className={deleteClass}
                          >
                            <Trash2 className="size-3.5" aria-hidden />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <ul className="divide-y divide-brand-100 md:hidden">
            <AnimatePresence initial={false}>
              {works.map((work) => (
                <motion.li
                  key={work.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3 p-4"
                >
                  <div className="flex gap-3">
                    <Cover work={work} className="w-24" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant={STATUS_BADGE_VARIANT[work.status]}>
                          {work.status}
                        </Badge>
                        {work.is_featured && (
                          <Badge variant="primary">
                            <Star className="size-3 fill-current" aria-hidden />
                            Unggulan
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 truncate text-sm font-semibold text-foreground">
                        {work.title}
                      </p>
                      <p className="text-xs text-brand-500">
                        {work.category}
                        {isAdmin ? ` · ${work.owner_name}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPreviewWork(work)}
                      className={cn(actionClass, "h-10")}
                    >
                      <Eye className="size-3.5" aria-hidden />
                      <span>Preview</span>
                    </button>
                    {isAdmin && <AdminWorkActions work={work} />}
                    <Link
                      href={`/dashboard/works/${work.id}/edit`}
                      className={cn(actionClass, "h-10")}
                    >
                      <Pencil className="size-3.5" aria-hidden />
                      <span>Edit</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTargetWork(work)}
                      className={cn(deleteClass, "h-10")}
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                      <span>Hapus</span>
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {hasNextPage && (
            <div className="flex justify-center border-t border-brand-100 p-4">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                loading={isFetchingNextPage}
                loadingText="Memuat..."
                className="h-10 px-5 text-sm"
              >
                Muat lebih banyak
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
