import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { publicProcedure } from "../../trpcRouter";
import { LESSONS_DIR } from "../../lessons/lessonsShared";

export const checkBackground = publicProcedure
  .input(
    z.object({
      fileName: z.string().min(1),
      isProposed: z.boolean().default(false),
    }),
  )
  .query(async ({ input }) => {
    const { fileName, isProposed } = input;

    const safeFileName = path.basename(fileName).replace(/\.md$/, "");
    const suffix = isProposed ? "-propose" : "";
    const imagePath = path.join(LESSONS_DIR, `${safeFileName}${suffix}.png`);

    try {
      await fs.access(imagePath);
      // For proposed images, we need to append -propose to the fileName in the URL
      const urlFileName = isProposed ? `${fileName}-propose` : fileName;
      return {
        exists: true,
        url: `/api/v1/lesson-background?fileName=${encodeURIComponent(urlFileName)}`,
      };
    } catch {
      return {
        exists: false,
        url: null,
      };
    }
  });
