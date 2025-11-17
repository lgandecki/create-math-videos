import { useEffect } from "react";

import { toolRegistry, TutorialPlugin } from "@/engine/ToolRegistry";
import { EarthquakeApi } from "@/components/Earthquake/EarthquakeBridge.ts";
import { useEarthquakeStore } from "@/stores/earthquakeStore.ts";

const EarthquakePlugin: TutorialPlugin = {
  ns: "Earthquake",
  actions: {
    setMagnitude: (value: number) => EarthquakeApi.emitCmdSetMagnitude({ value }),
  },
};

export const EarthquakeBridge = () => {
  useEffect(() => {
    toolRegistry.registerTool(EarthquakePlugin);
  }, []);

  useEffect(() => {
    const offSetMagnitude = EarthquakeApi.onCmdSetMagnitude(({ value }) => {
      useEarthquakeStore.getState().setMagnitude(value);
    });

    return () => {
      offSetMagnitude();
    };
  }, []);

  return null;
};
