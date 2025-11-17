import { BusSliceAPI, BusWrapper, createBusWrapper } from "@/core/busWrapper";

class CounterAPI implements BusSliceAPI {
  commands: {
    reset: {};
    setExpectedNumber: { number: number };
  };
  responses: {
    numberSet: { number: number };
  };
}
export const counterApi = createBusWrapper(
  ["reset", "setExpectedNumber"],
  ["numberSet"],
  "counter"
) as BusWrapper<CounterAPI>;

export type CounterApi = typeof counterApi;
