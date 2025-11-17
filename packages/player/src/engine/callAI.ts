import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const callAI = async <T = string>(
  prompt: string,
  conversationHistory: { role: "user" | "assistant" | "system"; content: string }[],
  schema?: z.ZodSchema<T>
) => {
  let jsonSchema;
  if (schema) {
    const schemaJson = zodToJsonSchema(schema);
    jsonSchema = {
      name: "response",
      strict: true,
      schema: schemaJson,
    };
  }

  const response = await fetch("/api/callAI", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      conversationHistory,
      jsonSchema,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to call AI");
  }

  const data = await response.json();
  const content = data.response;

  if (schema) {
    return schema.parse(JSON.parse(content || "{}")) as T;
  }

  return content as T;
};
