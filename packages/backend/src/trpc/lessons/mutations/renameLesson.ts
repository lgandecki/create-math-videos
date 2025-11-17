import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { publicProcedure } from "../../trpcRouter";
import { encodeFileName } from "../../../fileNameEncoder";
import { LESSONS_DIR } from "../lessonsShared";

export const renameLesson = publicProcedure
  .input(
    z.object({
      oldName: z.string(),
      newName: z.string().min(1),
    }),
  )
  .mutation(async ({ input }) => {
    const { oldName, newName } = input;

    // Encode both old and new names
    const decodedOldName = oldName;
    const encodedOldName =
      encodeFileName(decodedOldName.replace(".md", "")) + ".md";
    const encodedNewName = encodeFileName(newName) + ".md";

    const oldPath = path.join(LESSONS_DIR, encodedOldName);
    const newPath = path.join(LESSONS_DIR, encodedNewName);

    // Check if new file already exists
    try {
      await fs.access(newPath);
      throw new Error("A file with this name already exists");
    } catch (error: any) {
      if (error.code !== "ENOENT") {
        throw error;
      }
      // New file doesn't exist, proceed with rename
    }

    // Rename the file
    await fs.rename(oldPath, newPath);

    // Update the content to reflect the new title
    const content = await fs.readFile(newPath, "utf-8");
    const updatedContent = content.replace(/^# .+$/m, `# ${newName}`);
    await fs.writeFile(newPath, updatedContent);

    return {
      success: true,
      fileName: encodedNewName,
    };
  });
