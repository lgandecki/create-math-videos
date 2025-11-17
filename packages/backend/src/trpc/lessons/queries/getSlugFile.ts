import { z } from "zod";
import { publicProcedure } from "../../trpcRouter";
import { resolveSlugToFile } from "../../../slugUtils";
import { LESSONS_DIR } from "../lessonsShared";

export const getSlugFile = publicProcedure
  .input(z.object({ slug: z.string() }))
  .query(async ({ input }) => {
    const { slug } = input;
    const fileName = await resolveSlugToFile(slug, LESSONS_DIR);

    if (!fileName) {
      throw new Error("No file found for this slug");
    }

    return { fileName };
  });
