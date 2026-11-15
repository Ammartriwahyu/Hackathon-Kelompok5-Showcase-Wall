"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900";

const pad = (n: number) => String(n).padStart(2, "0");

type ExhibitionControlsProps = {
  currentIndex: number;
  total: number;
  isPaused: boolean;
  intervalMs: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
  onTogglePause: () => void;
};

export function ExhibitionControls({
  currentIndex,
  total,
  isPaused,
  intervalMs,
  onPrev,
  onNext,
  onSelect,
  onTogglePause,
}: ExhibitionControlsProps) {
  const single = total <= 1;

  return (
    <div className="px-6 pb-6 lg:px-12 lg:pb-8">
      <div role="group" aria-label="Pilih karya" className="flex gap-1.5">
        {Array.from({ length: total }, (_, i) => {
          const active = i === currentIndex;
          const done = i < currentIndex;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`Tampilkan karya ${i + 1}`}
              aria-current={active ? "true" : undefined}
              className={cn("group relative h-8 flex-1 rounded-sm", focusRing)}
            >
              <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-brand-700 transition-colors group-hover:bg-brand-600">
                {done && <span className="absolute inset-0 bg-brand-400" />}
                {active && (isPaused || single) && <span className="absolute inset-0 bg-brand-50" />}
                {active && !isPaused && !single && (
                  <motion.span
                    key={`${currentIndex}-${total}`}
                    className="absolute inset-y-0 left-0 bg-brand-50"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: intervalMs / 1000, ease: "linear" }}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-4">
        <p className="flex-1 text-sm tabular-nums text-brand-400">
          <span className="font-semibold text-brand-50">{pad(currentIndex + 1)}</span> / {pad(total)}
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPrev}
            disabled={single}
            aria-label="Karya sebelumnya"
            className={cn(
              "grid size-11 place-items-center rounded-full border border-brand-700 text-brand-100 transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-40",
              focusRing,
            )}
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={onTogglePause}
            disabled={single}
            aria-label={isPaused ? "Putar slideshow" : "Jeda slideshow"}
            aria-pressed={isPaused}
            className={cn(
              "grid size-12 place-items-center rounded-full bg-brand-50 text-brand-900 transition-colors hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-40",
              focusRing,
            )}
          >
            {isPaused ? <Play className="ml-0.5 size-5 fill-current" aria-hidden /> : <Pause className="size-5 fill-current" aria-hidden />}
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={single}
            aria-label="Karya berikutnya"
            className={cn(
              "grid size-11 place-items-center rounded-full border border-brand-700 text-brand-100 transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-40",
              focusRing,
            )}
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>

        <p className="hidden flex-1 items-center justify-end gap-2 text-xs text-brand-400 lg:flex">
          <kbd className="rounded border border-brand-700 px-1.5 py-0.5 font-sans text-brand-200">Spasi</kbd>
          jeda
          <kbd className="ml-2 rounded border border-brand-700 px-1.5 py-0.5 font-sans text-brand-200">← →</kbd>
          pindah
        </p>
        <span aria-hidden className="flex-1 lg:hidden" />
      </div>
    </div>
  );
}