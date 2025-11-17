import { spawn } from "bun";
import fs from "fs/promises";
import path from "path";

export async function generateThumbnail(
  videoPath: string,
  onDelta?: (message: string) => void,
): Promise<string | undefined> {
  try {
    const videoDir = path.dirname(videoPath);
    const videoName = path.basename(videoPath, path.extname(videoPath));
    const thumbnailPath = path.join(videoDir, `${videoName}_thumbnail.png`);

    onDelta?.(`Generating thumbnail for ${path.basename(videoPath)}...`);

    // Use ffmpeg to extract a frame from the video
    // Try multiple positions to find a non-black frame
    const positions = ["10%", "25%", "50%", "75%", "90%"];

    for (const position of positions) {
      try {
        // First, get video duration
        const durationProc = spawn(
          [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            videoPath,
          ],
          {
            stdout: "pipe",
            stderr: "pipe",
          },
        );

        const durationOutput = await new Response(durationProc.stdout).text();
        const duration = parseFloat(durationOutput.trim());

        if (isNaN(duration) || duration <= 0) {
          console.error("Could not get video duration");
          continue;
        }

        // Calculate position in seconds
        const positionPercent = parseInt(position) / 100;
        const seekPosition = duration * positionPercent;

        // Extract frame at calculated position
        const extractProc = spawn(
          [
            "ffmpeg",
            "-ss",
            seekPosition.toString(),
            "-i",
            videoPath,
            "-vframes",
            "1",
            "-q:v",
            "2",
            "-vf",
            "scale=320:180",
            "-y", // Overwrite output file
            thumbnailPath,
          ],
          {
            stdout: "pipe",
            stderr: "pipe",
          },
        );

        await extractProc.exited;

        // Check if thumbnail was created and is not black
        const exists = await fs
          .access(thumbnailPath)
          .then(() => true)
          .catch(() => false);
        if (exists) {
          // Use ffmpeg to check if the image is mostly black
          const blackDetectProc = spawn(
            [
              "ffmpeg",
              "-i",
              thumbnailPath,
              "-vf",
              "blackdetect=d=0:pix_th=0.10",
              "-f",
              "null",
              "-",
            ],
            {
              stdout: "pipe",
              stderr: "pipe",
            },
          );

          const blackDetectOutput = await new Response(
            blackDetectProc.stderr,
          ).text();

          // If no black frames detected, we have a good thumbnail
          if (!blackDetectOutput.includes("blackdetect")) {
            onDelta?.(`Thumbnail generated at ${position} position`);
            return thumbnailPath;
          }

          // If mostly black, try next position
          console.log(
            `Thumbnail at ${position} is mostly black, trying next position...`,
          );
        }
      } catch (error) {
        console.error(`Error generating thumbnail at ${position}:`, error);
      }
    }

    // If all positions failed, try one more time at 2 seconds
    try {
      const finalProc = spawn(
        [
          "ffmpeg",
          "-ss",
          "2",
          "-i",
          videoPath,
          "-vframes",
          "1",
          "-q:v",
          "2",
          "-vf",
          "scale=320:180",
          "-y",
          thumbnailPath,
        ],
        {
          stdout: "pipe",
          stderr: "pipe",
        },
      );

      await finalProc.exited;

      const exists = await fs
        .access(thumbnailPath)
        .then(() => true)
        .catch(() => false);
      if (exists) {
        onDelta?.(`Thumbnail generated at 2 seconds`);
        return thumbnailPath;
      }
    } catch (error) {
      console.error("Final thumbnail attempt failed:", error);
    }

    onDelta?.(`Could not generate thumbnail for ${path.basename(videoPath)}`);
    return undefined;
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    onDelta?.(`Error generating thumbnail: ${error}`);
    return undefined;
  }
}
