import { z } from "zod";
import { publicProcedure, router } from "../trpcRouter";
import { tracked } from "@trpc/server";
import {
  callGeminiDecision,
  streamGeminiGeneric,
  streamGeminiEdit,
} from "../../callGemini";
import {
  returnSystemPromptForFileEditing,
  returnSystemPromptForAnsweringQuestions,
} from "../../returnSystemPrompt";
import { convertPdfToMarkdown } from "../../convertPdfToMarkdown";
import { convertDocxToMarkdown } from "../../convertDocxToMarkdown";
import { zAsyncIterable } from "../zAsyncIterable";
import { randomUUID } from "crypto";

const GEMINI_DEBUG = process.env.GEMINI_DEBUG === "true";

// In-memory file storage
interface StoredFile {
  content: string;
  name: string;
  type: string;
  uploadedAt: Date;
}

const temporaryFileStorage = new Map<string, StoredFile>();

// Cleanup files older than 15 minutes
setInterval(
  () => {
    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

    for (const [id, file] of temporaryFileStorage.entries()) {
      if (file.uploadedAt < fifteenMinutesAgo) {
        temporaryFileStorage.delete(id);
        console.log(`[AI Router] Cleaned up expired file: ${id}`);
      }
    }
  },
  5 * 60 * 1000,
); // Run cleanup every 5 minutes

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

const latexExamples = `You can use LaTeX syntax for math formulas, examples:
$$
e=mc^2
$$

or

$$
  x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$`;

// System prompts for decision making
const systemPromptForDecidingWhetherToAnswerOrEdit = `You are a helpful assistant that determines user intent.

When the user asks a question about the lesson content, editor features, or seeks understanding, respond with:
{"isQuestion": true}

When the user requests to modify, edit, add, or change the lesson content, respond with:
{"isQuestion": false}

Respond ONLY with the JSON object, nothing else.`;

// File upload mutation
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
  "text/markdown",
];

