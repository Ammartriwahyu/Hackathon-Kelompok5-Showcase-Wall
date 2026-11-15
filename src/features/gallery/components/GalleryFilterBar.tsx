"use client";

import { RotateCcw, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkFacets } from "../hooks/usePublicWorks";
import { useGalleryStore } from "../stores/useGalleryStore";

export function GalleryFilterBar() {
  const searchQuery = useGalleryStore((s) => s.searchQuery);
  const selectedCategory = useGalleryStore((s) => s.selectedCategory);
  const selectedTech = useGalleryStore((s) => s.selectedTech);
  const setSearchQuery = useGalleryStore((s) => s.setSearchQuery);
  const setSelectedCategory = useGalleryStore((s) => s.setSelectedCategory);
  const setSelectedTech = useGalleryStore((s) => s.setSelectedTech);
  const resetFilters = useGalleryStore((s) => s.resetFilters);

  const { data: facets } = useWorkFacets();
  const categories = facets?.categories ?? [];
  const techStack = facets?.tech_stack ?? [];
  const hasActiveFilter = Boolean(
    searchQuery.trim() || selectedCategory || selectedTech,
  );

  return (
    <section
      aria-label="Pencarian dan Filter Galeri"
      className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul karya..."
              aria-label="Cari judul karya"
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-3.5 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="w-full md:w-60">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter kategori"
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilter && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <RotateCcw className="size-4" aria-hidden />
              <span>Reset</span>
            </button>
          )}
        </div>

        {techStack.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
            <span className="mr-1 font-mono text-xs font-medium uppercase text-slate-400">
              Tech Stack:
            </span>
            {techStack.map((tech) => {
              const active = selectedTech === tech;
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => setSelectedTech(tech)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-md border px-2.5 py-1 font-mono text-xs font-medium transition-colors",
                    active
                      ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                  )}
                >
                  {tech}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
