import { CourseData } from "@/engine/CoursePlayer";

/**
 * A loader for the Vite environment. It uses import.meta.glob
 * to discover lessons and their corresponding exercise markdown files.
 */
export async function viteLoader(): Promise<CourseData> {
  const courseData: CourseData = new Map();
  // This uses Vite's glob import feature to find all .md files.
  const lessonModules = import.meta.glob("/src/lessons/**/*.md", { as: "raw" });

  const lessonMap: Map<string, { path: string; content: string }[]> = new Map();

  // Group markdown files by their parent lesson folder.
  for (const path in lessonModules) {
    const markdownContent = await lessonModules[path]();
    const pathParts = path.split("/");
    // Assumes path is like /src/lessons/01-slide-rule/exercise0_demo.md
    const lessonName = pathParts[3];

    if (!lessonMap.has(lessonName)) {
      lessonMap.set(lessonName, []);
    }
    lessonMap.get(lessonName)!.push({ path, content: markdownContent });
  }

  // Sort the lessons by their folder name (e.g., '01-slide-rule' before '11-dino').
  const sortedLessonNames = Array.from(lessonMap.keys()).sort();

  for (const lessonName of sortedLessonNames) {
    const exercises = lessonMap.get(lessonName)!;
    // Sort exercises within a lesson alphabetically by filename to ensure order.
    exercises.sort((a, b) => a.path.localeCompare(b.path));

    courseData.set(
      lessonName,
      exercises.map((e) => e.content)
    );
  }

  console.log("[viteLoader] Loaded course data:", courseData);
  return courseData;
}
