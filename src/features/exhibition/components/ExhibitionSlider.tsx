"use client";

import { useEffect, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ArrowRight, ImageOff, RefreshCw, Star, X } from "lucide-react";
import logo from "@/assets/logo.png";
import { cn, resolveMediaUrl } from "@/lib/utils";
import { Mascot } from "@/shared/components/ui/Mascot";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useExhibitionWorks } from "../hooks/useExhibitionWorks";
import { useExhibitionStore } from "../stores/useExhibitionStore";
import { ExhibitionControls } from "./ExhibitionControls";

const SLIDE_INTERVAL_MS = 7000;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900";

const coverVariants: Variants = {
  enter: { opacity: 0, scale: 0.98 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const infoVariants: Variants = {
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
};

const itemVariants: Variants = {
  enter: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

function ExhibitionShell({
  children,
  note,
}: {
  children: ReactNode;
  note?: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-brand-900 text-brand-50">
      <header className="flex items-center justify-between gap-4 px-6 pt-6 lg:px-12 lg:pt-8">
        <Link
          href="/"
          aria-label="Kembali ke galeri BCC Showcase Wall"
          className={cn(
            "flex min-h-11 items-center gap-3 rounded-lg",
            focusRing,
          )}
        >
          <Image src={logo} alt="" priority className="h-10 w-auto" />
          <span className="hidden text-sm font-semibold text-brand-100 sm:inline">
            BCC Showcase Wall
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {note}
          <Link
            href="/"
            className={cn(
              "inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-brand-200 transition-colors hover:bg-brand-800 hover:text-brand-50",
              focusRing,
            )}
          >
            <X className="size-4" aria-hidden />
            Keluar
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}

type CenteredStateProps = {
  icon?: ReactNode;
  mascot?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};

function CenteredState({
  icon,
  mascot,
  title,
  description,
  action,
}: CenteredStateProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      {mascot ?? (
        <div className="grid size-14 place-items-center rounded-2xl border border-brand-700 text-brand-300">
          {icon}
        </div>
      )}
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="max-w-md text-brand-300">{description}</p>
      {action}
    </main>
  );
}

export function ExhibitionSlider() {
  const prefersReducedMotion = useReducedMotion();
  const currentIndex = useExhibitionStore((s) => s.currentIndex);
  const isPaused = useExhibitionStore((s) => s.isPaused);
  const nextSlide = useExhibitionStore((s) => s.nextSlide);
  const prevSlide = useExhibitionStore((s) => s.prevSlide);
  const togglePause = useExhibitionStore((s) => s.togglePause);
  const setPaused = useExhibitionStore((s) => s.setPaused);
  const setCurrentIndex = useExhibitionStore((s) => s.setCurrentIndex);

  const {
    data: works = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useExhibitionWorks();
  const total = works.length;
  const safeIndex = total > 0 ? Math.min(currentIndex, total - 1) : 0;
  const currentWork = works[safeIndex];

  useEffect(() => {
    if (prefersReducedMotion) setPaused(true);
  }, [prefersReducedMotion, setPaused]);

  useEffect(() => {
    if (total > 0 && currentIndex > total - 1) setCurrentIndex(total - 1);
  }, [currentIndex, total, setCurrentIndex]);

  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = setInterval(() => nextSlide(total), SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isPaused, total, currentIndex, nextSlide]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (total === 0 || e.repeat) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select")) return;
      if (e.code === "Space") {
        if (target?.closest("button, a")) return;
        e.preventDefault();
        togglePause();
      } else if (e.key === "ArrowRight") {
        nextSlide(total);
      } else if (e.key === "ArrowLeft") {
        prevSlide(total);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [total, togglePause, nextSlide, prevSlide]);

  if (isLoading) {
    return (
      <ExhibitionShell>
        <main
          className="grid flex-1 items-center gap-8 px-6 py-8 lg:grid-cols-12 lg:gap-14 lg:px-12"
          aria-busy="true"
        >
          <Skeleton className="aspect-video w-full rounded-2xl bg-brand-800 lg:col-span-7" />
          <div className="space-y-5 lg:col-span-5">
            <Skeleton className="h-4 w-32 bg-brand-800" />
            <Skeleton className="h-14 w-full bg-brand-800" />
            <Skeleton className="h-20 w-5/6 bg-brand-800" />
            <Skeleton className="h-12 w-44 rounded-full bg-brand-800" />
          </div>
        </main>
      </ExhibitionShell>
    );
  }

  if (isError) {
    return (
      <ExhibitionShell>
        <CenteredState
          icon={<RefreshCw className="size-6" aria-hidden />}
          title="Mode pameran belum bisa dimuat"
          description="Koneksi ke server terputus. Periksa jaringan lalu coba lagi."
          action={
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isRefetching}
              className={cn(
                "mt-2 inline-flex h-12 items-center gap-2 rounded-full bg-brand-50 px-6 text-sm font-semibold text-brand-900 transition-colors hover:bg-brand-100 disabled:opacity-60",
                focusRing,
              )}
            >
              <RefreshCw
                className={cn("size-4", isRefetching && "animate-spin")}
                aria-hidden
              />
              {isRefetching ? "Memuat..." : "Coba lagi"}
            </button>
          }
        />
      </ExhibitionShell>
    );
  }

  if (!currentWork) {
    return (
      <ExhibitionShell>
        <CenteredState
          mascot={<Mascot variant="halo" className="w-36 sm:w-44" />}
          title="Belum ada karya yang tayang"
          description="Karya yang dipublikasikan Admin akan muncul di layar ini secara otomatis."
        />
      </ExhibitionShell>
    );
  }

  return (
    <ExhibitionShell
      note={
        prefersReducedMotion ? (
          <span className="hidden text-xs text-brand-300 md:inline">
            Auto-slide dijeda (Reduce Motion aktif)
          </span>
        ) : null
      }
    >
      <p className="sr-only" aria-live="polite">
        {`Karya ${safeIndex + 1} dari ${total}: ${currentWork.title}`}
      </p>

      <main className="flex flex-1 items-center px-6 py-8 lg:px-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={currentWork.id}
            initial="enter"
            animate="show"
            exit="exit"
            className="grid w-full items-center gap-8 lg:grid-cols-12 lg:gap-14"
          >
            <motion.div
              variants={coverVariants}
              className="aspect-video w-full overflow-hidden rounded-2xl bg-brand-800 ring-1 ring-brand-700 lg:col-span-7"
            >
              {currentWork.cover_url ? (
                <img
                  src={resolveMediaUrl(currentWork.cover_url)}
                  alt={currentWork.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-brand-500">
                  <ImageOff className="size-10" aria-hidden />
                </div>
              )}
            </motion.div>

            <motion.div variants={infoVariants} className="lg:col-span-5">
              <motion.p
                variants={itemVariants}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium uppercase tracking-[0.14em] text-brand-300"
              >
                {currentWork.category}
                {currentWork.is_featured && (
                  <span className="inline-flex items-center gap-1.5 normal-case tracking-normal text-status-featured-soft">
                    <Star className="size-4 fill-current" aria-hidden />
                    Karya unggulan
                  </span>
                )}
              </motion.p>

              <motion.h1
                variants={itemVariants}
                className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl xl:text-6xl"
              >
                {currentWork.title}
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="mt-5 max-w-xl text-lg leading-relaxed text-brand-200"
              >
                {currentWork.summary}
              </motion.p>

              <motion.dl
                variants={itemVariants}
                className="mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-t border-brand-700 pt-6 text-sm"
              >
                <dt className="text-brand-400">Tim</dt>
                <dd className="text-brand-100">
                  {currentWork.team_members.join(", ") || "-"}
                </dd>
                <dt className="text-brand-400">Teknologi</dt>
                <dd className="text-brand-100">
                  {currentWork.tech_stack.join(" · ") || "-"}
                </dd>
              </motion.dl>

              <motion.div variants={itemVariants} className="mt-8">
                <Link
                  href={`/works/${currentWork.id}`}
                  className={cn(
                    "group inline-flex h-12 items-center gap-2 rounded-full bg-brand-50 px-6 text-sm font-semibold text-brand-900 transition-colors hover:bg-brand-100",
                    focusRing,
                  )}
                >
                  Lihat detail karya
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </motion.div>
            </motion.div>
          </motion.article>
        </AnimatePresence>
      </main>

      <ExhibitionControls
        currentIndex={safeIndex}
        total={total}
        isPaused={isPaused}
        intervalMs={SLIDE_INTERVAL_MS}
        onPrev={() => prevSlide(total)}
        onNext={() => nextSlide(total)}
        onSelect={setCurrentIndex}
        onTogglePause={togglePause}
      />
    </ExhibitionShell>
  );
}
