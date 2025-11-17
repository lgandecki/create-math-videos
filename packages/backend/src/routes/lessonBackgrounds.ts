import path from "path";
import { Router } from "express";
import fs from "fs/promises";
import { LESSONS_DIR } from "../trpc/lessons/lessonsShared";

export const lessonBackgroundsRouter: Router = Router();

// Get lesson background image
// THIS IS NEEDED IN THE PLAYER, WAIT BEFORE MOVING TO TRPC
lessonBackgroundsRouter.get("/api/v1/lesson-background", async (req, res) => {
  try {
    const { fileName } = req.query;

    const safeFileName = path.basename(fileName as string).replace(/\.md$/, "");
    const questionMarkReplacedFileName = safeFileName.replace("?", "%3F");
    const imagePath = path.join(
      LESSONS_DIR,
      `${questionMarkReplacedFileName}.png`,
    );

    // Check if file exists
    await fs.access(imagePath);

    // Set appropriate headers
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    // Send the file
    res.sendFile(imagePath);
  } catch (err) {
    console.log("ERROR in lessonBackgroundsRouter.get", err);
    res.status(404).json({ error: "Background image not found" });
  }
});
