import { z } from "zod";
import { callWithSchema } from "../callWithSchema";
import fs from "fs/promises";
import pathModule from "path";
import { inspect } from "bun";
import { getVisualHintsFromGemini } from "./getVisualHintsFromGemini";
import { updateVideo } from "./updateVideo";
import { DEST_DIR, MANIM_DIR } from "./video_consts";
import { generateThumbnail } from "./generateThumbnail";
import { callLLM } from "../callGeminiVercel";
import { getPath } from "./getPath";

const RUN_WITH_GEMINI = false;
export interface VideoCreationEvent {
  type: string;
  subtype: string;
  is_error: boolean;
  duration_ms: number;
  duration_api_ms: number;
  result: string;
  session_id: string;
}

export const createVideoFake = async (
  prompt: string,
  onDelta: (delta: string) => void,
  onComplete: (
    videoPath: string,
    sessionId: string,
    thumbnailPath: string,
  ) => void,
  sectionTitle?: string,
) => {
  onDelta("Creating video...");
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Small delay
  // Return different fake videos based on section
  const fakeVideos = [
    {
      path: "/Introduction_1753902545330.mp4",
      sessionId: "977bdfa8-9b13-4f94-8e19-a76dc9e7bc1d",
      thumbnailPath: "/Introduction_1753902545330_thumbnail.png",
    },
    {
      path: "/Main_Concepts_What_is_a_Number_Line_1753902542642.mp4",
      sessionId: "54cca705-2ceb-49ca-95d9-88f31c5e838e",
      thumbnailPath:
        "/Main_Concepts_What_is_a_Number_Line_1753902542642_thumbnail.png",
    },
  ];
  const randomVideo = fakeVideos[Math.floor(Math.random() * fakeVideos.length)];
  onComplete(
    randomVideo.path,
    randomVideo.sessionId,
    randomVideo.thumbnailPath,
  );
};

