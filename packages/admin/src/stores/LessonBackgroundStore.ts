import { create } from "zustand";

interface LessonBackgroundState {
  isGenerating: boolean;
  proposedBackgroundUrl: string | null;
  proposedBackgroundFileName: string | null;
  lessonBackgroundModalType: "generate" | "confirm" | "preview";
  showLessonBackgroundModal: boolean;
  backgroundUrl: string | null;

  setIsGenerating: (isGenerating: boolean) => void;
  setProposedBackgroundUrl: (proposedBackgroundUrl: string | null) => void;
  setProposedBackgroundFileName: (
    proposedBackgroundFileName: string | null,
  ) => void;
  setLessonBackgroundModalType: (
    lessonBackgroundModalType: "generate" | "confirm" | "preview",
  ) => void;
  setShowLessonBackgroundModal: (showLessonBackgroundModal: boolean) => void;
  setBackgroundUrl: (backgroundUrl: string | null) => void;
}

export const useLessonBackgroundStore = create<LessonBackgroundState>(
  (set) => ({
    isGenerating: false,
    proposedBackgroundUrl: null,
    proposedBackgroundFileName: null,
    lessonBackgroundModalType: "generate",
    showLessonBackgroundModal: false,
    backgroundUrl: null,

    setIsGenerating: (isGenerating: boolean) => set({ isGenerating }),
    setProposedBackgroundUrl: (proposedBackgroundUrl: string | null) =>
      set({ proposedBackgroundUrl }),
    setProposedBackgroundFileName: (
      proposedBackgroundFileName: string | null,
    ) => set({ proposedBackgroundFileName }),
    setLessonBackgroundModalType: (
      lessonBackgroundModalType: "generate" | "confirm" | "preview",
    ) => set({ lessonBackgroundModalType }),
    setShowLessonBackgroundModal: (showLessonBackgroundModal: boolean) =>
      set({ showLessonBackgroundModal }),
    setBackgroundUrl: (backgroundUrl: string | null) => set({ backgroundUrl }),
  }),
);
