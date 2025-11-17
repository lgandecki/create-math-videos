import { useEffect } from "react";

import { toolRegistry, TutorialPlugin } from "@/engine/ToolRegistry";
import { BusSliceAPI, BusWrapper, createBusWrapper } from "@/core/busWrapper";
import { slideRuleApi } from "./SlideRuleBridge";
import { useDinoStore } from "@/stores/dinoStore";
class DinoAPI implements BusSliceAPI {
  commands: {
    setDinoScale: { value: number };
    alignInnerDiskTo: { value: number };
    showDino: { value: boolean };
    hideDino: { value: boolean };
  };
  responses: {};
}

export const dinoApi = createBusWrapper(
  ["setDinoScale", "alignInnerDiskTo", "showDino", "hideDino"],
  [],
  "dino"
) as BusWrapper<DinoAPI>;

const dinoPlugin: TutorialPlugin = {
  ns: "dino",
  actions: {
    setDinoScale: (value: number) => dinoApi.emitCmdSetDinoScale({ value }),
    // The dino lesson re-uses a command defined by the slide rule.
    alignInnerDiskTo: (value: number) => slideRuleApi.emitCmdAlignInnerDiskTo({ value }),
    showDino: (value: boolean) => dinoApi.emitCmdShowDino({ value }),
    hideDino: (value: boolean) => dinoApi.emitCmdHideDino({ value }),
  },
};

// 3. Create the headless bridge component
export const DinoBridge = () => {
  const { setDinoScale, setShowDino } = useDinoStore();

  useEffect(() => {
    toolRegistry.registerTool(dinoPlugin);
  }, []);

  useEffect(() => {
    const offShow = dinoApi.onCmdShowDino(() => {
      console.log("[DinoBridge] Received showDino, showing the Dino");
      setShowDino(true);
    });

    const offHide = dinoApi.onCmdHideDino(() => {
      console.log("[DinoBridge] Received hideDino, hiding the Dino");
      setShowDino(false);
    });

    return () => {
      offShow();
      offHide();
    };
  }, []);

  useEffect(() => {
    // Listen for commands from the engine and update Zustand state
    const offScale = dinoApi.onCmdSetDinoScale((payload) => {
      console.log("[DinoBridge] Received setDinoScale, updating dinoScale:", payload.value);
      setDinoScale(payload.value);
    });

    return () => {
      offScale();
    };
  }, [setDinoScale]);

  return null;
};
