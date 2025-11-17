import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { publicProcedure } from "../../trpcRouter";
import { encodeFileName } from "../../../fileNameEncoder";
import { LESSONS_DIR, ARCHIVE_DIR } from "../lessonsShared";
import {
  isValidFileName,
  INVALID_FILENAME_MESSAGE,
} from "../../../fileNameValidator";

export const deleteLesson = publicProcedure
  .input(
    z
      .object({ name: z.string() })
      .refine(({ name }) => isValidFileName(name), {
        message: INVALID_FILENAME_MESSAGE,
      }),
  )
  .mutation(async ({ input }) => {
    const decodedName = input.name;
    const encodedName = encodeFileName(decodedName.replace(".md", "")) + ".md";

    // Ensure archive directory exists
    await fs.mkdir(ARCHIVE_DIR, { recursive: true });

    // Create archived filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const archivedName = encodedName.replace(".md", `_${timestamp}.md`);

    const sourcePath = path.join(LESSONS_DIR, encodedName);
    const archivePath = path.join(ARCHIVE_DIR, archivedName);

    // Move file to archive
    await fs.rename(sourcePath, archivePath);

    return { success: true };
  });
