import { create } from "zustand";

interface EarthquakeState {
  // Core values
  magnitude: number; // Green

  // Actions
  setMagnitude: (value: number) => void;
}

export const useEarthquakeStore = create<EarthquakeState>((set) => ({
  // Initial values
  magnitude: 6,

  // Actions
  setMagnitude: (value: number) => set({ magnitude: value }),
}));
