import fs from "fs/promises";
import { decodeFileName } from "./fileNameEncoder";

// Convert a lesson name to a URL-friendly slug
export function createSlug(lessonName: string): string {
  return lessonName
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, "") // Remove non-alphanumeric chars except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

// Find a file that matches the given slug
export async function resolveSlugToFile(
  slug: string,
  lessonsDir: string,
): Promise<string | null> {
  try {
    console.log("lessonsDir", lessonsDir);
    const files = await fs.readdir(lessonsDir);
    const mdFiles = files
      .filter((f) => f.endsWith(".md"))
      .map((f) => {
        const decodedName = decodeFileName(f);
        const fileSlug = createSlug(decodedName);
        return {
          name: f,
          slug: fileSlug,
        };
      });
    console.log(
      "mdFiles",
      mdFiles.map((f) => f.slug),
    );
    // For each file, decode it and generate its slug
    for (const file of mdFiles) {
      if (file.slug === slug) {
        return file.name;
      }
    }

    return null;
  } catch (error) {
    console.error("Error resolving slug:", error);
    return null;
  }
}
