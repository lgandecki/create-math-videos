import { CourseData } from "@/engine/CoursePlayer";

export async function networkLoader(lessonsDir?: string): Promise<CourseData> {
  // get the subdomain from the url and send as lessonsDir
  let response: Response;
  if (lessonsDir) {
    response = await fetch(`/api/v1/lessons?lessonsDir=${lessonsDir}`);
  } else {
    let dynamicLessonsDir = "";
    const hostname = window.location.hostname;
    const subdomain = hostname.split(".")[0];

    // Define subdomain mapping for better maintainability
    const subdomainMap: Record<string, string> = {
      localhost: "slide-rule-lesson",
      lessonplayer: "", // no subdirectory
    };

    const mappedDir = subdomainMap[subdomain.toLowerCase()];
    if (mappedDir !== undefined) {
      dynamicLessonsDir = mappedDir ? `?lessonsDir=${mappedDir}` : "";
    } else {
      dynamicLessonsDir = `?lessonsDir=${subdomain}`;
    }
    response = await fetch(`/api/v1/lessons${dynamicLessonsDir}`);
  }

  const data = await response.json();
  return new Map(Object.entries(data));
}
