import React, { useState, useEffect, useMemo } from "react";
import { throttle } from "lodash";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { chatActionsApi } from "./ChatActionEvents";
import { useTutorialContext } from "@/hooks/useTutorialContext";

interface InlineActionsProps {
  className?: string;
}

export const ChatActions: React.FC<InlineActionsProps> = ({ className }) => {
  const { sendUserMessage, engineStatus, conversationHistory } = useTutorialContext();

  const [goOnCounter, setGoOnCounter] = useState(0);
  const [showExplainButton, setShowExplainButton] = useState(false);

  useEffect(() => {
    // Show Explain button after second chat message
    if (conversationHistory.length >= 2) {
      setShowExplainButton(true);
    }
  }, [conversationHistory]);

  const onGoOn = useMemo(
    () =>
      throttle(() => {
        chatActionsApi.emitCmdGoOn(undefined);
        setGoOnCounter((prevCount) => prevCount + 1);
      }, 1000),
    []
  );

  const onExplain = () => {
    sendUserMessage("Explain");
  };

  const getAnimationClass = () => {
    if (engineStatus !== "waiting_for_go_on") return "";

    if (goOnCounter <= 1) return "animate-pulse-button-strong-glow";
    if (goOnCounter <= 3) return "animate-pulse-button-glow";
    return "animate-pulse-button-weak-glow";
  };

  // Don't show actions if not in appropriate state
  if (engineStatus !== "waiting_for_go_on") {
    return null;
  }

  return (
    <div className={cn("flex gap-2 justify-start items-center", className)}>
      {showExplainButton && (
        <Button
          variant="secondary"
          onClick={onExplain}
          size="sm"
          className="bg-slate-600/90 hover:bg-slate-500/90 text-slate-100 border-slate-500/60 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm cursor-pointer transition-all duration-200"
        >
          EXPLAIN
        </Button>
      )}
      <Button
        variant="secondary"
        onClick={onGoOn}
        size="sm"
        className={cn(
          "bg-emerald-600/95 hover:bg-emerald-700/95 text-white border-emerald-500/60 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm cursor-pointer transition-all duration-200",
          getAnimationClass()
        )}
      >
        GO ON
      </Button>
    </div>
  );
};
