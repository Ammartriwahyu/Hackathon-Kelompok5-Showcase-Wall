"use client";

import { RotateCcw, Search } from "lucide-react";
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
      className="mb-8 rounded-2xl border border-border bg-white p-4 shadow-xs"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-brand-400"
              aria-hidden
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul karya..."
              aria-label="Cari judul karya"
              className="h-10 w-full rounded-xl border border-border bg-brand-100/30 pr-3.5 pl-10 text-sm text-foreground placeholder:text-brand-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div className="w-full md:w-52">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter kategori"
              className="h-10 w-full rounded-xl border border-border bg-brand-100/30 px-3 text-sm font-medium text-brand-700 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-52">
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              aria-label="Filter tech stack"
              className="h-10 w-full rounded-xl border border-border bg-brand-100/30 px-3 text-sm font-medium text-brand-700 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="">Semua Tech Stack</option>
              {techStack.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilter && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-medium text-muted transition-colors hover:bg-brand-100/60 hover:text-foreground"
            >
              <RotateCcw className="size-4" aria-hidden />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
