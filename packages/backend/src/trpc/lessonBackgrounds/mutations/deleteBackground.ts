import z from "zod";
import path from "path";
import { promises as fs } from "fs";
import { publicProcedure } from "../../trpcRouter";
import { LESSONS_DIR } from "../../lessons/lessonsShared";

export const deleteBackground = publicProcedure
  .input(
    z.object({
      fileName: z.string().min(1),
    }),
  )
  .mutation(async ({ input }) => {
    // Extract the base name, removing either ".md" or "-propose.md"
    const baseFileName = path
      .basename(input.fileName)
      .replace(/-propose\.md$|\.md$/, "");

    const standardPath = path.join(LESSONS_DIR, `${baseFileName}.png`);
    const proposedPath = path.join(LESSONS_DIR, `${baseFileName}-propose.png`);

    let wasDeleted = false;

    // Attempt to delete the proposed image
    try {
      await fs.unlink(proposedPath);
      wasDeleted = true;
    } catch (error) {
      // If the error is anything other than "file not found", it's a real issue.
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw new Error("Failed to delete proposed background image");
      }
      // If ENOENT, we just ignore it and proceed to check the standard path.
    }

    // Attempt to delete the standard image
    try {
      await fs.unlink(standardPath);
      wasDeleted = true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw new Error("Failed to delete standard background image");
      }
    }

    // If at least one file was successfully deleted, return success
    if (wasDeleted) {
      return {
        success: true,
        message: "Background image(s) deleted successfully",
      };
    }

    // If we get here, neither file existed.
    throw new Error("Background image not found");
  });
