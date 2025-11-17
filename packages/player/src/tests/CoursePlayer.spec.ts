import { describe, test, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { CoursePlayer, CourseData } from "@/engine/CoursePlayer"; // These don't exist yet
import { LessonPlayer } from "@/engine/LessonPlayer";
import { bus, resetBus } from "@/core/events";
import { ToolRegistry } from "@/engine/ToolRegistry.ts";

// Mock the LessonPlayer to isolate our test to the CoursePlayer's logic.
vi.mock("@/engine/LessonPlayer");

// --- Test Data & Mocks ---

// This is the data structure our loader function will provide.
const mockCourseData: CourseData = new Map([
  [
    "01-dino-intro", // Lesson 1 name
    ["dino_ex1.md", "dino_ex2.md"], // Exercises for Lesson 1
  ],
  [
    "02-dino-advanced", // Lesson 2 name
    ["advanced_ex1.md"], // Exercise for Lesson 2
  ],
]);

// A mock loader function that simulates reading files.
const mockLoader = vi.fn().mockResolvedValue(mockCourseData);

describe("CoursePlayer", () => {
  beforeEach(() => {
    // Reset mocks before each test
    (LessonPlayer as Mock).mockClear();
    mockLoader.mockClear();
    resetBus();
  });

  test("should load course data and execute each lesson using a LessonPlayer", async () => {
    // ARRANGE
    // The CoursePlayer is initialized with the loader function.
    const coursePlayer = new CoursePlayer({ loader: mockLoader, bus });

    // Mock the LessonPlayer's start method to simulate it completing successfully.
    (LessonPlayer as Mock).mockImplementation(() => {
      return {
        start: vi.fn().mockResolvedValue(undefined),
        registerTool: vi.fn(),
      };
    });

    // ACT: Start the course.
    await coursePlayer.start();

    // ASSERT
    // 1. The loader was called to fetch the course structure.
    expect(mockLoader).toHaveBeenCalledTimes(1);

    // 2. A LessonPlayer was created for each lesson in the course data.
    expect(LessonPlayer).toHaveBeenCalledTimes(2);

    // 3. The first LessonPlayer was created with the exercises for the first lesson.
    expect(LessonPlayer).toHaveBeenCalledWith(
      expect.objectContaining({
        exercises: mockCourseData.get("01-dino-intro"),
      })
    );

    // 4. The second LessonPlayer was created with the exercises for the second lesson.
    expect(LessonPlayer).toHaveBeenCalledWith(
      expect.objectContaining({
        exercises: mockCourseData.get("02-dino-advanced"),
      })
    );

    // 5. The course is marked as complete.
    expect(coursePlayer.isComplete()).toBe(true);
  });
});
