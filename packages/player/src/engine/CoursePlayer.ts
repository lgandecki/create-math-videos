import { Bus } from "@/core/events";
import { LessonPlayer } from "@/engine/LessonPlayer";
import { coreApi } from "@/components/bridges/CoreBridge.tsx"; // The lowest-level type

// --- Type Definitions ---

// The data structure for a full course: a map of lesson names to their exercise content.
export type CourseData = Map<string, string[]>;

// A function that returns the course data. This is how we inject the loading strategy.
export type LoaderFunction = (lessonsDir?: string) => Promise<CourseData>;

export interface CoursePlayerOptions {
  loader: LoaderFunction;
  bus: Bus;
}

/**
 * Manages the execution of a full course, which consists of multiple lessons.
 * It uses a loader to fetch the course structure and then uses LessonPlayer
 * to run each lesson in sequence.
 */
export class CoursePlayer {
  private loader: LoaderFunction;
  private bus: Bus;
  private hasCompleted = false;

  constructor({ loader, bus }: CoursePlayerOptions) {
    this.loader = loader;
    this.bus = bus;
  }

  /**
   * Starts the course. It first loads the course data using the provided loader,
   * then executes each lesson in sequence.
   */
  public async start(startWithLessonId?: string): Promise<void> {
    this.hasCompleted = false;
    console.log("[CoursePlayer] Starting course...");

    // 1. Fetch the entire course structure using the injected loader.
    const courseData = await this.loader();
    console.log(`[CoursePlayer] Loaded ${courseData.size} lessons.`);

    let newLesson: string | undefined;
    // 2. Iterate over each lesson from the loaded data.
    const lessonNames = Array.from(courseData.keys());
    const lessonIndex = lessonNames.findIndex((lessonName) => lessonName === startWithLessonId);
    const startIndex = lessonIndex > -1 ? lessonIndex : 0;

    console.log(
      `[CoursePlayer] Starting with lesson: ${lessonNames[startIndex]} for ${startWithLessonId}`,
      lessonNames.length,
      lessonNames
    );

    const lessonsToPlay = lessonNames.slice(startIndex);
    for (const lessonName of lessonsToPlay) {
      const exercises = courseData.get(lessonName)!;
      console.log(`[CoursePlayer] Starting lesson: ${lessonName}`);

      const lessonPlayer = new LessonPlayer({
        exercises,
        bus: this.bus,
      });

      coreApi.emitRsLessonChanged(lessonName);

      try {
        // 4. Await the completion of the current lesson before starting the next.
        newLesson = await new Promise<string>((resolve) => {
          const unsubscribe = coreApi.onCmdChangeLesson((newLessonName) => {
            if (newLessonName !== lessonName) {
              unsubscribe();
              resolve(newLessonName);
            }
          });

          lessonPlayer.start().then(() => {
            unsubscribe();
            resolve("");
          });
        });
        if (newLesson) {
          break;
        }
        console.log(`[CoursePlayer] Lesson ${lessonName} completed successfully.`);
      } catch (error) {
        console.error(`[CoursePlayer] The course failed on lesson: ${lessonName}. Stopping.`, error);
        // Propagate the error to stop the entire course.
        throw error;
      }
    }

    if (newLesson) {
      await this.start(newLesson);
    }
    // 5. If the loop completes, the entire course is finished.
    this.hasCompleted = true;
    console.log("[CoursePlayer] Course completed successfully.");
  }

  /**
   * Returns true if the player has successfully completed the entire course.
   */
  public isComplete(): boolean {
    return this.hasCompleted;
  }
}
