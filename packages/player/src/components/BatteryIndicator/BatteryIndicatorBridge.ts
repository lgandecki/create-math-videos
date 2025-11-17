import { useEffect } from "react";

import { toolRegistry, TutorialPlugin } from "@/engine/ToolRegistry";
import { slideRuleApi } from "@/components/bridges/SlideRuleBridge.tsx";
import { batteryIndicatorApi } from "@/components/BatteryIndicator/BatteryIndicatorEvents.ts";

const MULTIPLYING_FACTOR = 10;

const batteryIndicatorPlugin: TutorialPlugin = {
  ns: "batteryIndicator",
  actions: {
    setExpectedBatteryLevel: (level: number) => batteryIndicatorApi.emitCmdSetExpectedBatteryLevel({ level: level }),
  },
  checks: {
    waitForBatteryLevel: (expectedValue: number) => {
      return new Promise<void>((resolve, reject) => {
        // Wait for drag completion first, then check the battery level
        const offDragCompleted = slideRuleApi.onRsDragCompleted((payload) => {
          offDragCompleted(); // Unsubscribe immediately

          const finalBatteryLevel = payload.finalValue * MULTIPLYING_FACTOR;

          if (finalBatteryLevel === expectedValue) {
            resolve();
          } else {
            reject(new Error("Incorrect alignment."));
          }
        });
      });
    },
  },
};

export const BatteryIndicatorBridge = () => {
  useEffect(() => {
    toolRegistry.registerTool(batteryIndicatorPlugin);
  }, []);

  return null;
};
