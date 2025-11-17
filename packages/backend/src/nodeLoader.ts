import fs from "fs/promises";
import path from "path";

export type CourseData = Map<string, string[]>;

/**
 * A loader for the Node.js environment. It reads the file system
 * to discover lessons and their corresponding exercise markdown files.
 * @param lessonsDir The path to the root lessons directory.
 * @returns A Promise that resolves to the CourseData map.
 */
export async function nodeLoader(lessonsDir: string): Promise<CourseData> {
  const courseData: CourseData = new Map();
  try {
    const lessonFolders = await fs.readdir(lessonsDir, { withFileTypes: true });

    for (const lessonFolder of lessonFolders) {
      if (lessonFolder.isDirectory()) {
        const lessonName = lessonFolder.name;
        const lessonPath = path.join(lessonsDir, lessonName);
        const exerciseFiles = await fs.readdir(lessonPath);

        const exercises: string[] = [];
        // Read the content of each markdown file in the lesson folder
        for (const file of exerciseFiles.sort()) {
          // Sort to ensure consistent order
          if (file.endsWith(".md")) {
            const markdownContent = await fs.readFile(
              path.join(lessonPath, file),
              "utf-8",
            );
            exercises.push(markdownContent);
          }
        }

        if (exercises.length > 0) {
          courseData.set(lessonName, exercises);
        }
      }
    }
  } catch (error) {
    console.error("Error loading lessons from file system:", error);
    throw new Error("Failed to load course data.");
  }

  return courseData;
}
