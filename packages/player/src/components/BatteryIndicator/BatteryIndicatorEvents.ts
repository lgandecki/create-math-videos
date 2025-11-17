import { BusSliceAPI, BusWrapper, createBusWrapper } from "@/core/busWrapper.ts";

class BatteryIndicatorAPI implements BusSliceAPI {
  commands: {
    reset: {};
    setExpectedBatteryLevel: { level: number };
  };
  responses: {
    batteryLevelSet: { level: number };
    expectedBatteryLevelReached: { level: number };
  };
}

export const batteryIndicatorApi = createBusWrapper(
  ["reset", "setExpectedBatteryLevel"],
  ["batteryLevelSet", "expectedBatteryLevelReached"],
  "batteryIndicator"
) as BusWrapper<BatteryIndicatorAPI>;
