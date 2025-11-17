import { publicProcedure } from "../../trpcRouter";
import { z } from "zod";
import { LESSONS_DIR } from "../lessonsShared";
import { encodeFileName } from "../../../fileNameEncoder";
import path from "path";
import fs from "fs/promises";

export const getLesson = publicProcedure
  .input(z.object({ name: z.string() }))
  .query(async ({ input }) => {
    const decodedName = input.name;
    const encodedName = encodeFileName(decodedName.replace(".md", "")) + ".md";

    const content = await fs.readFile(
      path.join(LESSONS_DIR, encodedName),
      "utf-8",
    );
    return { content };
  });
