import { publicProcedure } from "../../trpcRouter";
import { z } from "zod";
import path from "path";
import { LESSONS_DIR } from "../../lessons/lessonsShared";
import fs from "fs/promises";

export const getBackground = publicProcedure
  .input(
    z.object({
      fileName: z.string().min(1),
    }),
  )
  .query(async ({ input }) => {
    const { fileName } = input;

    const safeFileName = path.basename(fileName).replace(/\.md$/, "");
    const confirmedFileName = `${safeFileName}`;
    const proposedFileName = `${safeFileName}-propose`;

    // Check for proposed file first
    try {
      const proposedImagePath = path.join(
        LESSONS_DIR,
        `${proposedFileName}.png`,
      );
      console.log("Checking proposed file:", proposedImagePath);
      await fs.access(proposedImagePath);

      console.log("Proposed file found!");
      return {
        url: `/api/v1/lesson-background?fileName=${encodeURIComponent(proposedFileName)}`,
        isConfirmed: false,
      };
    } catch (error) {
      const fsError = error as NodeJS.ErrnoException;
      console.log("Proposed file not found:", fsError.code);
    }

    // Check for confirmed file
    try {
      const confirmedImagePath = path.join(
        LESSONS_DIR,
        `${confirmedFileName}.png`,
      );
      console.log("Checking confirmed file:", confirmedImagePath);
      await fs.access(confirmedImagePath);

      console.log("Confirmed file found!");
      return {
        url: `/api/v1/lesson-background?fileName=${encodeURIComponent(confirmedFileName)}`,
        isConfirmed: true,
      };
    } catch (error) {
      const fsError = error as NodeJS.ErrnoException;
      console.log("Confirmed file not found:", fsError.code);
    }

    // Neither file exists
    console.log("No background image found, returning null");
    return {
      url: null,
      isConfirmed: null,
    };
  });
