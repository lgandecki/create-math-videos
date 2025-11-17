import { z } from "zod";
import { publicProcedure, router } from "../trpcRouter";
import { tracked } from "@trpc/server";
import {
  callGeminiDecision,
  streamGeminiGeneric,
  streamGeminiEdit,
} from "../../callGemini";
import {
  returnSystemPromptForFileEditingVideo,
  returnSystemPromptForAnsweringQuestionsVideo,
  returnSystemPromptForFileCreationVideo,
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

// System prompts for decision making
const systemPromptForDecidingWhetherToAnswerOrEdit = `You are a helpful assistant that determines user intent.

When the user asks a question about the lesson content, editor features, or seeks understanding, respond with:
{"isQuestion": true}

When the user requests to modify, edit, add, or change the lesson content, respond with:
{"isQuestion": false}

Respond ONLY with the JSON object, nothing else.`;

const streamEditProcedure = publicProcedure
  .input(
    z.object({
      sessionId: z.string(),
      prompt: z.string(),
      fileContent: z.string(),
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
    const { sessionId, prompt, fileContent, attachedFile } = input;
    console.log("[AI Router] Starting subscription for sessionId:", sessionId);

    // Initialize session history if needed
    if (!histories[sessionId]) histories[sessionId] = [];

    try {
      // Create event queue for async operations
      const eventQueue: Array<{ id: string; data: AIEvent }> = [];
      let finished = false;

      // Process AI operations in background
      (async () => {
        try {
          let pdfFileContent = "";
          let docxFileContent = "";

          // Process attached file if present

          // Get conversation history
          const conversationHistory = histories[sessionId] || [];
          const systemPromptForAnsweringQuestions =
            returnSystemPromptForAnsweringQuestionsVideo();
          const systemPromptForEditing =
            fileContent.trim() === ""
              ? returnSystemPromptForFileCreationVideo()
              : returnSystemPromptForFileEditingVideo();

          // Create messages for different purposes
          const userMessageForDeciding = `User's request: "${prompt}"
    
Is this a question about the script/editor or a request to edit/modify the script content?`;

          const userMessageForAnswering = `${conversationHistory
            .map((msg: any) => `${msg.role}: ${msg.content}`)
            .join("\n")}\nuser: ${prompt}`;

          const userMessageForEditing = `Please help me edit this script. User request: ${prompt}\n\nCurrent script content:\n${fileContent}
Reply only with the edited script content, nothing else, no additional commentary.`;

          let editAnswer = "";
          let answerText = "";

          // Get the decision
          console.log("[AI Router] Getting decision");
          const decisionResult = await callGeminiDecision(
            userMessageForDeciding,
            systemPromptForDecidingWhetherToAnswerOrEdit,
          );

          let isQuestion = false;
          try {
            const parsed = JSON.parse(decisionResult);
            isQuestion = parsed.isQuestion === true;
          } catch (error) {
            console.error("[AI Router] Failed to parse decision:", error);
            isQuestion = false;
          }

          console.log("[AI Router] Decision:", isQuestion ? "answer" : "edit");

          // Queue the decision event
          eventQueue.push({
            id: getNextEventId(),
            data: {
              type: "response_type" as const,
              responseType: isQuestion ? "answer" : "edit",
            },
          });

          if (isQuestion) {
            // Stream answer chunks
            const answerStream = streamGeminiGeneric(
              userMessageForAnswering,
              systemPromptForAnsweringQuestions,
              false,
            );

            for await (const chunk of answerStream) {
              answerText += chunk;
              eventQueue.push({
                id: getNextEventId(),
                data: {
                  type: "answer_chunk" as const,
                  content: chunk,
                },
              });
            }

            // Save to history
            histories[sessionId].push(
              { role: "user", content: userMessageForAnswering },
              { role: "assistant", content: answerText },
            );

            // Queue complete event
            eventQueue.push({
              id: getNextEventId(),
              data: {
                type: "complete" as const,
                fullAnswer: answerText,
              },
            });
          } else {
            // Stream edit reasoning
            const editStream = streamGeminiEdit(
              userMessageForEditing,
              systemPromptForEditing,
              "gemini-2.5-flash",
            );

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
              { role: "user", content: userMessageForEditing },
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
          }
        } catch (error) {
          console.error("[AI Router] Background processing error:", error);
          eventQueue.push({
            id: getNextEventId(),
            data: {
              type: "error" as const,
              message: error instanceof Error ? error.message : "Unknown error",
            },
          });
        }

        finished = true;
        console.log("[AI Router] Background processing complete");
      })();

      // Yield events from the queue
      while (!finished || eventQueue.length > 0) {
        if (eventQueue.length > 0) {
          const event = eventQueue.shift()!;
          console.log("[AI Router] Yielding event:", event.data.type);
          yield tracked(event.id, event.data);
        } else {
          // Wait for more events
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.error("[AI Router] Generator error:", error);
      yield tracked(getNextEventId(), {
        type: "error" as const,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }

    console.log("[AI Router] Subscription completed");
  });

const streamEditProcedureFake = publicProcedure
  .input(
    z.object({
      sessionId: z.string(),
      prompt: z.string(),
      fileContent: z.string(),
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
    const { sessionId, prompt, fileContent, attachedFile } = input;
    console.log("[AI Router] Starting subscription for sessionId:", sessionId);

    // Initialize session history if needed
    if (!histories[sessionId]) histories[sessionId] = [];

    try {
      // Create event queue for async operations
      const eventQueue: Array<{ id: string; data: AIEvent }> = [];
      let finished = false;

      // Process AI operations in background
      (async () => {
        try {
          let pdfFileContent = "";
          let docxFileContent = "";

          // Process attached file if present

          // Get conversation history
          const conversationHistory = histories[sessionId] || [];
          const systemPromptForAnsweringQuestions =
            returnSystemPromptForAnsweringQuestionsVideo();
          const systemPromptForEditing =
            fileContent.trim() === ""
              ? returnSystemPromptForFileCreationVideo()
              : returnSystemPromptForFileEditingVideo();

          // Create messages for different purposes
          const userMessageForDeciding = `User's request: "${prompt}"
    
Is this a question about the script/editor or a request to edit/modify the script content?`;

          const userMessageForAnswering = `${conversationHistory
            .map((msg: any) => `${msg.role}: ${msg.content}`)
            .join("\n")}\nuser: ${prompt}`;

          const userMessageForEditing = `Please help me edit this script. User request: ${prompt}\n\nCurrent script content:\n${fileContent}
Reply only with the edited script content, nothing else, no additional commentary.`;

          let editAnswer = "";
          let answerText = "";

          // Get the decision
          console.log("[AI Router] Getting decision");
          const decisionResult = await callGeminiDecision(
            userMessageForDeciding,
            systemPromptForDecidingWhetherToAnswerOrEdit,
          );

          let isQuestion = false;
          try {
            const parsed = JSON.parse(decisionResult);
            isQuestion = parsed.isQuestion === true;
          } catch (error) {
            console.error("[AI Router] Failed to parse decision:", error);
            isQuestion = false;
          }

          console.log("[AI Router] Decision:", isQuestion ? "answer" : "edit");

          // Queue the decision event
          eventQueue.push({
            id: getNextEventId(),
            data: {
              type: "response_type" as const,
              responseType: isQuestion ? "answer" : "edit",
            },
          });

          editAnswer = `

# The Simple Number Line

## Introduction

Display the title "The Simple Number Line".
fade out

## Main Concepts: What is a Number Line?

Display the title "Really nice"
fade out 

`;

          // Queue complete event
          eventQueue.push({
            id: getNextEventId(),
            data: {
              type: "complete" as const,
              modifiedContent: editAnswer,
            },
          });
        } catch (error) {
          console.error("[AI Router] Background processing error:", error);
          eventQueue.push({
            id: getNextEventId(),
            data: {
              type: "error" as const,
              message: error instanceof Error ? error.message : "Unknown error",
            },
          });
        }

        finished = true;
        console.log("[AI Router] Background processing complete");
      })();

      // Yield events from the queue
      while (!finished || eventQueue.length > 0) {
        if (eventQueue.length > 0) {
          const event = eventQueue.shift()!;
          console.log("[AI Router] Yielding event:", event.data.type);
          yield tracked(event.id, event.data);
        } else {
          // Wait for more events
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.error("[AI Router] Generator error:", error);
      yield tracked(getNextEventId(), {
        type: "error" as const,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }

    console.log("[AI Router] Subscription completed");
  });

export const videoAiRouter = router({
  streamEditFake: streamEditProcedureFake,
  streamEdit: streamEditProcedure,
});
