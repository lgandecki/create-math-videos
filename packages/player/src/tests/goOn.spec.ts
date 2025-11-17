import { test, expect } from "vitest";
import { ExerciseEngine } from "@/engine/ExerciseEngine";
import { bus } from "@/core/events";
import { FakeTool } from "@/engine/test-harness";
import { ToolRegistry } from "@/engine/ToolRegistry";
import waitForExpect from "@/testHelpers/waitForExpect";
import { chatActionsApi } from "@/components/chat/ChatActionEvents";
import { slideRuleApi } from "@/components/bridges/SlideRuleBridge";

test.skip("goOn after action should not be required", async () => {
  const markdown = `
# Lesson 0: Demo - How It Works

## Exercise Flow

I am here to help.

\`\`\`js
alignInnerDiskTo(2);
\`\`\`

Great.
`;
  const fakeTool = new FakeTool(bus, "slideRule", {
    actions: ["alignInnerDiskTo"],
  });
  const toolRegistry = new ToolRegistry();
  toolRegistry.registerTool(fakeTool.getPlugin());
  const engine = new ExerciseEngine({ markdown, bus }, toolRegistry);
  engine.run();
  await waitForExpect(() => {
    expect(engine.getVisibleText()).toContain("I am here to help.");
    // expect(engine.getStatus()).toBe("waiting_for_go_on");
  });

  chatActionsApi.emitCmdGoOn(undefined);
  await waitForExpect(() => {
    expect(fakeTool.actions.alignInnerDiskTo).toHaveBeenCalledWith(2);
  });
  console.log(engine.getStatus());
  await waitForExpect(() => {
    expect(engine.getVisibleText()).toContain("Great.");
  });
});

test.skip("goOn after check should not be required", async () => {
  const markdown = `
# Lesson 1: Guided Practice

## Exercise Flow

Now, move the inner circle to 4.

### Check

\`\`\`js
slideRule.waitForAlignmentTo(4);
\`\`\`

#### Incorrect Answer

Noet quite yet

#### Correct Answer

Good job
`;

  const fakeTool = new FakeTool(bus, "slideRule", {
    actions: ["alignInnerDiskTo"],
    checks: ["waitForAlignmentTo"],
    events: ["alignmentSet"],
  });
  const toolRegistry = new ToolRegistry();
  toolRegistry.registerTool(fakeTool.getPlugin());
  const engine = new ExerciseEngine({ markdown, bus }, toolRegistry);
  engine.run();

  await waitForExpect(() => {
    expect(engine.getVisibleText()).toContain("Now, move the inner circle to 4.");
  });

  await waitForExpect(() => {
    expect(fakeTool.checks.waitForAlignmentTo).toHaveBeenCalledWith(4);
  });

  slideRuleApi.emitRsAlignmentSet({ value: 3 });

  await waitForExpect(() => {
    expect(engine.getConversationHistory().find((m) => m.content === "Correct!")).toBeFalsy();
  });
  slideRuleApi.emitRsAlignmentSet({ value: 4 });
  await waitForExpect(() => {
    expect(engine.getConversationHistory().at(-1)?.content).toContain("Correct!");
  });

  expect(engine.getConversationHistory().filter((m) => m.content === "Correct!")).toHaveLength(1);
  expect(engine.getConversationHistory().filter((m) => m.content === "Try again.")).toHaveLength(1);
});
