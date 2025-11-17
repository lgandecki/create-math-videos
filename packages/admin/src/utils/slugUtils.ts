// Convert a lesson name to a URL-friendly slug
export function createSlug(lessonName: string): string {
  return lessonName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric chars except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

// Find a lesson file by its slug from a list of available lessons
export function findLessonBySlug(
  slug: string,
  lessons: string[],
): string | null {
  // Remove .md extension from lessons for comparison
  const lessonsWithoutExt = lessons.map((lesson) =>
    lesson.endsWith(".md") ? lesson.slice(0, -3) : lesson,
  );

  // Find the lesson that matches the slug
  return (
    lessons.find((lesson) => {
      const name = lesson.endsWith(".md") ? lesson.slice(0, -3) : lesson;
      return createSlug(name) === slug;
    }) ?? null
  );
}
