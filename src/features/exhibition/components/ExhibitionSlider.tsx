"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ExternalLink, ImageOff, MonitorPlay, RefreshCw, Users } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useExhibitionWorks } from "../hooks/useExhibitionWorks";
import { useExhibitionStore } from "../stores/useExhibitionStore";
import { ExhibitionControls } from "./ExhibitionControls";

const SLIDE_INTERVAL_MS = 7000;

export function ExhibitionSlider() {
  const prefersReducedMotion = useReducedMotion();
  const currentIndex = useExhibitionStore((s) => s.currentIndex);
  const isPaused = useExhibitionStore((s) => s.isPaused);
  const nextSlide = useExhibitionStore((s) => s.nextSlide);
  const prevSlide = useExhibitionStore((s) => s.prevSlide);
  const togglePause = useExhibitionStore((s) => s.togglePause);
  const setPaused = useExhibitionStore((s) => s.setPaused);

  const { data: works = [], isLoading, isError, refetch } = useExhibitionWorks();
  const total = works.length;
  const safeIndex = total > 0 ? currentIndex % total : 0;
  const currentWork = works[safeIndex];

  // Otomatis menjeda auto-slide jika sistem mengaktifkan Reduce Motion (PRD M7)
  useEffect(() => {
    if (prefersReducedMotion) {
      setPaused(true);
    }
  }, [prefersReducedMotion, setPaused]);

  // Auto-slide timer
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = setInterval(() => {
      nextSlide(total);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isPaused, total, nextSlide]);

  // Shortcut keyboard (Space, ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (total === 0) return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePause();
      } else if (e.key === "ArrowRight") {
        nextSlide(total);
      } else if (e.key === "ArrowLeft") {
        prevSlide(total);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [total, togglePause, nextSlide, prevSlide]);

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col justify-between bg-slate-950 p-8 text-white">
        <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <Skeleton className="aspect-[16/9] w-full rounded-2xl bg-slate-800 lg:col-span-7" />
          <div className="space-y-4 lg:col-span-5">
            <Skeleton className="h-6 w-32 bg-slate-800" />
            <Skeleton className="h-12 w-full bg-slate-800" />
            <Skeleton className="h-24 w-full bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Error State
  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 px-6 text-center text-white">
        <h1 className="text-2xl font-bold">Gagal memuat Mode Pameran</h1>
        <p className="max-w-md text-sm text-slate-400">
          Koneksi ke server bermasalah. Silakan coba muat ulang.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => refetch()} className="h-11 px-5 text-sm">
            <RefreshCw className="size-4" aria-hidden />
            <span>Coba Lagi</span>
          </Button>
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-700 px-5 text-sm font-semibold text-slate-200 hover:bg-slate-800"
          >
            <ArrowLeft className="size-4" aria-hidden />
            <span>Kembali ke Galeri</span>
          </Link>
        </div>
      </div>
    );
  }

  // 3. Empty State
  if (total === 0 || !currentWork) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 px-6 text-center text-white">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-slate-900 text-indigo-400">
          <MonitorPlay className="size-8" aria-hidden />
        </div>
        <h1 className="text-2xl font-bold">Belum ada karya untuk ditampilkan</h1>
        <p className="max-w-md text-sm text-slate-400">
          Karya yang sudah diterbitkan Admin akan otomatis muncul di layar pameran ini.
        </p>
        <Link
          href="/"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <ArrowLeft className="size-4" aria-hidden />
          <span>Kembali ke Galeri</span>
        </Link>
      </div>
    );
  }

  // 4. Success State (Fullscreen Booth Display)
  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-950 text-white">
      {/* Top Booth Header */}
      <div className="flex items-center justify-between px-6 pt-5 lg:px-10">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold tracking-wider text-white">
            BCC
          </span>
          <span className="text-sm font-bold tracking-tight text-slate-200">
            BCC Showcase Wall &bull; Exhibition Mode
          </span>
        </div>

        {prefersReducedMotion && (
          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
            Reduce Motion aktif (auto-slide dijeda)
          </span>
        )}
      </div>

      {/* Main Slide Area */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center px-6 py-8 lg:px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWork.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12"
          >
            {/* Cover 16:9 */}
            <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl lg:col-span-7">
              {currentWork.cover_url ? (
                <img
                  src={currentWork.cover_url}
                  alt={currentWork.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-600">
                  <ImageOff className="size-12" aria-hidden />
                </div>
              )}
            </div>

            {/* Info Panel (High Contrast & Large Typography) */}
            <div className="space-y-6 lg:col-span-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-indigo-500/40 bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-300">
                  {currentWork.category}
                </span>
              </div>

              <div>
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {currentWork.title}
                </h1>
                <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
                  {currentWork.summary}
                </p>
              </div>

              {currentWork.tech_stack.length > 0 && (
                <div>
                  <span className="mb-2 block font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Tech Stack
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentWork.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 font-mono text-sm font-medium text-slate-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-slate-300 sm:text-base">
                <Users className="size-4 text-indigo-400" aria-hidden />
                <span>
                  Tim:{" "}
                  <strong className="font-semibold text-white">
                    {currentWork.team_members.join(", ")}
                  </strong>
                </span>
              </div>

              <div>
                <Link
                  href={`/works/${currentWork.id}`}
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-slate-950 transition-colors hover:bg-slate-200"
                >
                  <span>Lihat Detail Karya</span>
                  <ExternalLink className="size-4" aria-hidden />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <ExhibitionControls
        currentIndex={safeIndex}
        total={total}
        isPaused={isPaused}
        onPrev={() => prevSlide(total)}
        onNext={() => nextSlide(total)}
        onTogglePause={togglePause}
      />
    </div>
  );
}
