import { BusSliceAPI, BusWrapper, createBusWrapper } from "@/core/busWrapper.ts";

class PaintTheWallAPI implements BusSliceAPI {
  commands: {
    reset: {};
    setWall: { width: number; height: number; units: string; tolerance: number };
  };
  responses: {
    completed: { isCorrect: boolean; studentAnswer: number };
  };
}

export const paintTheWallApi = createBusWrapper(
  ["reset", "setWall"],
  ["completed"],
  "paintTheWall"
) as BusWrapper<PaintTheWallAPI>;
