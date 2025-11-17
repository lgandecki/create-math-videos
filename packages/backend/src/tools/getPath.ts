import { callLLM } from "../callGeminiVercel";
import type { VideoCreationEvent } from "./createVideo";
import { z } from "zod";

export const getPath = async (lastEvent: VideoCreationEvent) => {
  const result = lastEvent.result;
  const videoPath = await callLLM(
    `Extract the path to the video from the following text: ${result}`,
    z.object({
      path: z.string().describe("Path to the video"),
    }),
  );
  console.log("videoPath", videoPath);
  return videoPath.path;
};

if (require.main === module) {
  const lastEvent = {
    result:
      "The video was created successfully and is available at /path/to/video.mp4",
  };
  const path = await getPath(lastEvent);
  console.log("path", path);
}
