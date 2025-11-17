import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { publicProcedure } from "../../trpcRouter";
import { LESSONS_DIR } from "../../lessons/lessonsShared";
import {
  isValidFileName,
  INVALID_FILENAME_MESSAGE,
} from "../../../fileNameValidator";

export const confirmBackground = publicProcedure
  .input(
    z
      .object({
        fileName: z.string().min(1),
      })
      .refine(({ fileName }) => isValidFileName(fileName), {
        message: INVALID_FILENAME_MESSAGE,
      }),
  )
  .mutation(async ({ input }) => {
    const { fileName } = input;

    // Safe to use after validation
    const safeFileName = path.basename(fileName).replace(/\.md$/, "");
    const proposedImagePath = path.join(
      LESSONS_DIR,
      `${safeFileName}-propose.png`,
    );
    const finalImagePath = path.join(LESSONS_DIR, `${safeFileName}.png`);

    // Check if proposed image exists
    try {
      await fs.access(proposedImagePath);
    } catch {
      throw new Error("Proposed background image not found");
    }

    // Remove existing final image if it exists
    try {
      await fs.unlink(finalImagePath);
    } catch {
      // File doesn't exist, which is fine
    }

    // Rename proposed image to final image
    await fs.rename(proposedImagePath, finalImagePath);

    return {
      success: true,
      message: "Background image confirmed successfully",
    };
  });
