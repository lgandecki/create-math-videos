import { create } from "zustand";

interface SlideRuleState {
  // Core values
  userValueA: number; // Green
  userValueB: number; // Pink
  snapToIntegers: boolean; // Flag to enable/disable snapping to whole numbers
  showSlideRule: boolean; // Flag to control visibility of the slide rule
  showResultAt: number | null; // Flag to control visibility of the result at
  highlightNumberOnInnerDisk: number | null; // Flag to control visibility of the highlight on the inner disk
  highlightNumberOnOuterDisk: number | null; // Flag to control visibility of the highlight on the outer disk
  // Actions
  setUserValueA: (value: number) => void;
  setUserValueB: (value: number) => void;
  setSnapToIntegers: (snap: boolean) => void;
  setShowSlideRule: (show: boolean) => void;
  setShowResultAt: (show: number | null) => void;
  setHighlightNumberOnInnerDisk: (value: number | null) => void;
  setHighlightNumberOnOuterDisk: (value: number | null) => void;
}

export const useSlideRuleStore = create<SlideRuleState>((set) => ({
  // Initial values
  userValueA: 1,
  userValueB: 1,
  snapToIntegers: true, // Default to snapping enabled
  showSlideRule: false,
  showResultAt: 0,
  highlightNumberOnInnerDisk: null,
  highlightNumberOnOuterDisk: null,
  // Actions
  setUserValueA: (value: number) => set({ userValueA: value }),
  setUserValueB: (value: number) => set({ userValueB: value }),
  setSnapToIntegers: (snap: boolean) => set({ snapToIntegers: snap }),
  setShowSlideRule: (show: boolean) => set({ showSlideRule: show }),
  setShowResultAt: (show: number | null) => set({ showResultAt: show }),
  setHighlightNumberOnInnerDisk: (value: number | null) => set({ highlightNumberOnInnerDisk: value }),
  setHighlightNumberOnOuterDisk: (value: number | null) => set({ highlightNumberOnOuterDisk: value }),
}));
