import OpenAI from "openai";
import { zodResponseFormat, zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import "dotenv/config";

const client = new OpenAI({});

export const callAI = async <T>(
  prompt: string,
  conversationHistory: {
    role: "user" | "assistant" | "system";
    content: string;
  }[],
  schema: z.ZodSchema<T>,
  responseCallback?: (response: string) => void,
  reasoningCallback?: (reasoning: string) => void,
): Promise<void> => {
  const messagesForApi: OpenAI.Responses.ResponseInputItem[] = [
    ...conversationHistory,
    { role: "user", content: prompt },
  ];

  const stream = client.responses.stream({
    model: "o4-mini",
    reasoning: {
      effort: "low",
      summary: "auto",
    },
    text: {
      format: zodTextFormat(schema, "response"),
    },
    input: messagesForApi,
  });

  stream
    .on("response.refusal.delta", (event) => {
      console.log("Refusal:", event.delta);
    })
    .on("response.reasoning_summary.delta", (event) => {
      console.log("Reasoning summary delta", event);
    })
    .on("response.reasoning_summary_part.added", (event) => {
      console.log("Reasoning summary part added", event);
    })
    .on("response.reasoning_summary_text.delta", (event) => {
      // console.log("Reasoning summary text delta", event);
    })
    .on("response.reasoning_summary_text.done", (event) => {
      console.log("Reasoning summary text complete", event);
    })
    .on("response.reasoning_summary.done", (event) => {
      console.log("Reasoning summary complete", event);
    })
    .on("response.reasoning.delta", (event) => {
      console.log("Reasoning delta", event);
      // reasoningCallback?.(event.delta);
    })
    .on("response.reasoning.done", (event) => {
      console.log("Reasoning complete:", event.text);
      reasoningCallback?.(event.text);
    })
    .on("response.output_text.delta", (event) => {
      responseCallback?.(event.delta);
    })
    .on("response.output_text.done", (event) => {
      console.log("Output complete");
    });

  // Wait for the stream to complete
  await stream.finalResponse();
};
