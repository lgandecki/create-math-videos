import { z } from "zod";
import { createGoogleGenerativeAI, google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateObject } from "ai";

export const callGeminiWithThinkingAndSchema = async <T>(
  prompt: string,
  zodSchema: z.ZodSchema<T>,
  model: string = "gemini-flash-latest",
) => {
  const { object } = await generateObject({
    model: google(model),
    schema: zodSchema,
    prompt,
  });

  return object as T;
};

export const callLLM = async <T>(prompt: string, zodSchema: z.ZodSchema<T>) => {
  // Check for available API keys in order of preference
  if (process.env.OPENAI_API_KEY) {
    const { object } = await generateObject({
      apiKey: process.env.OPENAI_API_KEY,
      model: openai("gpt5-mini"),
      schema: zodSchema,
      prompt,
    });
    return object as T;
  }

  if (process.env.GEMINI_API_KEY) {
    const customGoogle = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
    console.log(
      "Using custom Google model",
      customGoogle("gemini-flash-latest"),
      process.env.GEMINI_API_KEY,
    );
    const { object } = await generateObject({
      model: customGoogle("gemini-flash-latest"),
      schema: zodSchema,
      prompt,
    });
    return object as T;
  }

  if (process.env.OPENROUTER_API_KEY) {
    const { object } = await generateObject({
      apiKey: process.env.OPENROUTER_API_KEY,
      model: openrouter("gemini-flash-latest"),
      schema: zodSchema,
      prompt,
    });
    return object as T;
  }

  throw new Error(
    "No API key found. Please set OPENAI_API_KEY, GEMINI_API_KEY, or OPENROUTER_API_KEY environment variable.",
  );
};
