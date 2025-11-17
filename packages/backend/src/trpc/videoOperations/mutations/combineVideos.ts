import { spawn } from "bun";
import fs from "fs/promises";
import path from "path";
import { DEST_DIR } from "../../../tools/video_consts";

export async function combineVideos(
  videoPaths: string[],
  outputFileName?: string,
): Promise<{ success: boolean; outputPath?: string; error?: string }> {
  try {
    // Generate output filename with timestamp if not provided
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const finalOutputName = outputFileName || `combined_video_${timestamp}.mp4`;
    const outputPath = path.join(DEST_DIR, finalOutputName);

    // Create a temporary file list for ffmpeg concat
    const fileListPath = path.join(DEST_DIR, `filelist_${timestamp}.txt`);

    // Convert relative paths to absolute paths and create file list content
    const fileListContent = videoPaths
      .map((videoPath) => {
        // If path starts with /, it's already relative to public folder
        const absolutePath = videoPath.startsWith("/")
          ? path.join(DEST_DIR, videoPath)
          : videoPath;
        return `file '${absolutePath}'`;
      })
      .join("\n");

    // Write the file list
    await fs.writeFile(fileListPath, fileListContent);

    console.log("Combining videos with ffmpeg...");
    console.log("File list content:", fileListContent);

    // Use ffmpeg to concatenate videos
    const ffmpegProcess = spawn(
      [
        "ffmpeg",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        fileListPath,
        "-c",
        "copy", // Copy without re-encoding for speed and quality
        "-y", // Overwrite output file if exists
        outputPath,
      ],
      {
        stdout: "pipe",
        stderr: "pipe",
      },
    );

    // Collect stderr for error reporting
    const stderrText = await new Response(ffmpegProcess.stderr).text();

    // Wait for process to complete
    const exitCode = await ffmpegProcess.exited;

    // Clean up the temporary file list
    await fs.unlink(fileListPath).catch(() => {
      // Ignore errors if file doesn't exist
    });

    if (exitCode === 0) {
      // Check if output file was created
      const exists = await fs
        .access(outputPath)
        .then(() => true)
        .catch(() => false);

      if (exists) {
        // Return the relative path for serving
        const relativePath = `/${finalOutputName}`;
        console.log("Videos combined successfully:", relativePath);
        return {
          success: true,
          outputPath: relativePath,
        };
      } else {
        return {
          success: false,
          error: "Output file was not created",
        };
      }
    } else {
      console.error("FFmpeg error:", stderrText);
      return {
        success: false,
        error: `FFmpeg failed with exit code ${exitCode}: ${stderrText}`,
      };
    }
  } catch (error) {
    console.error("Error combining videos:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
