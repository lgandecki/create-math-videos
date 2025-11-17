import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface UseWebSocketProps {
  onResponseDelta?: (delta: string) => void;
  onResponseComplete?: () => void;
  onError?: (error: string) => void;
  onAnswerEvaluated?: (isTrue: boolean) => void;
}

export function useWebSocket({ onResponseDelta, onResponseComplete, onError, onAnswerEvaluated }: UseWebSocketProps) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to WebSocket server
    socketRef.current = io("/", {
      path: "/ws",
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("question-response-delta", (data: { response: string }) => {
      onResponseDelta?.(data.response);
    });

    socket.on("question-response-complete", () => {
      onResponseComplete?.();
    });

    socket.on("answer-evaluated", (data: { isTrue: boolean }) => {
      console.log("[useWebSocket] answer-evaluated", data.isTrue);
      onAnswerEvaluated?.(data.isTrue);
    });

    socket.on("ai-error", (data: { error: string }) => {
      onError?.(data.error);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendQuestion = (
    question: string,
    conversationHistory: { role: "user" | "assistant" | "system"; content: string }[]
  ) => {
    socketRef.current?.emit("ai-call", { question, conversationHistory });
  };

  const sendAnswer = (
    answer: string,
    conversationHistory: { role: "user" | "assistant" | "system"; content: string }[]
  ) => {
    socketRef.current?.emit("ai-answer-question", { answer, conversationHistory });
  };

  return { sendQuestion, sendAnswer };
}
