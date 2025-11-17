import { create } from "zustand";
import { coreApi } from "@/components/bridges/CoreBridge.tsx";

export enum Lesson {
  SLIDE_RULE = "01-slide-rule",
  LINEAR_ADDITION = "02-linear-addition-pizza",
  PERFECT_ORANGE_JUICE = "03-perfect-orange-juice",
  PHONE_BATTERY_DRAIN = "04-phone-battery-drain",
  // SORTING_OBJECTS = "06-sorting-objects",
  // SQUARES_AND_AREAS = "08-squares-and-areas",
  CUBES_AND_DENSITY = "09-cubes-and-density",
  RICHTER_SCALE = "10-richter-scale",
  DINO = "00-dino",
  PIRATES = "Pirates",
}

interface LessonsState {
  // Core values
  currentLesson: Lesson;

  // Actions
  setCurrentLesson: (lesson: unknown) => void;
}

export const useLessonsStore = create<LessonsState>((set) => ({
  // Initial values
  currentLesson: Lesson.DINO,

  // Actions
  setCurrentLesson: (lesson: Lesson) => {
    coreApi.emitCmdChangeLesson(lesson);
    set({ currentLesson: lesson });
  },
}));
