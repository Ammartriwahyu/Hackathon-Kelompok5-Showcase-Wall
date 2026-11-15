import { create } from "zustand";

type ExhibitionState = {
  currentIndex: number;
  isPaused: boolean;
  setCurrentIndex: (index: number) => void;
  nextSlide: (total: number) => void;
  prevSlide: (total: number) => void;
  togglePause: () => void;
  setPaused: (paused: boolean) => void;
};

export const useExhibitionStore = create<ExhibitionState>()((set) => ({
  currentIndex: 0,
  isPaused: false,
  setCurrentIndex: (currentIndex) => set({ currentIndex }),
  nextSlide: (total) =>
    set((state) => ({
      currentIndex: total > 0 ? (state.currentIndex + 1) % total : 0,
    })),
  prevSlide: (total) =>
    set((state) => ({
      currentIndex: total > 0 ? (state.currentIndex - 1 + total) % total : 0,
    })),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  setPaused: (isPaused) => set({ isPaused }),
}));
