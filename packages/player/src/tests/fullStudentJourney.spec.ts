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
# Lesson 1: Guided Practice

## Exercise Flow

Now, it's your turn. I'll guide you step by step to multiply 4 by 2.

\`\`\`js
trackMultiplication(4, 2);
askForEstimation({ question: "First, let me know, what do you think would be the result?", expect: 8 });
\`\`\`

Now, move the inner circle so that its “1” aligns with “4” on the outer circle. I’ll wait for you.

### Check

\`\`\`js
waitForAlignmentTo(4);
\`\`\`

Now, look at the number “2” on the inner circle.

The answer is on the outer circle right next to it.

\`\`\`js
askForEstimation({ question: "Please type your answer to me.", expect: 8 });
\`\`\`
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

    await waitForExpect(() => {
      expect(fakeSlideRule.actions.trackMultiplication).toHaveBeenCalledWith(4, 2);
    });

    chatActionsApi.emitCmdGoOn(undefined);

    // --- Step 1: Initial Question ---
    await waitForExpect(() => {
      expect(engine.getStatus()).toBe("waiting_for_estimation");
      expect(fakeCore.actions.askForEstimation).toHaveBeenCalledWith({
        question: "First, let me know, what do you think would be the result?",
        expect: 8,
      });
    }, 500);

    // --- Step 2: User Answers First Question ---
    await fakeCore.emitEvent("estimationProvided", { answer: 8 });
    coreApi.emitRsAiStreamDelta({
      delta: "Now, move the inner circle so that its “1” aligns with “4” on the outer circle. I’ll wait for you.",
    });
    coreApi.emitRsAiStreamComplete(undefined);

    await waitForExpect(() => {
      expect(engine.getConversationHistory().at(-1)?.content).toContain(
        "Now, move the inner circle so that its “1” aligns with “4” on the outer circle."
      );
    });
    chatActionsApi.emitCmdGoOn(undefined);

    // --- Step 3: The Check Block ---
    await waitForExpect(() => {
      expect(fakeSlideRule.checks.waitForAlignmentTo).toHaveBeenCalledWith(4);
      expect(engine.getStatus()).toBe("waiting_for_check");
    });

    // --- Step 4: User Makes a Mistake ---
    await fakeSlideRule.emitEvent("alignmentSet", { value: 3 }); // Wrong value
    await waitForExpect(() => {
      expect(engine.getConversationHistory().at(-1)?.content).toContain("Try again.");
      expect(engine.getStatus()).toBe("waiting_for_check");
    });

    // --- Step 5: User Corrects the Mistake ---
    await fakeSlideRule.emitEvent("alignmentSet", { value: 4 }); // Correct value
    await waitForExpect(() => {
      expect(engine.getConversationHistory().at(-2)?.content).toContain("Correct!");
      expect(engine.getConversationHistory().at(-1)?.content).toContain(
        "Now, look at the number “2” on the inner circle."
      );
    });

    chatActionsApi.emitCmdGoOn(undefined);
    expect(engine.getConversationHistory().at(-1)?.content).toContain(
      "The answer is on the outer circle right next to it."
    );
    chatActionsApi.emitCmdGoOn(undefined);
    // --- Step 6: Final Question ---
    await waitForExpect(() => {
      expect(fakeCore.actions.askForEstimation).toHaveBeenCalledWith({
        question: "Please type your answer to me.",
        expect: 8,
      });
      expect(engine.getStatus()).toBe("waiting_for_estimation");
    });

    // --- Step 7: User Answers Final Question ---
    await fakeCore.emitEvent("estimationProvided", { answer: 8 });
    coreApi.emitRsAiStreamComplete(undefined);

    await waitForExpect(async () => {
      expect(engine.getStatus()).toBe("waiting_for_go_on");
    });

    chatActionsApi.emitCmdGoOn(undefined);
    // --- Final Assertion: Engine Completes ---
    expect(engine.isComplete()).toBe(true);
    expect(engine.getStatus()).toBe("complete");
  });
});
