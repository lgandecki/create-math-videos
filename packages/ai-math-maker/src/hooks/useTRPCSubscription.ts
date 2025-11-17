import { useEffect, useRef } from "react";
import { trpcClient } from "../utils/trpc";

interface UseTRPCSubscriptionProps {
  onReasoning?: (reasoning: string) => void;
  onResponseDelta?: (delta: string) => void;
  onResponseComplete?: (modifiedContent: string) => void;
  onError?: (error: string) => void;
  onResponseType?: (type: "answer" | "edit") => void;
  onAnswerChunk?: (content: string) => void;
  onAnswerComplete?: (fullAnswer: string) => void;
}

export function useTRPCSubscription({
  onReasoning,
  onResponseDelta,
  onResponseComplete,
  onError,
  onResponseType,
  onAnswerChunk,
  onAnswerComplete,
}: UseTRPCSubscriptionProps) {
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  const sendAIEdit = async (data: {
    sessionId: string;
    prompt: string;
    fileContent: string;
    attachedFile?: File;
  }) => {
    // Cancel any existing subscription
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    // Convert attachedFile to base64 if present
    let attachedFileData = undefined;
    if (data.attachedFile) {
      try {
        const reader = new FileReader();
        const fileContent = await new Promise<string>((resolve, reject) => {
          reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === "string") {
              resolve(result);
            } else {
              reject(new Error("Failed to read file content"));
            }
          };
          reader.onerror = () =>
            reject(new Error(`Error reading file: ${data.attachedFile?.name}`));
          reader.readAsDataURL(data.attachedFile!);
        });

        attachedFileData = {
          name: data.attachedFile.name,
          type: data.attachedFile.type,
          content: fileContent,
        };
      } catch (error) {
        onError?.(
          error instanceof Error ? error.message : "Failed to read file",
        );
        return;
      }
    }

    // Create the subscription using the raw client
    console.log("[TRPC Client] Creating subscription with data:", {
      sessionId: data.sessionId,
      prompt: data.prompt,
      hasAttachedFile: !!attachedFileData,
    });

    subscriptionRef.current = trpcClient.videoAi.streamEdit.subscribe(
      {
        sessionId: data.sessionId,
        prompt: data.prompt,
        fileContent: data.fileContent,
        attachedFile: attachedFileData,
      },
      {
        onData: (event) => {
          console.log("[TRPC Client] Received event:", event);
          // Handle tracked envelope - the event should have id and data properties
          const eventData = "data" in event ? event.data : event;
          console.log("[TRPC Client] Event data:", eventData);
          console.log(
            "[TRPC Client] Current subscription ref:",
            subscriptionRef.current,
          );

          switch (eventData.type) {
            case "reasoning":
              console.log("[TRPC Client] Processing reasoning event");
              onReasoning?.(eventData.content);
              break;
            case "answer_chunk":
              console.log(
                "[TRPC Client] Processing answer_chunk event:",
                eventData.content,
              );
              onAnswerChunk?.(eventData.content);
              break;
            case "response_type":
              console.log(
                "[TRPC Client] Processing response_type event:",
                eventData.responseType,
              );
              onResponseType?.(eventData.responseType);
              break;
            case "complete":
              console.log("[TRPC Client] Processing complete event");
              if (eventData.modifiedContent) {
                console.log("[TRPC Client] Has modifiedContent");
                onResponseComplete?.(eventData.modifiedContent);
              }
              if (eventData.fullAnswer) {
                console.log("[TRPC Client] Has fullAnswer");
                onAnswerComplete?.(eventData.fullAnswer);
              }
              break;
            case "error":
              console.log(
                "[TRPC Client] Processing error event:",
                eventData.message,
              );
              onError?.(eventData.message);
              break;
            default:
              console.warn(
                "[TRPC Client] Unknown event type:",
                (eventData as unknown as { type: unknown }).type,
              );
          }
        },
        onError: (error) => {
          console.error("[TRPC Client] Subscription error:", error);
          onError?.(error.message || "An error occurred");
        },
      },
    );
    console.log("[TRPC Client] Subscription created");
  };

  // Cleanup function to unsubscribe when component unmounts
  const cleanup = () => {
    console.log(
      "[TRPC Client] Cleanup called, current subscription:",
      subscriptionRef.current,
    );
    if (subscriptionRef.current) {
      console.log("[TRPC Client] Unsubscribing");
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
  };

  // Auto cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, []);

  return { sendAIEdit, cleanup };
}
