import { create } from "zustand";

type GalleryState = {
  searchQuery: string;
  selectedCategory: string;
  selectedTech: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedTech: (tech: string) => void;
  resetFilters: () => void;
};

export const useGalleryStore = create<GalleryState>()((set) => ({
  searchQuery: "",
  selectedCategory: "",
  selectedTech: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSelectedTech: (selectedTech) => set({ selectedTech }),
  resetFilters: () =>
    set({ searchQuery: "", selectedCategory: "", selectedTech: "" }),
}));
