import { GoogleGenAI, MediaResolution } from "@google/genai";
import fs from "fs";
import "dotenv/config";
import { DEST_DIR } from "./video_consts";

const GEMINI_DEBUG = process.env.GEMINI_DEBUG === "true";

const getModifiedContentSchema = (): any => {
  return {
    type: "OBJECT",
    properties: {
      requiresChanges: { type: "BOOLEAN" },
      changesNeeded: { type: "STRING" },
    },
    required: ["requiresChanges", "changesNeeded"],
  };
};

export async function* streamGeminiEdit(
  prompt: string,
  videoPath: string,
): AsyncIterable<{ type: "reasoning" | "answer"; content: string }> {
  const base64VideoFile = fs.readFileSync(videoPath, { encoding: "base64" });

  const model = "gemini-2.5-pro";
  const contents = [
    {
      role: "user",
      parts: [
        {
          inlineData: {
            data: base64VideoFile,
            mimeType: `video/mp4`,
          },
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ];

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  if (GEMINI_DEBUG) {
    console.log("LINE in streamGeminiEdit 24: streamGeminiEdit prompt", prompt);
  }

  try {
    const response = await ai.models.generateContentStream({
      model,
      contents,
      config: {
        responseSchema: getModifiedContentSchema(),
        thinkingConfig: {
          includeThoughts: true,
        },
        mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
      },
    });

    let answer = "";
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
    console.log(`cleanedAnswer`, cleanedAnswer);
    yield { type: "answer", content: cleanedAnswer };
  } catch (error) {
    console.error("[Gemini] Error in streamGeminiEdit:", error);
    throw error;
  }
}

export const getVisualHintsFromGemini = async (
  videoPath: string,
  thoughtsCallback?: (thoughts: string) => void,
): Promise<{ requiresChanges: boolean; changesNeeded: string }> => {
  const geminiPrompt = `Carefully analyze the provided AI-generated video for visual and mathematical accuracy.

Specifically, check for the following issues:

Visual glitches:
- Text or labels overlapping or obscuring each other.
- Elements being partially or fully invisible.
- Misalignment or incorrect positioning of text, labels, or visual elements.

Mathematical accuracy:
- Ensure geometric visuals (such as squares, triangles, angles, lines) correctly represent the mathematical concepts shown.
- Verify logical consistency and correctness of mathematical representations, ensuring proportions, labels, and alignments accurately illustrate the concept.

Clearly describe each identified issue and include a precise timestamp.

In the "changesNeeded" field, provide a concise, actionable instruction detailing exactly how the visuals or mathematical representations should be corrected. This instruction will be directly used by an AI video editor, so clarity and precision are essential.

If no visual or mathematical issues are detected, set "requiresChanges" to false and leave "changesNeeded" empty.

Your response **must** strictly adhere to the following JSON format:

{
  "requiresChanges": boolean,
  "changesNeeded": string
}
`;
  const iterable = streamGeminiEdit(geminiPrompt, videoPath);

  let finalAnswer = "";

  for await (const chunk of iterable) {
    if (chunk.type === "reasoning" && thoughtsCallback) {
      thoughtsCallback(chunk.content);
    } else if (chunk.type === "answer") {
      finalAnswer = chunk.content;
    }
  }

  // Now you can parse JSON and return as an object
  try {
    return JSON.parse(finalAnswer);
  } catch (e) {
    console.error("Failed parsing Gemini's final answer:", finalAnswer);
    throw new Error("Gemini response was not valid JSON.");
  }
};

if (require.main === module) {
  const result = await getVisualHintsFromGemini(
    `${DEST_DIR}/to-be-checked.mp4`,
    (thoughts) => {
      console.log(`thoughts`, thoughts);
    },
  );
  console.log(`result`, result);
}
