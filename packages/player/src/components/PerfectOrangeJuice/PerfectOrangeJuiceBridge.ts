import { useEffect } from "react";

import { toolRegistry, TutorialPlugin } from "@/engine/ToolRegistry";
import { perfectOrangeJuiceApi } from "@/components/PerfectOrangeJuice/PerfectOrangeJuiceEvents.ts";

const perfectOrangeJuicePlugin: TutorialPlugin = {
  ns: "perfectOrangeJuice",
  actions: {
    setMixture: (concentrate: number, units: string, proportion: string) =>
      perfectOrangeJuiceApi.emitCmdSetMixture({ concentrate, units, proportion }),
  },
  checks: {
    waitForCompletedMixture: (expectedValue: number) => {
      return new Promise<void>((resolve, reject) => {
        const off = perfectOrangeJuiceApi.onRsCompleted((payload) => {
          off(); // Important: Unsubscribe immediately after first event
          if (payload.isCorrect) {
            resolve();
          } else {
            reject(new Error("Incorrect alignment."));
          }
        });
      });
    },
  },
};

export const PerfectOrangeJuiceBridge = () => {
  useEffect(() => {
    toolRegistry.registerTool(perfectOrangeJuicePlugin);
  }, []);

  return null;
};
