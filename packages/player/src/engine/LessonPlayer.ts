import { Bus } from "@/core/events";
import { ExerciseEngine } from "@/engine/ExerciseEngine";

type LessonPlayerOptions = {
  exercises: string[];
  bus: Bus;
};

/**
 * Manages the execution of a sequence of exercises (markdown files) for a single lesson.
 */
export class LessonPlayer {
  private exercises: string[];
  private bus: Bus;
  private hasCompleted = false;

  constructor({ exercises, bus }: LessonPlayerOptions) {
    this.exercises = exercises;
    this.bus = bus;
  }

  /**
   * Starts the lesson, executing each exercise in sequence.
   * Resolves when all exercises are complete.
   * Rejects if any exercise fails.
   */
  public async start(): Promise<void> {
    this.hasCompleted = false;

    for (const exerciseMarkdown of this.exercises) {
      let engine = new ExerciseEngine({
        markdown: exerciseMarkdown,
        bus: this.bus,
      });

      try {
        // Await the completion of the current exercise before starting the next.
        await engine.run();
      } catch (error) {
        console.error("[LessonPlayer] An exercise failed. Stopping the lesson.", error);
        // Re-throw the error to propagate the failure, as expected by the test.
        throw error;
      } finally {
        await engine.stop();
        engine = null; // we want JS Garbage Collector to do his job
      }
    }

    // If the loop completes without errors, the lesson is finished.
    this.hasCompleted = true;
    console.log("[LessonPlayer] All exercises completed successfully.");
  }

  /**
   * Returns true if the player has successfully completed all its exercises.
   */
  public isComplete(): boolean {
    return this.hasCompleted;
  }
}
