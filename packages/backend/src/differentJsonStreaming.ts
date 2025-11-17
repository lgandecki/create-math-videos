import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";
import "dotenv/config";
import { JSONParser } from "@streamparser/json";

const replyEvaluationSchema = z.object({
  isTrue: z.boolean(),
  reply: z.string(),
});
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});
export const callWithJsonStreaming = async (
  prompt: string,
  conversationHistory: {
    role: "user" | "assistant" | "system";
    content: string;
  }[],
  onResponseDelta?: (delta: string) => void,
  onComplete?: () => void,
  onAnswerEvaluated?: (isTrue: boolean) => void,
) => {
  const messagesForApi: OpenAI.Responses.ResponseInputItem[] = [
    ...conversationHistory,
    { role: "user", content: prompt },
  ];

  const stream = client.responses.stream({
    model: "gpt-4o",
    input: messagesForApi,
    text: {
      format: zodTextFormat(replyEvaluationSchema, "replyEvaluation"),
    },
  });

  // Set up the parser inside the function for each call
  const parser = new JSONParser({
    emitPartialTokens: true, // Enable if needed for more granular parsing
    emitPartialValues: true, // Enable partial value emission for strings
  });

  let replyDisplayed = "";

  parser.onValue = ({ value, key, partial }) => {
    if (key === "isTrue" && !partial) {
      if (typeof value === "boolean") {
        onAnswerEvaluated?.(value);
      }
    } else if (key === "reply") {
      if (typeof value === "string") {
        const newChunk = value.slice(replyDisplayed.length);
        if (newChunk.length > 0) {
          onResponseDelta?.(newChunk);
        }
        replyDisplayed = value;
      }
    }
  };

  stream
    .on("response.output_text.delta", (event) => {
      parser.write(event.delta); // Feed each delta chunk to the parser
    })
    .on("response.output_text.done", (event) => {
      onComplete?.();
    });
  await stream.finalResponse();
};
