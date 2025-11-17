import { CoreBridge } from "./bridges/CoreBridge";
import { DinoBridge } from "./bridges/DinoBridge";
import { SlideRuleBridge } from "./bridges/SlideRuleBridge";
import { BatteryIndicatorBridge } from "@/components/BatteryIndicator/BatteryIndicatorBridge.ts";
import { EarthquakeBridge } from "@/components/Earthquake/EarthquakeEvents.ts";
import { CubesDensityBridge } from "./CubesDensity/CubesDensityBridge";
import { PerfectOrangeJuiceBridge } from "@/components/PerfectOrangeJuice/PerfectOrangeJuiceBridge.ts";

/**
 * A simple container component that composes all the individual tool bridges.
 * This keeps the App.tsx clean and centralizes the bridge logic.
 */
export const ToolBridge = () => {
  return (
    <>
      <CoreBridge />
      <DinoBridge />
      <SlideRuleBridge />
      <BatteryIndicatorBridge />
      <EarthquakeBridge />
      <CubesDensityBridge />
      <PerfectOrangeJuiceBridge />
    </>
  );
};
