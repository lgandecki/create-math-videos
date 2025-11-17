import { z } from "zod";
import { router, publicProcedure } from "../trpcRouter";
import { combineVideos } from "./mutations/combineVideos";

export const videoOperationsRouter = router({
  combineVideos: publicProcedure
    .input(
      z.object({
        videoPaths: z.array(z.string()),
        outputFileName: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return await combineVideos(input.videoPaths, input.outputFileName);
    }),
});
