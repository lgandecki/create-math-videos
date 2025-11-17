import { describe, test, expect, vi } from "vitest";
import { parseExerciseMarkdown } from "./parseExerciseMarkdown";

describe("parseExerciseMarkdown", () => {
  test("parses basic text content", () => {
    const markdown = `
Hi! I'm your assistant. I'm here to help.

Today, we're exploring what happens when a dinosaur grows bigger.
`;
    const { steps } = parseExerciseMarkdown(markdown);

    expect(steps).toHaveLength(2);
    expect(steps[0]).toEqual({
      type: "text",
      content: "Hi! I'm your assistant. I'm here to help.",
    });
    expect(steps[1]).toEqual({
      type: "text",
      content: "Today, we're exploring what happens when a dinosaur grows bigger.",
    });
  });

  test("skips H1 and H2 headings", () => {
    const markdown = `
# Lesson 0: Demo - How It Works
## Exercise Flow

This is the actual content.
`;
    const { steps } = parseExerciseMarkdown(markdown);

    expect(steps).toHaveLength(1);
    expect(steps[0].type).toBe("text");
    expect(steps[0].content).toBe("This is the actual content.");
  });

  test("parses simple action blocks", () => {
    const markdown = `
First, I'll set the scale.

\`\`\`js
setDinoScale(1);
\`\`\`

Now let's continue.
`;
    const { steps } = parseExerciseMarkdown(markdown);

    expect(steps).toHaveLength(3);
    expect(steps[0]).toEqual({
      type: "text",
      content: "First, I'll set the scale.",
      event: undefined,
    });
    expect(steps[1]).toEqual({
      type: "action",
      content: [
        {
          functionName: "setDinoScale",
          args: [1],
        },
      ],
    });
    expect(steps[2]).toEqual({
      type: "text",
      content: "Now let's continue.",
      event: undefined,
    });
  });

  test("parses multiple actions in one code block", () => {
    const markdown = `
\`\`\`js
delay(5000);
resetSlideRule();
\`\`\`
`;
    const { steps } = parseExerciseMarkdown(markdown);

    expect(steps).toHaveLength(1);
    expect(steps[0]).toEqual({
      type: "action",
      content: [
        { functionName: "delay", args: [5000] },
        { functionName: "resetSlideRule", args: [] },
      ],
    });
  });

  test("parses action with string arguments", () => {
    const markdown = `
\`\`\`js
showResultAt(3);
alignInnerDiskTo(2);
\`\`\`
`;
    const { steps } = parseExerciseMarkdown(markdown);

    expect(steps).toHaveLength(1);
    expect(steps[0].content).toEqual([
      { functionName: "showResultAt", args: [3] },
      { functionName: "alignInnerDiskTo", args: [2] },
    ]);
  });

  test("parses action with object syntax arguments", () => {
    const markdown = `
\`\`\`js
askForEstimation({prompt: "Height ×3 – mass changes by…?", expect: 27 });
\`\`\`
`;
    const { steps } = parseExerciseMarkdown(markdown);

    expect(steps).toHaveLength(1);
    expect(steps[0]).toEqual({
      type: "action",
      content: [
        {
          functionName: "askForEstimation",
          args: ["Height ×3 – mass changes by…?", 27],
        },
      ],
    });
  });

  test("handles empty code blocks", () => {
    const markdown = `
Some text.

\`\`\`js
\`\`\`

More text.
`;
    const { steps } = parseExerciseMarkdown(markdown);

    expect(steps).toHaveLength(2);
    expect(steps[0].type).toBe("text");
    expect(steps[1].type).toBe("text");
  });

  test("ignores whitespace lines in code blocks", () => {
    const markdown = `
\`\`\`js

setDinoScale(1);

\`\`\`
`;
    const { steps } = parseExerciseMarkdown(markdown);

    expect(steps).toHaveLength(1);
    expect(steps[0].content).toEqual([{ functionName: "setDinoScale", args: [1] }]);
  });

  test("parses full dinosaur lesson example", () => {
    const markdown = `
# Lesson 0: Demo - How Dinosaurs Scale 🦖

## Exercise Flow

Hi! I'm your assistant. I'm here to help you understand something amazing about dinosaurs.

Today, we're exploring what happens when a dinosaur grows bigger.

Let me explain. I'll walk you through the scaling process.

First, I'll show you our baby dinosaur at normal size (1×).

\`\`\`js
setDinoScale(1);
\`\`\`

Now, I'll set the '1' on the inner circle to align with '2' on the outer circle.
Watch what happens when our dinosaur grows to double its height (2×).

\`\`\`js
alignInnerDiskTo(2);
\`\`\`

Amazing! The height doubled, but look at the area and mass. The area became 4 times bigger, and the mass became 8 times heavier!

Let's try something even more dramatic - triple the height (3×). Do you know what the answer will be?

\`\`\`js
askForEstimation({prompt: "Height ×3 – mass changes by…?", expect: 27 });
alignInnerDiskTo(3);
\`\`\`

Incredible! At 3× the height, our dinosaur now has 27× the mass. That's the Dino Law of Squares and Cubes in action!

\`\`\`js
delay(3000);
\`\`\`

This is why giant dinosaurs had such massive, thick legs - they needed to support all that extra weight!
`;
    const { steps } = parseExerciseMarkdown(markdown);

    // Should have alternating text and action steps
    expect(steps.length).toBeGreaterThan(0);

    // Verify specific content
    const textSteps = steps.filter((s) => s.type === "text");
    const actionSteps = steps.filter((s) => s.type === "action");

    expect(textSteps.length).toBeGreaterThan(0);
    expect(actionSteps.length).toBe(4); // 4 code blocks

    // Check first action
    expect(actionSteps[0].content).toEqual([{ functionName: "setDinoScale", args: [1] }]);

    // Check complex action with object args
    const complexAction = actionSteps[2].content as any[];
    expect(complexAction).toHaveLength(2);
    expect(complexAction[0].functionName).toBe("askForEstimation");
    expect(complexAction[0].args).toEqual(["Height ×3 – mass changes by…?", 27]);
    expect(complexAction[1]).toEqual({ functionName: "alignInnerDiskTo", args: [3] });

    // Check delay action
    expect(actionSteps[3].content).toEqual([{ functionName: "delay", args: [3000] }]);
  });

  test("parses full multiplication lesson example", () => {
    const markdown = `
# Lesson 0: Demo - How It Works

## Exercise Flow

Hi! I'm your assistant. I'm here to help.

Today, we're multiplying 2 by 3.

Let me explain. I'll walk you through the process.

First, I'll set the '1' on the inner circle to align with '2' on the outer circle.

\`\`\`js
alignInnerDiskTo(2);
\`\`\`

Great. Now, I'll look for '3' on the inner circle and read the result on the outer circle.

\`\`\`js
showResultAt(3);
\`\`\`

The result is 6! Look how easy and fast it was.

\`\`\`js
delay(5000);
resetSlideRule();
\`\`\`
`;
    const { steps } = parseExerciseMarkdown(markdown);

    // Count step types
    const textSteps = steps.filter((s) => s.type === "text");
    const actionSteps = steps.filter((s) => s.type === "action");

    expect(textSteps.length).toBeGreaterThan(0);
    expect(actionSteps.length).toBe(3);

    // Verify last action has multiple functions
    const lastAction = actionSteps[2].content as any[];
    expect(lastAction).toHaveLength(2);
    expect(lastAction[0]).toEqual({ functionName: "delay", args: [5000] });
    expect(lastAction[1]).toEqual({ functionName: "resetSlideRule", args: [] });
  });

  test("parses ### Check headers", () => {
    const markdown = `
Some initial text.

### Check

More text after check.
`;
    const { steps } = parseExerciseMarkdown(markdown);

    expect(steps).toHaveLength(3);
    expect(steps[0]).toEqual({
      type: "text",
      content: "Some initial text.",
      event: undefined,
    });
    expect(steps[1]).toEqual({
      type: "check",
      content: {
        action: { functionName: "", args: [] },
        onSuccess: "",
        onFail: "",
      },
    });
    expect(steps[2]).toEqual({
      type: "text",
      content: "More text after check.",
      event: undefined,
    });
  });

  test("parses check with action code block", () => {
    const markdown = `
### Check

\`\`\`js
verifyAnswer(42);
\`\`\`

Some other text.
`;
    const { steps } = parseExerciseMarkdown(markdown);

    expect(steps).toHaveLength(2);
    expect(steps[0]).toEqual({
      type: "check",
      content: {
        action: { functionName: "verifyAnswer", args: [42] },
        onSuccess: "",
        onFail: "",
      },
    });
    expect(steps[1]).toEqual({
      type: "text",
      content: "Some other text.",
      event: undefined,
    });
  });

  test("handles H4 headings without active check", () => {
    const markdown = `
#### Random Heading

This should just be normal text.
`;
    const { steps } = parseExerciseMarkdown(markdown);

    expect(steps).toHaveLength(1);
    expect(steps[0]).toEqual({
      type: "text",
      content: "This should just be normal text.",
      event: "RANDOM_HEADING",
    });
  });

  test("handles check with complex object arguments", () => {
    const markdown = `
### Check

\`\`\`js
verifyUserInput({prompt: "What is 2+2?", expect: 4, timeout: 5000});
\`\`\`

`;
    const { steps } = parseExerciseMarkdown(markdown);

    expect(steps).toHaveLength(1);
    expect(steps[0]).toEqual({
      type: "check",
      content: {
        action: {
          functionName: "verifyUserInput",
          args: ["What is 2+2?", 4, 5000],
        },
        onSuccess: "",
        onFail: "",
      },
    });
  });

  test("sanitizes event names from H4 headings", () => {
    const markdown = `
#### Success! You did it! 🎉

This is the success message.

#### Failed :( Try again...

This is the failure message.
`;
    const { steps } = parseExerciseMarkdown(markdown);

    expect(steps).toHaveLength(2);
    expect(steps[0].event).toBe("SUCCESS_YOU_DID_IT");
    expect(steps[1].event).toBe("FAILED_TRY_AGAIN");
  });

  test("parses multiple paragraphs after H4", () => {
    const markdown = `
#### Important Note

This is the first paragraph.

This is the second paragraph.

Still part of the same event section.

`;
    const { steps } = parseExerciseMarkdown(markdown);

    expect(steps).toHaveLength(3);
    expect(steps[0]).toEqual({
      type: "text",
      content: "This is the first paragraph.",
      event: "IMPORTANT_NOTE",
    });
    expect(steps[1]).toEqual({
      type: "text",
      content: "This is the second paragraph.",
    });
    expect(steps[2]).toEqual({
      type: "text",
      content: "Still part of the same event section.",
    });
  });

  test("handles H4 that doesn't match success/fail patterns", () => {
    const markdown = `
### Check

\`\`\`js
testSomething();
\`\`\`

`;
    const { steps } = parseExerciseMarkdown(markdown);

    expect(steps).toHaveLength(1);
    expect(steps[0]).toEqual({
      type: "check",
      content: {
        action: { functionName: "testSomething", args: [] },
        onSuccess: "",
        onFail: "",
      },
    });
    // The H4 headers that don't match success/fail patterns still create event-driven paragraphs
  });

  test("parses setMixture with object syntax from orange juice lesson", () => {
    const markdown = `
# Lesson 3 — Ratio ≠ Difference • "Perfect Orange Juice"

## Exercise Flow

Retail juice is too sweet, so you dilute it.
The recipe says 1 part concentrate on 3 parts water.

\`\`\`ts
setMixture({ concentrate: 200, units: "ml", proportion: "1:3" })
\`\`\`
`;

    const { steps } = parseExerciseMarkdown(markdown);

    expect(steps).toHaveLength(2);

    // First should be the text content
    expect(steps[0]).toEqual({
      type: "text",
      content: "Retail juice is too sweet, so you dilute it.\nThe recipe says 1 part concentrate on 3 parts water.",
      event: undefined,
    });

    // Second should be the action with object arguments
    expect(steps[1]).toEqual({
      type: "action",
      content: [
        {
          functionName: "setMixture",
          args: [200, "ml", "1:3"],
        },
      ],
    });
  });
});

test("multiple commands in one js block", () => {
  const markdown = `
# Lesson 1: Guided Practice

## Exercise Flow

Now, it's your turn. I'll guide you step by step to multiply 4 by 2.

\`\`\`js
trackMultiplication(4, 2);
askForEstimation({ prompt: "First, let me know, what do you think would be the result?", expect: 8 });
\`\`\`

Now, move the inner circle so that its “1” aligns with “4” on the outer circle. I’ll wait for you.

`;

  const { steps } = parseExerciseMarkdown(markdown);

  expect(steps.find((r) => r.type === "action")?.content).toEqual([
    { functionName: "trackMultiplication", args: [4, 2] },
    { functionName: "askForEstimation", args: ["First, let me know, what do you think would be the result?", 8] },
  ]);
});
