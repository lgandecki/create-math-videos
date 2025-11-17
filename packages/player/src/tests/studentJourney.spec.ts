import { expect, test, describe, beforeEach, vi } from "vitest";
import { ExerciseEngine } from "@/engine/ExerciseEngine";
import { FakeTool } from "@/engine/test-harness";
import { bus, resetBus } from "@/core/events";
import { ToolRegistry } from "@/engine/ToolRegistry.ts";
import waitForExpect from "@/testHelpers/waitForExpect";
import { coreApi } from "@/components/bridges/CoreBridge";
import { chatActionsApi } from "@/components/chat/ChatActionEvents";

describe("ExerciseEngine: Incremental Tests", () => {
  let engine: ExerciseEngine;
  let fakeSlideRule: FakeTool;
  let fakeCore: FakeTool;
  let fakeChatActions: FakeTool;
  let toolRegistry: ToolRegistry;
  // A very simple markdown for our first test
  const simpleMarkdown = `
A single line of text.
\`\`\`js
trackMultiplication(4, 2);
\`\`\`
`;

  // A markdown that includes a pausing action
  const pausingMarkdown = `
Let me ask you something.
\`\`\`js
askForEstimation({ question: "What is 2+2?", expect: 4 });
\`\`\`
And that's all for now.
`;

  beforeEach(() => {
    // For TDD, we start fresh each time.
    resetBus();

    // Setup the tools that might be used in the tests
    fakeSlideRule = new FakeTool(bus, "slideRule", {
      actions: ["trackMultiplication"],
      checks: ["waitForAlignmentTo"], // This tool has a check
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
  });

  test("should execute a simple text step followed by an action step", async () => {
    // ARRANGE
    engine = new ExerciseEngine({ markdown: simpleMarkdown, bus }, toolRegistry);

    // ACT
    engine.run();

    chatActionsApi.emitCmdGoOn(undefined);
    // ASSERT
    await waitForExpect(() => {
      expect(fakeSlideRule.actions.trackMultiplication).toHaveBeenCalledWith(4, 2);
    });

    await waitForExpect(() => {
      expect(engine.getVisibleText()).toContain("A single line of text.");
    });

    await waitForExpect(() => {
      expect(engine.isComplete()).toBe(true);
    });

    await waitForExpect(() => {
      expect(engine.getStatus()).toBe("complete");
    });
  });

  test("should pause when an 'askForEstimation' action is called and resume on 'estimationProvided' event", async () => {
    // ARRANGE
    engine = new ExerciseEngine({ markdown: pausingMarkdown, bus }, toolRegistry);

    // ACT: Run the engine, but don't await its full completion yet.
    engine.run();

    expect(engine.getVisibleText()).toContain("Let me ask you something.");
    // ASSERT 1: The engine has paused and is waiting for a question.

    chatActionsApi.emitCmdGoOn(undefined);
    await waitForExpect(() => {
      expect(fakeCore.actions.askForEstimation).toHaveBeenCalledWith({
        question: "What is 2+2?",
        expect: 4,
      });
    });
    await waitForExpect(() => {
      expect(engine.getStatus()).toBe("waiting_for_estimation");
    });
    await waitForExpect(() => {
      expect(engine.isComplete()).toBe(false);
    });

    // ACT 2: Simulate the user providing an answer.
    await fakeCore.emitEvent("estimationProvided", { answer: 4 });
    coreApi.emitRsAiStreamDelta({ delta: "And that's all for now." });
    coreApi.emitRsAiStreamComplete(undefined);

    await waitForExpect(() => {
      expect(engine.getConversationHistory().at(-1)?.content).toContain("And that's all for now.");
    });

    chatActionsApi.emitCmdGoOn(undefined);
    await waitForExpect(() => {
      expect(engine.getStatus()).toBe("complete");
    });
  });

  test("should handle a Check block with incorrect and then correct user input", async () => {
    // A markdown for testing the Check block
    const checkMarkdown = `
Align the rule to 4.
### Check
\`\`\`js
waitForAlignmentTo(4);
\`\`\`
`;
    // ARRANGE
    engine = new ExerciseEngine({ markdown: checkMarkdown, bus }, toolRegistry);

    // ACT 1: Run the engine. It should pause at the Check.
    engine.run();
    chatActionsApi.emitCmdGoOn(undefined);
    expect(engine.getStatus()).toBe("waiting_for_check");
    expect(fakeSlideRule.checks.waitForAlignmentTo).toHaveBeenCalledWith(4);

    // ACT 2: Simulate incorrect user input.
    await fakeSlideRule.emitEvent("alignmentSet", { value: 3 }); // Wrong value

    // ASSERT 2: The engine should show failure text and still be waiting.
    expect(engine.getConversationHistory().at(-1)?.content).toContain("Try again.");
    expect(engine.getStatus()).toBe("waiting_for_check");

    // ACT 3: Simulate correct user input.
    await fakeSlideRule.emitEvent("alignmentSet", { value: 4 }); // Correct value

    // ASSERT 3: The engine should show success text and be complete.
    expect(engine.getConversationHistory().at(-1)?.content).toContain("Correct!");
    await waitForExpect(() => {
      expect(engine.getStatus()).toBe("complete");
    });
  });
});
