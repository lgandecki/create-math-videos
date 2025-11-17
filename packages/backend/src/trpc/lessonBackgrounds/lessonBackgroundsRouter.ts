import { router } from "../trpcRouter";
import { generateBackground } from "./mutations/generateBackground";
import { confirmBackground } from "./mutations/confirmBackground";
import { deleteBackground } from "./mutations/deleteBackground";
import { checkBackground } from "./queries/checkBackground";
import { getBackground } from "./queries/getBackground";
import { renameBackground } from "./mutations/renameBackground";

export const lessonBackgroundsRouter = router({
  generateBackground,
  confirmBackground,
  deleteBackground,
  checkBackground,
  getBackground,
  renameBackground,
});
