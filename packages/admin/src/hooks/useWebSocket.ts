import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface UseWebSocketProps {
  onReasoning?: (reasoning: string) => void;
  onResponseDelta?: (delta: string) => void;
  onResponseComplete?: (modifiedContent: string) => void;
  onError?: (error: string) => void;
  onResponseType?: (type: "answer" | "edit") => void;
  onAnswerChunk?: (content: string) => void;
  onAnswerComplete?: (fullAnswer: string) => void;
}

export function useWebSocket({
  onReasoning,
  onResponseDelta,
  onResponseComplete,
  onError,
  onResponseType,
  onAnswerChunk,
  onAnswerComplete,
}: UseWebSocketProps) {
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

    socket.on("ai-reasoning", (data: { reasoning: string }) => {
      onReasoning?.(data.reasoning);
    });

    socket.on("ai-response-delta", (data: { delta: string }) => {
      onResponseDelta?.(data.delta);
    });

    socket.on("ai-response-complete", (data: { modifiedContent: string }) => {
      onResponseComplete?.(data.modifiedContent);
    });

    socket.on("ai-response-type", (data: { type: "answer" | "edit" }) => {
      onResponseType?.(data.type);
    });

    socket.on(
      "ai-answer-chunk",
      (data: { content: string; isComplete: boolean }) => {
        onAnswerChunk?.(data.content);
      },
    );

    socket.on("ai-answer-complete", (data: { fullAnswer: string }) => {
      onAnswerComplete?.(data.fullAnswer);
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

  const sendAIEdit = (data: {
    sessionId: string;
    prompt: string;
    fileContent: string;
    fileName?: string;
    attachedFile?: File;
  }) => {
    if (data.attachedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result;
        if (typeof fileContent === "string") {
          socketRef.current?.emit("ai-edit", {
            ...data,
            attachedFile: {
              name: data.attachedFile!.name,
              size: data.attachedFile!.size,
              type: data.attachedFile!.type,
              content: fileContent,
            },
          });
        } else {
          onError?.("Failed to read file content.");
        }
      };
      reader.onerror = () => {
        onError?.(`Error reading file: ${data.attachedFile?.name}`);
      };
      reader.readAsDataURL(data.attachedFile);
    } else {
      socketRef.current?.emit("ai-edit", data);
    }
  };

  return { sendAIEdit };
}
