import React, { createContext, useEffect, useState, useRef, useCallback } from "react";

import { bus } from "@/core/events";
import { CoursePlayer } from "@/engine/CoursePlayer";
import { EngineStatus } from "@/engine/ExerciseEngine";
import { coreApi } from "@/components/bridges/CoreBridge";
import { networkLoader } from "@/engine/loaders/networkLoader";
import { useWebSocket } from "@/hooks/useWebsocket";

export type Message = { role: "user" | "assistant" | "system"; content: string; timestamp: number };

interface TutorialContextType {
  conversationHistory: Message[];
  engineStatus: EngineStatus;
  isStreamingComplete: boolean;
  setIsStreamingComplete: (complete: boolean) => void;
  sendUserMessage: (message: string) => void;
  sendAIQuestion: (
    question: string,
    conversationHistory: { role: "user" | "assistant" | "system"; content: string }[],
    onComplete?: () => void
  ) => void;
}

export const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [engineStatus, setEngineStatus] = useState<EngineStatus>("idle");
  const [isStreamingComplete, setIsStreamingComplete] = useState(true);
  const coursePlayerRef = useRef<CoursePlayer | null>(null);
  const currentStreamingMessageRef = useRef<{ content: string; timestamp: number } | null>(null);
  const onStreamCompleteCallbackRef = useRef<(() => void) | null>(null);

  const { sendQuestion, sendAnswer } = useWebSocket({
    onResponseDelta: (delta) => {
      // Emit the delta to the engine
      coreApi.emitRsAiStreamDelta({ delta });

      // If this is the first delta, create a new assistant message
      if (!currentStreamingMessageRef.current) {
        const newMessage: Message = {
          role: "assistant",
          content: delta,
          timestamp: Date.now(),
        };
        currentStreamingMessageRef.current = { content: delta, timestamp: newMessage.timestamp };
        setConversationHistory((prev) => [...prev, newMessage]);
      } else {
        // Update the existing message with the new delta
        currentStreamingMessageRef.current.content += delta;
        setConversationHistory((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (lastIndex >= 0 && updated[lastIndex].timestamp === currentStreamingMessageRef.current?.timestamp) {
            updated[lastIndex] = {
              ...updated[lastIndex],
              content: currentStreamingMessageRef.current.content,
            };
          }
          return updated;
        });
      }
    },
    onAnswerEvaluated: (isTrue: boolean) => {
      console.log("[TutorialProvider] onAnswerEvaluated", isTrue);
      coreApi.emitRsAnswerEvaluated({ isTrue });
    },
    onResponseComplete: () => {
      // Reset the streaming state
      currentStreamingMessageRef.current = null;
      // Call the callback if one was registered
      if (onStreamCompleteCallbackRef.current) {
        onStreamCompleteCallbackRef.current();
        onStreamCompleteCallbackRef.current = null;
      }
    },
    onError: (error) => {
      console.error("[TutorialProvider] Error:", error);
      coreApi.emitRsAiStreamError({ error: error });
      currentStreamingMessageRef.current = null;
      onStreamCompleteCallbackRef.current = null;
    },
  });

  // This effect runs once on component mount to initialize the engine.
  useEffect(() => {
    if (coursePlayerRef.current) return;

    const player = new CoursePlayer({
      loader: networkLoader,
      bus,
    });
    player.start().catch((error) => console.error("[TutorialProvider] Course player failed to start:", error));
    coursePlayerRef.current = player;
  }, []);

  useEffect(() => {
    const handleTextUpdate = (payload: { text: string; role: "assistant" | "system" | "user" }) => {
      setConversationHistory((prev) => [...prev, { role: payload.role, content: payload.text, timestamp: Date.now() }]);
    };
    const handleStatusUpdate = (payload: { status: EngineStatus }) => {
      setEngineStatus(payload.status);
    };

    const textUpdateUnsubscribe = coreApi.onRsTextUpdated(handleTextUpdate);
    const statusUpdateUnsubscribe = coreApi.onRsStatusUpdated(handleStatusUpdate);

    return () => {
      textUpdateUnsubscribe();
      statusUpdateUnsubscribe();
    };
  }, []);

  const sendAIQuestion = useCallback(
    (
      question: string,
      conversationHistory: { role: "user" | "assistant" | "system"; content: string }[],
      onComplete?: () => void
    ) => {
      // Store the completion callback
      onStreamCompleteCallbackRef.current = onComplete || null;
      // Send the question via WebSocket
      sendQuestion(question, conversationHistory);
    },
    [sendQuestion]
  );

  const sendAIAnswer = useCallback(
    (
      answer: string,
      conversationHistory: { role: "user" | "assistant" | "system"; content: string }[],
      onComplete?: () => void
    ) => {
      onStreamCompleteCallbackRef.current = onComplete || null;

      console.log("[TutorialContext] sending AI answer", answer);
      sendAnswer(answer, conversationHistory);
    },
    [sendAnswer]
  );

  // Listen for AI stream requests from the engine
  useEffect(() => {
    const handleAIStreamRequest = (payload: {
      question: string;
      conversationHistory: { role: "user" | "assistant" | "system"; content: string }[];
    }) => {
      // When the engine requests AI streaming, use the WebSocket
      sendAIQuestion(payload.question, payload.conversationHistory, () => {
        // Notify the engine that streaming is complete
        coreApi.emitRsAiStreamComplete();
      });
    };

    const aiStreamRequestUnsubscribe = coreApi.onCmdAiStreamRequest(handleAIStreamRequest);

    return () => {
      aiStreamRequestUnsubscribe();
    };
  }, [sendAIQuestion]);

  useEffect(() => {
    const handleAIAnswerRequest = (payload: {
      answer: string;
      conversationHistory: { role: "user" | "assistant" | "system"; content: string }[];
    }) => {
      console.log("[TutorialContext] handling AI answer request", payload);
      sendAIAnswer(payload.answer, payload.conversationHistory, () => {
        // Notify the engine that streaming is complete
        coreApi.emitRsAiStreamComplete();
      });
    };

    const aiAnswerRequestUnsubscribe = coreApi.onCmdAiAnswerStreamRequest(handleAIAnswerRequest);

    return () => {
      aiAnswerRequestUnsubscribe();
    };
  }, [sendAIAnswer]);

  // **FIX**: This function handles user input.
  const sendUserMessage = (message: string) => {
    // 1. Immediately update the UI with the user's message.
    setConversationHistory((prev) => [...prev, { role: "user", content: message, timestamp: Date.now() }]);

    // 2. Based on the engine's current state, send the correct event to the engine.
    switch (engineStatus) {
      case "waiting_for_estimation":
        console.log("[TutorialContext] sending RsEstimationProvided", message);
        coreApi.emitRsEstimationProvided({ answer: message });
        break;
      case "waiting_for_answer":
        console.log("[TutorialContext] sending RsQuestionAnswered", message);
        coreApi.emitRsQuestionAnswered({ answer: message });
        break;
      default:
        console.log("[TutorialContext] sending RsGeneralQuestionAsked", message);
        coreApi.emitRsGeneralQuestionAsked({ question: message });
        break;
    }
  };

  const value = {
    conversationHistory,
    engineStatus,
    isStreamingComplete,
    setIsStreamingComplete,
    sendUserMessage, // Provide the new function to the context.
    sendAIQuestion,
  };

  return <TutorialContext.Provider value={value}>{children}</TutorialContext.Provider>;
};
