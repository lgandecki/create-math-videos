import { useEffect } from "react";

import { useSlideRuleStore } from "@/stores/slideRuleStore";
import { toolRegistry, TutorialPlugin } from "@/engine/ToolRegistry";
import { BusSliceAPI, BusWrapper, createBusWrapper } from "@/core/busWrapper";
import { EventBus } from "@/game/EventBus";

class SlideRuleAPI implements BusSliceAPI {
  commands: {
    alignInnerDiskTo: { value: number };
    showResultAt: { value: number };
    highlightNumberOnInnerDisk: { value: number };
    highlightNumberOnOuterDisk: { value: number };
    resetSlideRule: {};
    trackMultiplication: { a: number; b: number };
    showSlideRule: null;
    hideSlideRule: null;
    bValueClicked: { value: number };
  };
  responses: {
    alignmentSet: { value: number };
    dragCompleted: { finalValue: number };
  };
}

export const slideRuleApi = createBusWrapper(
  [
    "alignInnerDiskTo",
    "showResultAt",
    "resetSlideRule",
    "trackMultiplication",
    "showSlideRule",
    "hideSlideRule",
    "highlightNumberOnInnerDisk",
    "highlightNumberOnOuterDisk",
    "bValueClicked",
  ],
  ["alignmentSet", "dragCompleted", "bValueClicked"],
  "slideRule"
) as BusWrapper<SlideRuleAPI>;

// 2. Define the Plugin
const slideRulePlugin: TutorialPlugin = {
  ns: "slideRule",
  actions: {
    alignInnerDiskTo: (value: number) => slideRuleApi.emitCmdAlignInnerDiskTo({ value }),
    showResultAt: (value: number) => slideRuleApi.emitCmdShowResultAt({ value }),
    highlightNumberOnInnerDisk: (value: number) => slideRuleApi.emitCmdHighlightNumberOnInnerDisk({ value }),
    highlightNumberOnOuterDisk: (value: number) => slideRuleApi.emitCmdHighlightNumberOnOuterDisk({ value }),
    resetSlideRule: () => slideRuleApi.emitCmdResetSlideRule({}),
    trackMultiplication: (a: number, b: number) => slideRuleApi.emitCmdTrackMultiplication({ a, b }),
    showSlideRule: () => slideRuleApi.emitCmdShowSlideRule(null),
    hideSlideRule: () => slideRuleApi.emitCmdHideSlideRule(null),
    bValueClicked: (value: number) => slideRuleApi.emitCmdBValueClicked({ value }),
  },
  checks: {
    waitForAlignmentTo: (expectedValue: number) => {
      return new Promise<void>((resolve, reject) => {
        const off = slideRuleApi.onRsDragCompleted((payload) => {
          off(); // Important: Unsubscribe immediately after the first event
          if (payload.finalValue === expectedValue) {
            resolve();
          } else {
            reject(new Error("Incorrect alignment."));
          }
        });
      });
    },
  },
};

// 3. Create the headless bridge component
export const SlideRuleBridge = () => {
  const {
    setUserValueA,
    setShowSlideRule,
    setShowResultAt,
    setHighlightNumberOnInnerDisk,
    setHighlightNumberOnOuterDisk,
  } = useSlideRuleStore();

  useEffect(() => {
    toolRegistry.registerTool(slideRulePlugin);
  }, []);

  const resetHightlightState = () => {
    setHighlightNumberOnInnerDisk(null);
    setHighlightNumberOnOuterDisk(null);
    setShowResultAt(null);
  };

  useEffect(() => {
    const offShow = slideRuleApi.onCmdShowSlideRule(() => {
      console.log("[SlideRuleBridge] Received showSlideRule, showing the SlideRule");
      // PINGWING we want to reset the highlight state before showing the slide rule
      resetHightlightState();

      setShowSlideRule(true);
    });

    const offHide = slideRuleApi.onCmdHideSlideRule(() => {
      console.log("[SlideRuleBridge] Received hideSlideRule, hiding the SlideRule");
      setShowSlideRule(false);

      // PINGWING we want to reset the highlight state when hiding the slide rule
      resetHightlightState();
    });

    return () => {
      offShow();
      offHide();
    };
  }, []);

  useEffect(() => {
    // Listen for commands from the engine and update Zustand state
    const offAlign = slideRuleApi.onCmdAlignInnerDiskTo((payload) => {
      console.log("[SlideRuleBridge] Received alignInnerDiskTo, updating userValueA:", payload.value);
      setUserValueA(payload.value);

      // PINGWING we want to reset the highlight state when moving to a new number
      resetHightlightState();
    });

    // Listen for changes in the UI state (from Zustand) and notify the engine
    const unsubscribeFromStore = useSlideRuleStore.subscribe((state, prevState) => {
      if (state.userValueA !== prevState.userValueA) {
        console.log("[SlideRuleBridge] Detected userValueA change, emitting event:", state.userValueA);
        slideRuleApi.emitRsAlignmentSet({ value: state.userValueA });
      }
    });

    return () => {
      offAlign();
      unsubscribeFromStore();
    };
  }, [setUserValueA]);

  useEffect(() => {
    const offShowResultAt = slideRuleApi.onCmdShowResultAt((payload) => {
      console.log("[SlideRuleBridge] Received showResultAt, updating showResult:", payload.value);
      setShowResultAt(payload.value);
    });

    const offHighlightNumberOnInnerDisk = slideRuleApi.onCmdHighlightNumberOnInnerDisk((payload) => {
      console.log(
        "[SlideRuleBridge] Received highlightNumberOnInnerDisk, updating highlightNumberOnInnerDisk:",
        payload.value
      );
      setHighlightNumberOnInnerDisk(payload.value);
    });

    const offHighlightNumberOnOuterDisk = slideRuleApi.onCmdHighlightNumberOnOuterDisk((payload) => {
      console.log(
        "[SlideRuleBridge] Received highlightNumberOnOuterDisk, updating highlightNumberOnOuterDisk:",
        payload.value
      );
      setHighlightNumberOnOuterDisk(payload.value);
    });

    return () => {
      offShowResultAt();
      offHighlightNumberOnInnerDisk();
      offHighlightNumberOnOuterDisk();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = useSlideRuleStore.subscribe((state, prevState) => {
      if (state.userValueA !== prevState.userValueA) {
        console.log("[SlideRuleBridge] Emitting dino-scaled event:", state.userValueA);
        EventBus.emit("dino-scaled", { scale: state.userValueA });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const offAlign = slideRuleApi.onRsAlignmentSet((payload) => {
      console.log("[SlideRuleBridge] Received alignment set, updating userValueA:", payload.value);
      setUserValueA(payload.value);
    });

    return () => {
      offAlign();
    };
  }, []);

  return null;
};
