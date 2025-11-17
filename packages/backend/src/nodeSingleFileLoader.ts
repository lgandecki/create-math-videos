import fs from "fs/promises";
import path from "path";

export type CourseData = Map<string, string[]>;

/**
 * A loader for the Node.js environment that loads a single markdown file
 * as a lesson with one exercise.
 * @param lessonsFile The path to the markdown file.
 * @returns A Promise that resolves to the CourseData map with single entry.
 */
export async function nodeSingleFileLoader(
  lessonsFile: string,
): Promise<CourseData> {
  const courseData: CourseData = new Map();
  try {
    const lessonName = path.basename(lessonsFile, ".md");
    const content = await fs.readFile(lessonsFile, "utf-8");
    courseData.set(lessonName, [content]);
    return courseData;
  } catch (error) {
    console.error("Error loading lesson from file:", error);
    throw new Error("Failed to load course data.");
  }
}
