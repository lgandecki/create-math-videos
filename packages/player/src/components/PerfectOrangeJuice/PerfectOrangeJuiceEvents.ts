import { BusSliceAPI, BusWrapper, createBusWrapper } from "@/core/busWrapper.ts";

class PerfectOrangeJuiceAPI implements BusSliceAPI {
  commands: {
    reset: {};
    setMixture: { concentrate: number; units: string; proportion: string };
  };
  responses: {
    completed: { isCorrect: boolean; water: number };
  };
}

export const perfectOrangeJuiceApi = createBusWrapper(
  ["reset", "setMixture"],
  ["completed"],
  "perfectOrangeJuice"
) as BusWrapper<PerfectOrangeJuiceAPI>;
