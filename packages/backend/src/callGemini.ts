import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const GEMINI_DEBUG = process.env.GEMINI_DEBUG === "true";

const getModifiedContentSchema = (): any => {
  return {
    type: "OBJECT",
    properties: {
      modifiedContent: { type: "STRING" },
    },
    required: ["modifiedContent"],
  };
};

export async function* streamGeminiEdit(
  prompt: string,
  systemPrompt: string,
  model = "gemini-2.5-pro",
): AsyncIterable<{ type: "reasoning" | "answer"; content: string }> {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  if (GEMINI_DEBUG) {
    console.log("LINE in streamGeminiEdit 24: streamGeminiEdit prompt", prompt);
  }

  try {
    let answer = "";
    const response = await ai.models.generateContentStream({
      model,
      contents: prompt,
      config: {
        responseSchema: getModifiedContentSchema(),
        thinkingConfig: {
          includeThoughts: true,
        },
        systemInstruction: [
          {
            text: systemPrompt,
          },
        ],
      },
    });

    for await (const chunk of response) {
      for (const part of chunk.candidates?.[0]?.content?.parts ?? []) {
        if (!part.text) {
          continue;
        } else if (part.thought) {
          yield { type: "reasoning", content: part.text };
        } else {
          answer = answer + part.text;
        }
      }
    }
    const cleanedAnswer = answer
      .replace(/^```json\n/, "")
      .replace(/```$/, "")
      .replace(/^```\n/, "")
      .replace(/^```markdown\n/, "");
    yield { type: "answer", content: cleanedAnswer };
  } catch (error) {
    console.error("[Gemini] Error in streamGeminiEdit:", error);
    throw error;
  }
}

export async function* streamGeminiGeneric(
  prompt: string,
  systemPrompt: string,
  shouldThink: boolean,
): AsyncIterable<string> {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  if (GEMINI_DEBUG) {
    console.log(
      "LINE in streamGeminiGeneric 77: streamGeminiGeneric prompt",
      prompt,
    );
  }

  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: {
          includeThoughts: shouldThink,
        },
        systemInstruction: [
          {
            text: systemPrompt,
          },
        ],
      },
    });

    for await (const chunk of response) {
      for (const part of chunk.candidates?.[0]?.content?.parts ?? []) {
        if (!part.text) {
          continue;
        } else if (part.thought) {
          // Ignore thoughts for generic, as in original no onThought for answer
        } else {
          yield part.text;
        }
      }
    }
  } catch (error) {
    console.error("[Gemini] Error in streamGeminiGeneric:", error);
    throw error;
  }
}

export const callGeminiDecision = async (
  prompt: string,
  systemPrompt: string,
) => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  if (GEMINI_DEBUG) {
    console.log(
      "LINE in callGeminiDecision 121: callGeminiDecision prompt",
      prompt,
    );
  }

  let answer = "";
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      thinkingConfig: {
        includeThoughts: false,
      },
      systemInstruction: [
        {
          text: systemPrompt,
        },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts ?? []) {
    if (part.text) {
      answer += part.text;
    }
  }
  const cleanedAnswer = answer
    .replace(/^```json\n/, "")
    .replace(/```$/, "")
    .replace(/^```\n/, "")
    .replace(/^```markdown\n/, "");
  return cleanedAnswer;
};
