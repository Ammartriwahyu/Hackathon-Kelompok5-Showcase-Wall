"use client";

import { Check, ChevronDown, Plus, Search, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  MAX_LIST_ITEM_LENGTH,
  MAX_LIST_ITEMS,
  TECH_STACK_OPTIONS,
} from "../schemas/work.schema";

type TechStackSelectProps = {
  id: string;
  selected: string[];
  onChange: (next: string[]) => void;
  error?: string;
};

/** Multi-select dropdown untuk memilih tech stack dari daftar maupun input kustom. */
export function TechStackSelect({
  id,
  selected,
  onChange,
  error,
}: TechStackSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const errorId = error ? `${id}-error` : undefined;

  useEffect(() => {
    if (!open) return;
    searchInputRef.current?.focus();

    const handlePointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const allOptions = useMemo(() => {
    const merged: string[] = [...TECH_STACK_OPTIONS];
    const seen = new Set(merged.map((item) => item.toLowerCase()));
    for (const item of selected) {
      if (!seen.has(item.toLowerCase())) {
        seen.add(item.toLowerCase());
        merged.push(item);
      }
    }
    return merged;
  }, [selected]);

  const selectedKeys = useMemo(
    () => new Set(selected.map((item) => item.toLowerCase())),
    [selected],
  );

  const trimmedQuery = query.replace(/,/g, "").trim();
  const normalizedQuery = trimmedQuery.toLowerCase();

  const filteredOptions = useMemo(() => {
    if (!normalizedQuery) return allOptions;
    return allOptions.filter((opt) => opt.toLowerCase().includes(normalizedQuery));
  }, [allOptions, normalizedQuery]);

  const canAddCustom =
    trimmedQuery.length > 0 &&
    trimmedQuery.length <= MAX_LIST_ITEM_LENGTH &&
    selected.length < MAX_LIST_ITEMS &&
    !allOptions.some((opt) => opt.toLowerCase() === normalizedQuery);

  const toggleOption = (option: string) => {
    const key = option.toLowerCase();
    if (selectedKeys.has(key)) {
      onChange(selected.filter((item) => item.toLowerCase() !== key));
      return;
    }
    if (selected.length >= MAX_LIST_ITEMS) return;
    onChange([...selected, option]);
  };

  const addCustom = () => {
    if (!canAddCustom) return;
    onChange([...selected, trimmedQuery]);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-brand-800">
          Tech Stack
        </label>
        <span className="text-xs text-brand-500">
          {selected.length}/{MAX_LIST_ITEMS} dipilih
        </span>
      </div>

      <div
        className={cn(
          "flex min-h-12 items-center justify-between gap-2 rounded-xl border bg-white px-3 py-2 transition-colors",
          error
            ? "border-red-400 focus-within:ring-2 focus-within:ring-red-100"
            : "border-border focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100",
          open && !error && "border-brand-400 ring-2 ring-brand-100",
        )}
      >
        <div className="flex flex-1 flex-wrap items-center gap-1.5">
          {selected.length > 0 ? (
            selected.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1 rounded-lg bg-brand-100/70 px-2.5 py-1 text-xs font-medium text-brand-800"
              >
                <span>{tech}</span>
                <button
                  type="button"
                  onClick={() => toggleOption(tech)}
                  aria-label={`Hapus ${tech}`}
                  className="rounded p-0.5 text-brand-500 transition-colors hover:bg-brand-200/70 hover:text-brand-900"
                >
                  <X className="size-3" aria-hidden />
                </button>
              </span>
            ))
          ) : (
            <button
              type="button"
              id={id}
              onClick={() => setOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-controls={listboxId}
              aria-describedby={errorId}
              className="w-full text-left text-sm text-brand-400 outline-none"
            >
              Pilih tech stack...
            </button>
          )}
        </div>

        <button
          type="button"
          id={selected.length > 0 ? id : undefined}
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Tutup pilihan tech stack" : "Buka pilihan tech stack"}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-describedby={errorId}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-brand-500 transition-colors hover:bg-brand-100/60 hover:text-brand-800"
        >
          <ChevronDown
            className={cn("size-4 transition-transform", open && "rotate-180")}
            aria-hidden
          />
        </button>
      </div>

      {open && (
        <div className="absolute right-0 left-0 z-20 mt-1.5 rounded-xl border border-border bg-white p-2 shadow-lg">
          <div className="relative mb-2">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-400"
              aria-hidden
            />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (canAddCustom) {
                    addCustom();
                  } else if (filteredOptions.length === 1) {
                    toggleOption(filteredOptions[0]);
                  }
                }
              }}
              placeholder="Cari atau ketik tech stack lain..."
              aria-label="Cari tech stack"
              className="h-9 w-full rounded-lg border border-border bg-brand-100/30 pr-3 pl-9 text-sm text-foreground outline-none placeholder:text-brand-400 focus:border-brand-400 focus:bg-white"
            />
          </div>

          <ul
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
            className="max-h-52 space-y-0.5 overflow-y-auto"
          >
            {filteredOptions.map((option) => {
              const isSelected = selectedKeys.has(option.toLowerCase());
              const isLimitReached = !isSelected && selected.length >= MAX_LIST_ITEMS;

              return (
                <li key={option}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={isLimitReached}
                    onClick={() => toggleOption(option)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      isSelected
                        ? "bg-primary-soft/60 font-medium text-brand-900"
                        : "text-foreground hover:bg-brand-100/50",
                      isLimitReached && "cursor-not-allowed opacity-50",
                    )}
                  >
                    <span>{option}</span>
                    {isSelected && (
                      <Check className="size-4 text-primary" aria-hidden />
                    )}
                  </button>
                </li>
              );
            })}

            {canAddCustom && (
              <li>
                <button
                  type="button"
                  onClick={addCustom}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-primary transition-colors hover:bg-primary-soft/50"
                >
                  <Plus className="size-4 shrink-0" aria-hidden />
                  <span>Tambah &ldquo;{trimmedQuery}&rdquo;</span>
                </button>
              </li>
            )}

            {filteredOptions.length === 0 && !canAddCustom && (
              <li className="px-3 py-2 text-center text-xs text-muted">
                {selected.length >= MAX_LIST_ITEMS
                  ? `Maksimal ${MAX_LIST_ITEMS} tech stack`
                  : "Tidak ada tech stack yang cocok"}
              </li>
            )}
          </ul>
        </div>
      )}

      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
