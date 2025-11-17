import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { publicProcedure } from "../../trpcRouter";
import { generateBackgroundsWithOpenAI } from "../../../tools/generateBackgroundsWithOpenAI";
import { LESSONS_DIR } from "../../lessons/lessonsShared";

export const generateBackground = publicProcedure
  .input(
    z.object({
      fileName: z.string().min(1),
      fileContent: z.string().min(1),
    }),
  )
  .mutation(async ({ input }) => {
    const { fileName, fileContent } = input;

    const image = await generateBackgroundsWithOpenAI(fileContent);

    if (!image) {
      throw new Error("No image file found.");
    }

    const safeFileName = path.basename(fileName).replace(/\.md$/, "");

    await fs.writeFile(
      path.join(LESSONS_DIR, `${safeFileName}-propose.png`),
      image,
    );

    return { success: true };
  });
