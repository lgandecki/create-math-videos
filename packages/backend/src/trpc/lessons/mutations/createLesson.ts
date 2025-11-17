import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { publicProcedure } from "../../trpcRouter";
import { encodeFileName } from "../../../fileNameEncoder";
import { LESSONS_DIR } from "../lessonsShared";
import { lessonTemplate } from "../../../../shared/lessonTemplate";

export const createLesson = publicProcedure
  .input(
    z.object({
      fileName: z.string().min(1),
      content: z.string().optional().default(""),
    }),
  )
  .mutation(async ({ input }) => {
    const { fileName, content } = input;

    // Encode the file name for filesystem safety
    const encodedFileName = encodeFileName(fileName);
    const finalFileName = `${encodedFileName}.md`;
    const filePath = path.join(LESSONS_DIR, finalFileName);

    // Check if file already exists
    try {
      await fs.access(filePath);
      throw new Error("File already exists");
    } catch (error: any) {
      if (error.code !== "ENOENT") {
        throw error;
      }
      // File doesn't exist, proceed with creation
    }

    // Create the file with the original (unencoded) file name as the header
    const fileContent = content || `# ${fileName}\n\n${lessonTemplate}`;

    await fs.writeFile(filePath, fileContent);

    return {
      success: true,
      fileName: finalFileName,
    };
  });
