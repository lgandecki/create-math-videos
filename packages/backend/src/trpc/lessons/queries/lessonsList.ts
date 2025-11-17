import fs from "fs/promises";

import { publicProcedure } from "../../trpcRouter";
import { LESSONS_DIR } from "../lessonsShared";

export const lessonsList = publicProcedure.query(async () => {
  const files = await fs.readdir(LESSONS_DIR);
  const mdFiles = files.filter((f) => f.endsWith(".md"));
  mdFiles.sort((a, b) =>
    a.localeCompare(b, "en", { numeric: true, sensitivity: "base" }),
  );
  return mdFiles;
});
