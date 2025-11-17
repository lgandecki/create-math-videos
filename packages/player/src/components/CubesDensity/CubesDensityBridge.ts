import { useEffect } from "react";

import { Cube, cubesDensityApi } from "@/components/CubesDensity/CubesDensityEvents.ts";
import { toolRegistry, TutorialPlugin } from "@/engine/ToolRegistry";

const cubesDensityPlugin: TutorialPlugin = {
  ns: "cubesDensity",
  actions: {
    setCube: (cube: Cube) => cubesDensityApi.emitCmdSetCube(cube),
    reset: () => cubesDensityApi.emitCmdReset({}),
  },
  checks: {
    waitForCorrectAnswer: () => {
      return new Promise<void>((resolve, reject) => {
        const off = cubesDensityApi.onRsCompleted((payload) => {
          off(); // Important: Unsubscribe immediately after first event
          if (payload.isCorrect) {
            resolve();
          } else {
            reject(new Error("Incorrect answer provided."));
          }
        });
      });
    },
  },
};

export const CubesDensityBridge = () => {
  useEffect(() => {
    toolRegistry.registerTool(cubesDensityPlugin);
  }, []);

  return null;
};