export const createVideo = async (
  prompt: string,
  onDelta: (delta: string) => void,
  onComplete: (
    videoPath?: string,
    sessionId?: string,
    thumbnailPath?: string,
  ) => void,
  sectionTitle?: string,
) => {
  const fullPrompt = `Create a manim python script that would render a video using instructions: '${prompt}' After creating the script, attempt to generate the video with 'source .venv/bin/activate && manim -qm FILE_NAME.py', if there are errors, fix them, and attempt to generate again, continue until the video is generated. Output with a path to a generated video as the last step. If you are unsure about the syntax, or if you get error when trying to generate, use context7 mcp to get current documentation for manim, otherwise feel free to just generate the script.`;

  const allMessages: VideoCreationEvent[] = [];
  let buffer = ""; // Buffer for incomplete JSON lines

  // @ts-ignore
  const proc = Bun.spawn(
    [
      "claude",
      "--verbose",
      "--model",
      "claude-sonnet-4-5-20250929",
      "--output-format",
      "stream-json",
      "--permission-mode",
      "bypassPermissions",
      "-p",
      fullPrompt,
    ],
    {
      cwd: MANIM_DIR,
      stdout: "pipe",
      stderr: "pipe",
    },
  );

  // Read stdout
  const reader = proc.stdout.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      // Process complete lines
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep the last incomplete line in buffer

      for (const line of lines) {
        if (line.trim()) {
          try {
            const parsed = JSON.parse(line) as VideoCreationEvent;
            allMessages.push(parsed);
            console.log(
              "Parsed event:",
              inspect(parsed, { depth: Infinity, colors: true }),
            );
            onDelta(line);
          } catch (error) {
            console.error("Error parsing JSON line:", line, error);
            onDelta(line);
          }
        }
      }
    }

    // Process any remaining buffer
    if (buffer.trim()) {
      try {
        const parsed = JSON.parse(buffer) as VideoCreationEvent;
        allMessages.push(parsed);
      } catch (error) {
        console.error("Error parsing final buffer:", buffer, error);
      }
    }
  } finally {
    reader.releaseLock();
  }

  // Read stderr
  const stderrReader = proc.stderr.getReader();
  try {
    while (true) {
      const { done, value } = await stderrReader.read();
      if (done) break;

      const error = decoder.decode(value);
      console.error("Claude stderr:", error);
      allMessages.push({
        type: "error",
        subtype: "error",
        is_error: true,
        duration_ms: 0,
        duration_api_ms: 0,
        result: error,
        session_id: "",
      });
      onDelta(`Error: ${error}`);
    }
  } finally {
    stderrReader.releaseLock();
  }

  const exitCode = await proc.exited;
  console.log(`Claude process exited with code ${exitCode}`);

  let finalVideoPath: string | undefined;
  let finalThumbnailPath: string | undefined;

  if (allMessages.length > 0) {
    const lastEvent = allMessages[allMessages.length - 1];
    try {
      const path = await getPath(lastEvent);
      // INSERT_YOUR_CODE
      // Copy the file to the specified destination

      // Generate unique filename based on section title or timestamp
      let filename = pathModule.basename(path);
      if (sectionTitle) {
        // Sanitize section title for filename
        const sanitizedTitle = sectionTitle
          .replace(/[^a-zA-Z0-9]/g, "_")
          .replace(/_+/g, "_")
          .replace(/^_|_$/g, "");
        const ext = pathModule.extname(path);
        const timestamp = Date.now();
        filename = `${sanitizedTitle}_${timestamp}${ext}`;
      }

      const destPath = pathModule.join(DEST_DIR, filename);
      try {
        await fs.copyFile(path, destPath);
        console.log(`Copied video to ${destPath}`);

        // Ensure file is fully written and give Vite time to detect it
        await fs.access(destPath, fs.constants.R_OK);

        // Generate thumbnail for the video
        const thumbnailPath = await generateThumbnail(destPath, onDelta);

        if (thumbnailPath) {
          // Copy thumbnail to public directory
          const thumbnailFilename = pathModule.basename(thumbnailPath);
          finalThumbnailPath = `/${thumbnailFilename}`;
          console.log(`Thumbnail available at: ${finalThumbnailPath}`);
        }

        await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay for Vite to pick up the new files

        onDelta(`Video copied to ${destPath}`);
        finalVideoPath = `/${filename}`;
        onDelta(`Video available at: ${finalVideoPath}`);
      } catch (copyError) {
        console.error("Error copying video file:", copyError);
        onDelta(`Error copying video file: ${copyError}`);
      }
    } catch (error) {
      console.error("Error extracting path:", error);
      onDelta(`Error extracting video path: ${error}`);
    }
  }

  const newSessionId = allMessages[allMessages.length - 1].session_id;
  console.log("newSessionId", newSessionId);
  if (finalVideoPath) {
    if (RUN_WITH_GEMINI) {
      const visualHints = await getVisualHintsFromGemini(
        `${DEST_DIR}${finalVideoPath}`,
        onDelta,
      );
      if (visualHints.requiresChanges) {
        onDelta(`Changes prompt: ${visualHints.changesNeeded}`);
        await updateVideo(
          visualHints.changesNeeded,
          newSessionId,
          onDelta,
          (videoPath, sessionId, thumbnailPath) => {
            onComplete(videoPath, sessionId, thumbnailPath);
          },
          sectionTitle,
        );
      } else {
        onComplete(finalVideoPath, newSessionId, finalThumbnailPath);
      }
    } else {
      onComplete(finalVideoPath, newSessionId, finalThumbnailPath);
    }
  }
};

if (require.main === module) {
  createVideo(
    `# The Pythagorean Theorem

## Introduction

*   Display a simple right-angled triangle in the center of the screen.
*   Introduce the title: "The Pythagorean Theorem."
*   Briefly state its purpose: "A fundamental rule for right-angled triangles."

## Understanding the Relationship

*   Highlight the right angle of the triangle.
*   Label the two shorter sides (legs) as 'a' and 'b'.
*   Label the longest side (hypotenuse), opposite the right angle, as 'c'.
*   Animate a square forming on side 'a' (representing a²).
*   Animate a square forming on side 'b' (representing b²).
*   Animate the areas of the squares on 'a' and 'b' visually combining and then perfectly fitting into a square that forms on side 'c'.
*   Display the formula clearly: "a² + b² = c²".

## Quick Application

*   Show a new right-angled triangle with two sides labeled with numerical values (e.g., side 'a' = 3 units, side 'b' = 4 units). The hypotenuse 'c' should be unknown.
*   Prompt: "Let's find the missing side 'c'."
*   Show the substitution into the formula: "3² + 4² = c²".
*   Animate the calculation steps:
    *   "9 + 16 = c²"
    *   "25 = c²"
    *   "c = √25"
    *   "c = 5"
*   Replace the 'c' label on the triangle with '5'.

## Conclusion

*   Display the right-angled triangle again.
*   Reinforce the formula: "a² + b² = c²".
*   Summarize its significance: "The sum of the squares of the two shorter sides equals the square of the longest side."`,
    (delta) => {
      console.log(`delta`, delta);
    },
    (videoPath, sessionId, thumbnailPath) => {
      console.log(`videoPath`, videoPath);
      console.log(`sessionId`, sessionId);
      console.log(`thumbnailPath`, thumbnailPath);
    },
    "Pythagorean Theorem",
  );
}
