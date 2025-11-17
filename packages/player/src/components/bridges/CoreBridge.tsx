import { useEffect } from "react";

import { BusSliceAPI, BusWrapper, createBusWrapper } from "@/core/busWrapper";
import { toolRegistry, TutorialPlugin } from "@/engine/ToolRegistry.ts";
import { EngineStatus } from "@/engine/ExerciseEngine";

class CoreAPI implements BusSliceAPI {
  commands: {
    ask: { question: string; expect: string };
    askForEstimation: { question: string; expect: string };
    delay: { ms: number };
    changeLesson: string;
    aiAnswerStreamRequest: {
      answer: string;
      conversationHistory: { role: "user" | "assistant" | "system"; content: string }[];
    };
    aiStreamRequest: {
      question: string;
      conversationHistory: { role: "user" | "assistant" | "system"; content: string }[];
    };
  };
  responses: {
    lessonChanged: string;
    estimationProvided: { answer: string };
    questionAnswered: { answer: string };
    answerEvaluated: { isTrue: boolean };
    generalQuestionAsked: { question: string };
    statusUpdated: { status: EngineStatus };
    textUpdated: { text: string; role: "assistant" | "system" | "user" };
    aiStreamDelta: { delta: string };
    aiStreamComplete: void;
    aiStreamError: { error: string };
  };
}

export const coreApi = createBusWrapper(
  ["ask", "askForEstimation", "delay", "changeLesson", "aiStreamRequest", "aiAnswerStreamRequest"],
  [
    "lessonChanged",
    "estimationProvided",
    "questionAnswered",
    "answerEvaluated",
    "generalQuestionAsked",
    "statusUpdated",
    "textUpdated",
    "aiStreamDelta",
    "aiStreamComplete",
    "aiStreamError",
  ],
  "core"
) as BusWrapper<CoreAPI>;

// 2. Define the Plugin for the engine
const corePlugin: TutorialPlugin = {
  ns: "core",
  actions: {
    ask: (payload: { question: string; expect: string }) => coreApi.emitCmdAsk(payload),
    askForEstimation: (payload: { question: string; expect: string }) => coreApi.emitCmdAskForEstimation(payload),
    delay: (ms: number) => new Promise((res) => setTimeout(res, ms)),
    aiStreamRequest: (payload: {
      question: string;
      conversationHistory: { role: "user" | "assistant" | "system"; content: string }[];
    }) => coreApi.emitCmdAiStreamRequest(payload),
    aiAnswerStreamRequest: (payload: {
      answer: string;
      conversationHistory: { role: "user" | "assistant" | "system"; content: string }[];
    }) => coreApi.emitCmdAiAnswerStreamRequest(payload),
  },
};

// 3. Create the headless bridge component
export const CoreBridge = () => {
  useEffect(() => {
    toolRegistry.registerTool(corePlugin);
  }, []);

  // This bridge has no listeners, as core commands are handled by the engine itself.
  return null;
};
