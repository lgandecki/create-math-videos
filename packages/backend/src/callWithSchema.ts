import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import OpenAI from "openai";
import "dotenv/config";

export const callWithSchema = async <T = string>(
  prompt: string,
  schema: z.ZodSchema<T>,
) => {
  const client = new OpenAI({});
  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "o4-mini",
    reasoning_effort: "low",
    response_format: zodResponseFormat(schema, "response"),
  });
  if (chatCompletion.choices[0].message.content) {
    const parsedContent = JSON.parse(chatCompletion.choices[0].message.content);
    return parsedContent as T;
  } else {
    throw new Error("No content returned from the model");
  }
};
