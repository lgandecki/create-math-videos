import { z } from "zod";
import { publicProcedure, router } from "../trpcRouter";
import { tracked } from "@trpc/server";

import {
  returnSystemPromptForFileEditingVideo,
  returnSystemPromptForAnsweringQuestionsVideo,
} from "../../returnSystemPromptForVideo";
import { zAsyncIterable } from "../zAsyncIterable";

const GEMINI_DEBUG = process.env.GEMINI_DEBUG === "true";

// Define the event types for type safety
const aiEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("response_type"),
    responseType: z.enum(["answer", "edit"]),
  }),
  z.object({
    type: z.literal("answer_chunk"),
    content: z.string(),
  }),
  z.object({
    type: z.literal("reasoning"),
    content: z.string(),
  }),
  z.object({
    type: z.literal("complete"),
    fullAnswer: z.string().optional(),
    modifiedContent: z.string().optional(),
  }),
  z.object({
    type: z.literal("error"),
    message: z.string(),
  }),
]);

type AIEvent = z.infer<typeof aiEventSchema>;

// Simple counter for event IDs
let eventIdCounter = 0;
const getNextEventId = () => String(++eventIdCounter);

// Store session histories
const histories: Record<string, any[]> = {};

// Mock function to simulate edit streaming
async function* mockEditStream(prompt: string, fileContent: string) {
  // Simulate reasoning chunks
  const reasoningChunks = ["Analyzing the user request..."];

  for (const chunk of reasoningChunks) {
    yield { type: "reasoning" as const, content: chunk };
    // Add delay to simulate real streaming
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  // Generate mock edited content
  const mockEditedContent = `${fileContent}

// Mock edit applied based on request: ${prompt}
// This is a fake implementation that adds this comment to show the edit was processed.`;

  yield { type: "answer" as const, content: mockEditedContent };
}

const streamEditProcedure = publicProcedure
  .input(
    z.object({
      sessionId: z.string(),
      prompt: z.string(),
      fileContent: z.string(),
      fileName: z.string(),
      attachedFile: z
        .object({
          content: z.string(),
          name: z.string(),
          type: z.string(),
        })
        .optional(),
    }),
  )
  .output(
    zAsyncIterable({
      yield: aiEventSchema,
      tracked: true, // Enables event IDs for reconnection support
    }),
  )
  .subscription(async function* ({ input }) {
    const { sessionId, prompt, fileContent, fileName, attachedFile } = input;
    console.log(
      "[Fake AI Router] Starting subscription for sessionId:",
      sessionId,
    );

    // Initialize session history if needed
    if (!histories[sessionId]) histories[sessionId] = [];

    try {
      // Create event queue for async operations
      const eventQueue: Array<{ id: string; data: AIEvent }> = [];
      let finished = false;

      // Process mock AI operations in background
      (async () => {
        try {
          let editAnswer = "";

          console.log("[Fake AI Router] Always deciding: edit");

          // Always queue the edit decision event
          eventQueue.push({
            id: getNextEventId(),
            data: {
              type: "response_type" as const,
              responseType: "edit",
            },
          });

          // Stream mock edit reasoning and get result
          const editStream = mockEditStream(prompt, fileContent);

          for await (const item of editStream) {
            if (item.type === "reasoning") {
              eventQueue.push({
                id: getNextEventId(),
                data: {
                  type: "reasoning" as const,
                  content: item.content,
                },
              });
            } else if (item.type === "answer") {
              editAnswer = item.content;
            }
          }

          // Save to history
          histories[sessionId].push(
            { role: "user", content: prompt },
            { role: "assistant", content: editAnswer },
          );

          // Queue complete event
          eventQueue.push({
            id: getNextEventId(),
            data: {
              type: "complete" as const,
              modifiedContent: editAnswer,
            },
          });
        } catch (error) {
          console.error("[Fake AI Router] Background processing error:", error);
          eventQueue.push({
            id: getNextEventId(),
            data: {
              type: "error" as const,
              message: error instanceof Error ? error.message : "Unknown error",
            },
          });
        }

        finished = true;
        console.log("[Fake AI Router] Background processing complete");
      })();

      // Yield events from the queue
      while (!finished || eventQueue.length > 0) {
        if (eventQueue.length > 0) {
          const event = eventQueue.shift()!;
          console.log("[Fake AI Router] Yielding event:", event.data.type);
          yield tracked(event.id, event.data);
        } else {
          // Wait for more events
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.error("[Fake AI Router] Generator error:", error);
      yield tracked(getNextEventId(), {
        type: "error" as const,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }

    console.log("[Fake AI Router] Subscription completed");
  });

export const fakeAiRouter = router({
  streamEdit: streamEditProcedure,
});
