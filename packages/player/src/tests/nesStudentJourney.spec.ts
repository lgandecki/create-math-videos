import { describe, test, expect, vi, beforeEach } from "vitest";
import { ExerciseEngine } from "@/engine/ExerciseEngine";
import { FakeTool } from "@/engine/test-harness";
import { bus, resetBus } from "@/core/events";
import waitForExpect from "@/testHelpers/waitForExpect";
import { ToolRegistry } from "@/engine/ToolRegistry.ts";
import { chatActionsApi } from "@/components/chat/ChatActionEvents";
import { coreApi } from "@/components/bridges/CoreBridge";

// The full markdown from our original goal
const guidedPracticeMarkdown = `
# humans on candy

## Exercises and Content

Imagine you have a big sweet tooth, and all you want to eat is candy. Sounds fun, right? But would it be good for you?

Test another line.

\`\`\`ts
askForEstimation({
  question:
    "If you only?",
  expect: "tired, sick, low energy, not good",
});
\`\`\`

Well.. you wouldn't feel very good!

`;

describe("LessonEngine: Full Student Journey", () => {
  let engine: ExerciseEngine;
  let fakeSlideRule: FakeTool;
  let fakeCore: FakeTool;
  let fakeChatActions: FakeTool;
  let toolRegistry = new ToolRegistry();

  beforeEach(() => {
    resetBus();

    fakeSlideRule = new FakeTool(bus, "slideRule", {
      actions: ["trackMultiplication"],
      checks: ["waitForAlignmentTo"],
      events: ["alignmentSet"],
    });

    fakeCore = new FakeTool(bus, "core", {
      actions: ["askForEstimation"],
      events: ["estimationProvided"],
    });

    fakeChatActions = new FakeTool(bus, "chatActions", {
      actions: ["goOn"],
    });

    toolRegistry = new ToolRegistry();

    toolRegistry.registerTool(fakeSlideRule.getPlugin());
    toolRegistry.registerTool(fakeCore.getPlugin());
    toolRegistry.registerTool(fakeChatActions.getPlugin());

    engine = new ExerciseEngine(
      {
        markdown: guidedPracticeMarkdown,
        bus,
      },
      toolRegistry
    );
  });

  test("should guide the user through the full multiplication problem", async () => {
    // --- Start the engine ---
    const enginePromise = engine.run();
    chatActionsApi.emitCmdGoOn(undefined);
    chatActionsApi.emitCmdGoOn(undefined);
    // --- Step 1: Initial Question ---
    await waitForExpect(() => {
      expect(fakeCore.actions.askForEstimation).toHaveBeenCalledWith({
        question: "If you only?",
        expect: "tired, sick, low energy, not good",
      });
    });
    await fakeCore.emitEvent("estimationProvided", { answer: "tired, sick, low energy, not good" });
    coreApi.emitRsAiStreamDelta({ delta: "Well.. you wouldn't feel very good!" });
    coreApi.emitRsAiStreamComplete(undefined);
    // --- Step 2: User Answers First Question ---

    await waitForExpect(async () => {
      expect(engine.getStatus()).toBe("waiting_for_go_on");
    });

    await waitForExpect(async () => {
      expect(engine.getConversationHistory().at(-1)?.content).toContain("Well.. you wouldn't feel very good!");
    });
    chatActionsApi.emitCmdGoOn(undefined);

    expect(engine.getStatus()).toBe("complete");
    expect(engine.isComplete()).toBe(true);
  });
});
