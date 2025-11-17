import { BusSliceAPI, BusWrapper, createBusWrapper } from "@/core/busWrapper";

class ManualSorterAPI implements BusSliceAPI {
  commands: {
    setItems: { items: Record<string, string> };
    reset: {};
  };
  responses: {
    completed: { isCorrect: boolean; order: string[] };
  };
}

export const manualSorterApi = createBusWrapper(
  ["setItems", "reset"],
  ["completed"],
  "manualSorter"
) as BusWrapper<ManualSorterAPI>;

export type ManualSorterApi = typeof manualSorterApi;
