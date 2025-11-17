import * as trpcExpress from "@trpc/server/adapters/express";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { router } from "./trpcRouter";
import { lessonsRouter } from "./lessons/lessonsRouter";
import { lessonBackgroundsRouter } from "./lessonBackgrounds/lessonBackgroundsRouter";
import { uploadsRouter } from "./uploads/uploadsRouter";
import { aiRouter } from "./ai/aiRouter";
import { videoAiRouter } from "./ai/videoAiRouter";
import { fakeAiRouter } from "./ai/fakeAiRouter";
import { videoOperationsRouter } from "./videoOperations/videoOperationsRouter";

export const appRouter = router({
  lessons: lessonsRouter,
  lessonBackgrounds: lessonBackgroundsRouter,
  uploads: uploadsRouter,
  ai: aiRouter,
  videoAi: videoAiRouter,
  fakeAi: fakeAiRouter,
  videoOperations: videoOperationsRouter,
});

export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context yet
export type AppRouter = typeof appRouter;

export const createTRPCMiddleware = () => {
  return trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  });
};
