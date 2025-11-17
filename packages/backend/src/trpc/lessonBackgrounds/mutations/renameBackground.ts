import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { publicProcedure } from "../../trpcRouter";
import { LESSONS_DIR } from "../../lessons/lessonsShared";
import { encodeFileName } from "../../../fileNameEncoder";

export const renameBackground = publicProcedure
  .input(
    z.object({
      oldName: z.string(),
      newName: z.string().min(1),
    }),
  )
  .mutation(async ({ input }) => {
    const { oldName, newName } = input;

    const encodedOldName = encodeFileName(oldName.replace(".md", "")) + ".png";
    const encodedNewName = encodeFileName(newName) + ".png";

    const oldPath = path.join(LESSONS_DIR, encodedOldName);
    const newPath = path.join(LESSONS_DIR, encodedNewName);

    try {
      await fs.access(newPath);
      throw new Error("A file with this name already exists");
    } catch (error: any) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }

    await fs.rename(oldPath, newPath);
    return { success: true };
  });
