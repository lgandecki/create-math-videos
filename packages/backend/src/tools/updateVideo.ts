import { z } from "zod";
import { callWithSchema } from "../callWithSchema";
import fs from "fs/promises";
import pathModule from "path";
import { DEST_DIR, MANIM_DIR } from "./video_consts";
import { generateThumbnail } from "./generateThumbnail";
import { inspect } from "bun";
import { callLLM } from "../callGeminiVercel";
import { getPath } from "./getPath";

interface VideoCreationEvent {
  type: string;
  subtype: string;
  is_error: boolean;
  duration_ms: number;
  duration_api_ms: number;
  result: string;
  session_id: string;
}

export const updateVideo = async (
  prompt: string,
  sessionId: string,
  onDelta: (delta: string) => void,
  onComplete: (
    videoPath?: string,
    sessionId?: string,
    thumbnailPath?: string,
  ) => void,
  sectionTitle?: string,
) => {
  const fullPrompt = `Update the manim python script using user instructions: '${prompt}' After creating the script, attempt to generate the video with 'source .venv/bin/activate && manim -qm FILE_NAME.py', if there are errors, fix them, and attempt to generate again, continue until the video is generated. Output with a path to a generated video as the last step. If you are unsure about the syntax, or if you get error when trying to generate, use context7 mcp to get current documentation for manim, otherwise feel free to just update the script.`;

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
      "--resume",
      sessionId,
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
  onComplete(finalVideoPath, newSessionId, finalThumbnailPath);
};
