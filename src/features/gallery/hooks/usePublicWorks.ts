"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getFeaturedWork,
  getPublicWorks,
  getWorkFacets,
} from "../services/gallery.service";
import { useGalleryStore } from "../stores/useGalleryStore";

export function useFeaturedWork() {
  return useQuery({
    queryKey: ["works", "featured"],
    queryFn: getFeaturedWork,
  });
}

export function useWorkFacets() {
  return useQuery({
    queryKey: ["works", "facets"],
    queryFn: getWorkFacets,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePublicWorks() {
  const searchQuery = useGalleryStore((s) => s.searchQuery);
  const selectedCategory = useGalleryStore((s) => s.selectedCategory);
  const selectedTech = useGalleryStore((s) => s.selectedTech);

  const q = searchQuery.trim() || undefined;
  const category = selectedCategory || undefined;
  const tech_stack = selectedTech || undefined;

  return useInfiniteQuery({
    queryKey: ["works", "public", q ?? "", category ?? "", tech_stack ?? ""],
    queryFn: ({ pageParam }) =>
      getPublicWorks({
        q,
        category,
        tech_stack,
        cursor: pageParam,
        limit: 20,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.meta?.next_cursor ?? undefined,
  });
}
