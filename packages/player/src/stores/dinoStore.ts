import { create } from "zustand";

interface DinoState {
  // Core values
  dinoScale: number;
  showDino: boolean;

  // Actions
  setDinoScale: (scale: number) => void;
  setShowDino: (show: boolean) => void;
}

export const useDinoStore = create<DinoState>((set) => ({
  // Initial values
  dinoScale: 1,
  showDino: false,

  // Actions
  setDinoScale: (scale: number) => set({ dinoScale: scale }),
  setShowDino: (show: boolean) => set({ showDino: show }),
}));
