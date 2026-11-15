"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { WorkCard, type WorkCardData } from "@/shared/components/work/WorkCard";
import {
  WorkDetailContent,
  type WorkDetailData,
} from "@/shared/components/work/WorkDetailContent";

type PreviewMode = "card" | "detail";

type WorkLivePreviewProps = {
  data: WorkDetailData;
};

export function WorkLivePreview({ data }: WorkLivePreviewProps) {
  const [mode, setMode] = useState<PreviewMode>("card");

  const cardData: WorkCardData = {
    title: data.title,
    summary: data.summary,
    category: data.category,
    tech_stack: data.tech_stack,
    team_members: data.team_members,
    cover_url: data.cover_url,
    is_featured: data.is_featured,
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Live Preview</h2>
          <p className="text-xs text-slate-500">
            Pratinjau tampilan sebelum disimpan ke server
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Mode pratinjau"
          className="flex items-center gap-1 rounded-xl bg-slate-100 p-1"
        >
          {(
            [
              { value: "card", label: "Kartu Galeri" },
              { value: "detail", label: "Detail Karya" },
            ] as const
          ).map((tab) => {
            const active = mode === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMode(tab.value)}
                className={`relative rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active ? "text-indigo-700" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="preview-mode-tab"
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

      {mode === "card" ? (
        <div className="mx-auto max-w-sm">
          <WorkCard work={cardData} />
        </div>
      ) : (
        <div className="max-h-[70vh] overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 p-4">
          <WorkDetailContent work={data} />
        </div>
      )}
    </div>
  );
}
