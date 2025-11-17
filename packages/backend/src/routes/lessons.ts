import { Router } from "express";
import path from "path";
import { resolveSlugToFile } from "../slugUtils";
import { nodeSingleFileLoader } from "../nodeSingleFileLoader";
import { nodeLoader } from "../nodeLoader";

const LESSONS_DIR = path.join(process.cwd(), "lessons");

export const lessonsRouter: Router = Router();

// NOTE: Most endpoints have been migrated to TRPC. Only keeping the API endpoint needed by the player.

lessonsRouter.get("/api/v1/lessons", async (req, res) => {
  try {
    let lessonsMap;
    if (req.query.lessonsDir) {
      const lessonsFile = req.query.lessonsDir as string;
      const foundFileName = await resolveSlugToFile(lessonsFile, LESSONS_DIR);
      if (!foundFileName) {
        return res.status(404).json({ error: "File not found" });
      }

      lessonsMap = await nodeSingleFileLoader(
        path.join(LESSONS_DIR, foundFileName),
      );
      console.log("lessonsMap", lessonsMap);
    } else {
      console.log("lessonsPath", LESSONS_DIR);
      lessonsMap = await nodeLoader(LESSONS_DIR);
    }
    const lessons = Object.fromEntries(lessonsMap);
    console.log("lessons", lessons);
    res.json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({ error: "Failed to fetch lessons" });
  }
});
