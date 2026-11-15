"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FolderSearch, RefreshCw } from "lucide-react";
import { Alert } from "@/shared/components/ui/Alert";
import { Button } from "@/shared/components/ui/Button";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { WorkCard } from "@/shared/components/work/WorkCard";
import { usePublicWorks } from "../hooks/usePublicWorks";
import { useGalleryStore } from "../stores/useGalleryStore";

export function PublicWorkGrid() {
  const searchQuery = useGalleryStore((s) => s.searchQuery);
  const selectedCategory = useGalleryStore((s) => s.selectedCategory);
  const selectedTech = useGalleryStore((s) => s.selectedTech);
  const resetFilters = useGalleryStore((s) => s.resetFilters);

  const {
    data,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePublicWorks();

  const works = data?.pages.flatMap((page) => page.data) ?? [];
  const hasActiveFilter = Boolean(
    searchQuery.trim() || selectedCategory || selectedTech,
  );

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-border bg-white"
          >
            <Skeleton className="aspect-[16/9] w-full rounded-none" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-1.5 pt-2">
                <Skeleton className="h-5 w-14" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Error State
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-white p-10 text-center">
        <Alert
          variant="error"
          title="Gagal memuat galeri karya"
          description="Terjadi kendala saat mengambil data karya dari server."
          className="max-w-md text-left"
        />
        <Button variant="outline" onClick={() => refetch()} className="h-10 text-sm">
          <RefreshCw className="size-4" aria-hidden />
          <span>Coba Lagi</span>
        </Button>
      </div>
    );
  }

  // 3. Empty State
  if (works.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-white px-6 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-100/60 text-brand-400">
          <FolderSearch className="size-6" aria-hidden />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            {hasActiveFilter
              ? "Tidak ada karya yang cocok"
              : "Belum ada karya yang dipublikasikan"}
          </h2>
          <p className="mt-1 text-sm text-brand-500">
            {hasActiveFilter
              ? "Coba ubah kata kunci pencarian atau pilihan filter."
              : "Karya yang telah disetujui Admin akan tampil di halaman ini."}
          </p>
        </div>
        {hasActiveFilter && (
          <Button variant="outline" onClick={resetFilters} className="mt-1 h-10 text-sm">
            Reset Filter
          </Button>
        )}
      </div>
    );
  }

  // 4. Success State
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {works.map((work) => (
            <motion.div
              key={work.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex"
            >
              <WorkCard work={work} href={`/works/${work.id}`} className="w-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasNextPage && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            loading={isFetchingNextPage}
            loadingText="Memuat..."
            className="h-10 px-6 text-sm"
          >
            Muat lebih banyak
          </Button>
        </div>
      )}
    </div>
  );
}
