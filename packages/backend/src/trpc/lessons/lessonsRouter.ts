import { router } from "../trpcRouter";

import { lessonsList } from "./queries/lessonsList";
import { getLesson } from "./queries/getLesson";
import { getSlugFile } from "./queries/getSlugFile";
import { saveLesson } from "./mutations/saveLesson";
import { createLesson } from "./mutations/createLesson";
import { deleteLesson } from "./mutations/deleteLesson";
import { renameLesson } from "./mutations/renameLesson";

export const lessonsRouter = router({
  list: lessonsList,
  getLesson,
  getSlugFile,
  saveLesson,
  createLesson,
  deleteLesson,
  renameLesson,
});
