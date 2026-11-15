"use client";

import { ArrowLeft, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Link from "next/link";

type ExhibitionControlsProps = {
  currentIndex: number;
  total: number;
  isPaused: boolean;
  onPrev: () => void;
  onNext: () => void;
  onTogglePause: () => void;
};

export function ExhibitionControls({
  currentIndex,
  total,
  isPaused,
  onPrev,
  onNext,
  onTogglePause,
}: ExhibitionControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 bg-slate-900/80 px-6 py-4 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700"
        >
          <ArrowLeft className="size-4" aria-hidden />
          <span>Keluar Mode Pameran</span>
        </Link>

        <span className="font-mono text-sm font-semibold text-slate-300">
          {total > 0 ? `${currentIndex + 1} / ${total}` : "0 / 0"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={total <= 1}
          aria-label="Karya sebelumnya"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-white transition-colors hover:bg-slate-700 disabled:opacity-40"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>

        <button
          type="button"
          onClick={onTogglePause}
          disabled={total <= 1}
          aria-label={isPaused ? "Putar slideshow" : "Jeda slideshow"}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-40"
        >
          {isPaused ? (
            <>
              <Play className="size-4 fill-current" aria-hidden />
              <span>Putar</span>
            </>
          ) : (
            <>
              <Pause className="size-4 fill-current" aria-hidden />
              <span>Jeda</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={total <= 1}
          aria-label="Karya berikutnya"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-white transition-colors hover:bg-slate-700 disabled:opacity-40"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>

      <p className="hidden font-mono text-xs text-slate-400 lg:block">
        Shortcut: [Space] Jeda/Putar &bull; [&larr;/&rarr;] Navigasi
      </p>
    </div>
  );
}
