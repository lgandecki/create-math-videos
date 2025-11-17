import { publicProcedure } from "../../trpcRouter";
import { z } from "zod";
import { LESSONS_DIR } from "../lessonsShared";
import { encodeFileName } from "../../../fileNameEncoder";
import path from "path";
import fs from "fs/promises";

// Save file
export const saveLesson = publicProcedure
  .input(z.object({ name: z.string(), content: z.string() }))
  .mutation(async ({ input }) => {
    const decodedName = input.name;
    const encodedName = encodeFileName(decodedName.replace(".md", "")) + ".md";

    await fs.writeFile(path.join(LESSONS_DIR, encodedName), input.content);
  });