const uploadFileProcedure = publicProcedure
  .input(
    z.object({
      content: z.string(),
      name: z.string(),
      type: z.string(),
    }),
  )
  .output(
    z.object({
      fileId: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(input.type)) {
      throw new Error(
        `Invalid file type: ${input.type}. Allowed types: ${ALLOWED_FILE_TYPES.join(", ")}`,
      );
    }

    // Validate file size (base64 encoded size)
    // Base64 increases size by ~33%, so we check the encoded string length
    const base64SizeInBytes = input.content.length * 0.75;
    if (base64SizeInBytes > MAX_FILE_SIZE) {
      throw new Error(
        `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      );
    }

    // Validate base64 format
    const base64Pattern = /^data:([^;]+);base64,/;
    const match = input.content.match(base64Pattern);
    if (!match) {
      throw new Error("Invalid file format. Expected base64 encoded data URL.");
    }

    // Extract and validate MIME type from data URL
    const mimeType = match[1];
    if (mimeType !== input.type) {
      throw new Error(
        `MIME type mismatch. Expected ${input.type} but got ${mimeType}`,
      );
    }

    // Validate file name
    if (!input.name || input.name.length > 255) {
      throw new Error(
        "Invalid file name. Must be between 1 and 255 characters.",
      );
    }

    // Sanitize file name (remove potentially dangerous characters)
    const sanitizedName = input.name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");

    const fileId = randomUUID();

    temporaryFileStorage.set(fileId, {
      content: input.content,
      name: sanitizedName,
      type: input.type,
      uploadedAt: new Date(),
    });

    console.log(`[AI Router] File uploaded: ${fileId} (${sanitizedName})`);

    return { fileId };
  });

const streamEditProcedure = publicProcedure
  .input(
    z.object({
      sessionId: z.string(),
      prompt: z.string(),
      fileContent: z.string(),
      fileName: z.string(),
      attachedFileId: z.string().optional(),
    }),
  )
  .output(
    zAsyncIterable({
      yield: aiEventSchema,
      tracked: true, // Enables event IDs for reconnection support
    }),
  )
  .subscription(async function* ({ input }) {
    const { sessionId, prompt, fileContent, fileName, attachedFileId } = input;
    console.log("[AI Router] Starting subscription for sessionId:", sessionId);

    console.log("fileContent", fileContent);

    // Retrieve attached file from storage if ID provided
    let attachedFile = undefined;
    if (attachedFileId) {
      attachedFile = temporaryFileStorage.get(attachedFileId);
      if (!attachedFile) {
        yield tracked(getNextEventId(), {
          type: "error" as const,
          message: "Attached file not found. It may have expired.",
        });
        return;
      }
      console.log(
        `[AI Router] Retrieved file from storage: ${attachedFile.name}`,
      );
    }

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
          if (attachedFile) {
            if (attachedFile.type === "application/pdf") {
              pdfFileContent = await convertPdfToMarkdown(
                attachedFile.content,
                attachedFile.name,
              );
            } else if (
              attachedFile.type ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
              docxFileContent = await convertDocxToMarkdown(
                attachedFile.content,
                attachedFile.name,
              );
            }
          }

          // Get conversation history
          const conversationHistory = histories[sessionId] || [];
          const systemPromptForAnsweringQuestions =
            returnSystemPromptForAnsweringQuestions();
          const systemPromptForEditing = returnSystemPromptForFileEditing();

          // Create messages for different purposes
          const userMessageForDeciding = `User's request: "${prompt}"
    
Is this a question about the lesson/editor or a request to edit/modify the lesson content?`;

          const attachmentContext = pdfFileContent
            ? `\n\nAttached PDF content:\n${pdfFileContent}`
            : docxFileContent
              ? `\n\nAttached Word document content:\n${docxFileContent}`
              : "";

          const userMessageForAnswering = `${conversationHistory
            .map((msg: any) => `${msg.role}: ${msg.content}`)
            .join("\n")}\nuser: ${prompt}${attachmentContext}`;

          const basePrompt = `Please help me edit this lesson. User request: ${prompt}\n\n${latexExamples}\n\nCurrent lesson content:\n${fileContent}`;
          let userMessageForEditing = basePrompt;
          if (attachedFile) {
            if (pdfFileContent) {
              userMessageForEditing += `\n\nReference PDF content:\n${pdfFileContent}`;
            } else if (docxFileContent) {
              userMessageForEditing += `\n\nReference Word document content:\n${docxFileContent}`;
            }
          } else {
            userMessageForEditing += `\nReply only with the edited lesson content, nothing else, no additional commentary.`;
          }

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

const createLessonFromTitleProcedure = publicProcedure
  .input(
    z.object({
      sessionId: z.string(),
      lessonTitle: z.string(),
    }),
  )
  .output(
    zAsyncIterable({
      yield: aiEventSchema,
      tracked: true,
    }),
  )
  .subscription(async function* ({ input }) {
    const { sessionId, lessonTitle } = input;
    console.log("[AI Router] Creating lesson from title:", lessonTitle);

    try {
      const eventQueue: Array<{ id: string; data: AIEvent }> = [];
      let finished = false;

      // Process lesson creation in background
      (async () => {
        try {
          // Indicate we're generating lesson content
          eventQueue.push({
            id: getNextEventId(),
            data: {
              type: "response_type" as const,
              responseType: "edit",
            },
          });

          const systemPrompt = `You are an expert lesson creator. Create a comprehensive, well-structured lesson based on the given title.

Your lesson should include:
1. A clear introduction explaining what students will learn
2. Main content sections with detailed explanations
3. Practical examples where appropriate
4. Interactive elements using these formats:
   - User Interaction blocks for questions: Use "User Interaction:" to create code blocks with askForEstimation() or ask() functions
   - Action blocks for activities: Use "Action:" to create code blocks with setDinoScale() or other actions
5. Use LaTeX for mathematical formulas when relevant: $$formula$$
6. Include images or media references if they would enhance learning
7. End with a summary or conclusion

Format the lesson in markdown. Make it engaging, educational, and appropriate for the topic.
Focus on creating practical, hands-on learning experiences.`;

          const userPrompt = `Create a comprehensive lesson with the title: "${lessonTitle}"

Please create a well-structured lesson that covers this topic thoroughly. Include interactive elements and make it engaging for learners.`;

          // Stream lesson creation with reasoning
          const lessonStream = streamGeminiEdit(userPrompt, systemPrompt);
          let lessonContent = "";

          for await (const item of lessonStream) {
            if (item.type === "reasoning") {
              eventQueue.push({
                id: getNextEventId(),
                data: {
                  type: "reasoning" as const,
                  content: item.content,
                },
              });
            } else if (item.type === "answer") {
              lessonContent = item.content;
            }
          }

          // Queue complete event with the generated lesson
          eventQueue.push({
            id: getNextEventId(),
            data: {
              type: "complete" as const,
              modifiedContent: lessonContent,
            },
          });
        } catch (error) {
          console.error("[AI Router] Lesson creation error:", error);
          eventQueue.push({
            id: getNextEventId(),
            data: {
              type: "error" as const,
              message:
                error instanceof Error
                  ? error.message
                  : "Failed to create lesson",
            },
          });
        }

        finished = true;
      })();

      // Yield events from the queue
      while (!finished || eventQueue.length > 0) {
        if (eventQueue.length > 0) {
          const event = eventQueue.shift()!;
          yield tracked(event.id, event.data);
        } else {
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
  });

export const aiRouter = router({
  uploadFile: uploadFileProcedure,
  streamEdit: streamEditProcedure,
  createLessonFromTitle: createLessonFromTitleProcedure,
});
