import OpenAI from "openai";
import "dotenv/config"; // Uncomment if needed for env loading

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "", // Use process.env for server
});

export const originalCallAI = async (
  prompt: string,
  conversationHistory: {
    role: "user" | "assistant" | "system";
    content: string;
  }[],
  jsonSchema?: { name: string; schema: object; strict: boolean },
) => {
  const messagesForApi: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    ...conversationHistory,
    { role: "user", content: prompt },
  ];

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: messagesForApi,
    // @ts-ignore
    response_format: jsonSchema
      ? { type: "json_schema", json_schema: jsonSchema }
      : { type: "text" },
  });

  return response.choices[0].message.content;
};

export const originalCallAIWithStreaming = async (
  prompt: string,
  conversationHistory: {
    role: "user" | "assistant" | "system";
    content: string;
  }[],
  responseCallback?: (response: string) => void,
  doneCallback?: () => void,
  jsonSchema?: { name: string; schema: object; strict: boolean },
) => {
  const messagesForApi: OpenAI.Responses.ResponseInputItem[] = [
    ...conversationHistory,
    { role: "user", content: prompt },
  ];

  const stream = client.responses.stream({
    model: "gpt-4o",
    input: messagesForApi,
  });

  stream
    .on("response.output_text.delta", (event) => {
      responseCallback?.(event.delta);
    })
    .on("response.output_text.done", (event) => {
      doneCallback?.();
    });
  await stream.finalResponse();
};
