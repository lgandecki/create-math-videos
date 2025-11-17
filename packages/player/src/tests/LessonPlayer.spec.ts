import { describe, test, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { LessonPlayer } from "@/engine/LessonPlayer"; // This class doesn't exist yet
import { ExerciseEngine } from "@/engine/ExerciseEngine"; // We'll rename LessonEngine
import { FakeTool } from "@/engine/test-harness";
import { bus, resetBus } from "@/core/events";
import { ToolRegistry } from "@/engine/ToolRegistry.ts";

// We'll mock the ExerciseEngine to isolate our test to the LessonPlayer's logic.
vi.mock("@/engine/ExerciseEngine");

// --- Test Data ---
const exerciseOneMarkdown = `
Exercise 1 text.
\`\`\`js
actionOne();
\`\`\`
`;
const exerciseTwoMarkdown = `
Exercise 2 text.
\`\`\`js
actionTwo();
\`\`\`
`;

describe("LessonPlayer", () => {
  let lessonPlayer: LessonPlayer;
  let fakeTool: FakeTool;

  beforeEach(() => {
    // Reset the mock before each test
    (ExerciseEngine as Mock).mockClear();
    resetBus();

    // The LessonPlayer will need to register tools with the engines it creates.
    // We can use a real FakeTool for this.
    fakeTool = new FakeTool(bus, "testTool", {
      actions: ["actionOne", "actionTwo"],
    });
  });

  test("should execute a list of exercises in sequence", async () => {
    // ARRANGE
    const exercises = [exerciseOneMarkdown, exerciseTwoMarkdown];
    const toolRegistry = new ToolRegistry();
    lessonPlayer = new LessonPlayer({ exercises, bus });
    toolRegistry.registerTool(fakeTool.getPlugin());

    // Mock the run method of our ExerciseEngine instances
    const mockRun = vi.fn().mockResolvedValue(undefined);
    (ExerciseEngine as Mock).mockImplementation(() => {
      return {
        run: mockRun,
        stop: () => {},
        registerTool: vi.fn(), // The player needs to call this
      };
    });

    // ACT
    await lessonPlayer.start();

    // ASSERT
    // It should have created two ExerciseEngine instances.
    expect(ExerciseEngine).toHaveBeenCalledTimes(2);

    // It should have created the first engine with the first markdown.
    expect(ExerciseEngine).toHaveBeenCalledWith(expect.objectContaining({ markdown: exerciseOneMarkdown }));

    // It should have created the second engine with the second markdown.
    expect(ExerciseEngine).toHaveBeenCalledWith(expect.objectContaining({ markdown: exerciseTwoMarkdown }));

    // The 'run' method should have been called twice, once for each engine.
    expect(mockRun).toHaveBeenCalledTimes(2);

    // The lesson player should report that it is complete.
    expect(lessonPlayer.isComplete()).toBe(true);
  });

  test("should stop if an exercise fails", async () => {
    // ARRANGE
    const toolRegistry = new ToolRegistry();
    const exercises = [exerciseOneMarkdown, exerciseTwoMarkdown];
    lessonPlayer = new LessonPlayer({ exercises, bus });
    toolRegistry.registerTool(fakeTool.getPlugin());

    // Mock the run method to fail on the first call
    const mockRun = vi.fn().mockRejectedValueOnce(new Error("Engine failed")).mockResolvedValue(undefined);

    (ExerciseEngine as Mock).mockImplementation(() => ({
      run: mockRun,
      stop: () => {},
      registerTool: vi.fn(),
    }));

    // ACT & ASSERT
    // We expect the start promise to reject.
    await expect(lessonPlayer.start()).rejects.toThrow("Engine failed");

    // It should have only created and run the first engine.
    expect(ExerciseEngine).toHaveBeenCalledTimes(1);
    expect(mockRun).toHaveBeenCalledTimes(1);

    // The player should not be marked as complete.
    expect(lessonPlayer.isComplete()).toBe(false);
  });
});
