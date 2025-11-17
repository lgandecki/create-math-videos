import { expect, test } from "vitest";
import { parseExerciseMarkdown } from "@/engine/parseExerciseMarkdown";

test("should parse the markdown when code block functions are in one line", () => {
  const guidedPracticeMarkdown = `
# humans on candy

## Exercises and Content

Imagine you have a big sweet tooth, and all you want to eat is candy. Sounds fun, right? But would it be good for you?

Test another line.

\`\`\`ts
askForEstimation({ question: "If you only eat candy every day, how would your body feel after a week?", expect: "tired"});
\`\`\`

Well.. you wouldn't feel very good! Even though candy gives you a quick burst of energy, it's missing many important things your body needs to grow, repair itself, and stay healthy.

`;

  const { steps } = parseExerciseMarkdown(guidedPracticeMarkdown);
  console.log(steps);
  expect(steps.length).toBe(4);
  expect(steps[2].type).toBe("action");
  expect(steps[2].content).toEqual([
    {
      functionName: "askForEstimation",
      args: ["If you only eat candy every day, how would your body feel after a week?", "tired"],
    },
  ]);
});

test("should parse the markdown when code block functions are split into multiple lines", () => {
  const guidedPracticeMarkdown = `
# humans on candy

## Exercises and Content

Imagine you have a big sweet tooth, and all you want to eat is candy. Sounds fun, right? But would it be good for you?

Test another line.

\`\`\`ts
askForEstimation({ 
question: "If you only eat candy every day, how would your body feel after a week?", 
expect: "very tired, slow"});
\`\`\`

Well.. you wouldn't feel very good! Even though candy gives you a quick burst of energy, it's missing many important things your body needs to grow, repair itself, and stay healthy.

`;

  const { steps } = parseExerciseMarkdown(guidedPracticeMarkdown);
  console.log(steps);
  expect(steps[2].type).toBe("action");
  expect(steps[2].content).toEqual([
    {
      functionName: "askForEstimation",
      args: ["If you only eat candy every day, how would your body feel after a week?", "very tired, slow"],
    },
  ]);
});

test("should parse the markdown when code block functions are split into multiple lines", () => {
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

Well.. you wouldn't feel very good! Even though candy gives you a quick burst of energy, it's missing many important things your body needs to grow, repair itself, and stay healthy.

`;

  const { steps } = parseExerciseMarkdown(guidedPracticeMarkdown);
  console.log(steps);
  expect(steps[2].type).toBe("action");
  expect(steps[2].content).toEqual([
    {
      functionName: "askForEstimation",
      args: ["If you only?", "tired, sick, low energy, not good"],
    },
  ]);
});

test("should parse the markdown when code block has parentheses inside", () => {
  // The full markdown from our original goal
  const guidedPracticeMarkdown = `
# humans on candy

## Exercises and Content

Imagine you have a big sweet tooth, and all you want to eat is candy. Sounds fun, right? But would it be good for you?

Test another line.

\`\`\`ts
askForEstimation({
  question:
    "If (you) only?",
  expect: "tired, sick, low energy, not good",
});
\`\`\`

Well.. you wouldn't feel very good! Even though candy gives you a quick burst of energy, it's missing many important things your body needs to grow, repair itself, and stay healthy.

`;

  const { steps } = parseExerciseMarkdown(guidedPracticeMarkdown);
  console.log(steps);
  expect(steps[2].type).toBe("action");
  expect(steps[2].content).toEqual([
    {
      functionName: "askForEstimation",
      args: ["If (you) only?", "tired, sick, low energy, not good"],
    },
  ]);
});

test("should parse the markdown when code block has \' inside", () => {
  // The full markdown from our original goal
  const guidedPracticeMarkdown = `
# humans on candy

## Exercises and Content

Imagine you have a big sweet tooth, and all you want to eat is candy. Sounds fun, right? But would it be good for you?

Test another line.

\`\`\`ts
askForEstimation({
  question:
    "If 'you' only?",
  expect: "tired, sick, low energy, not good",
});
\`\`\`

Well.. you wouldn't feel very good! Even though candy gives you a quick burst of energy, it's missing many important things your body needs to grow, repair itself, and stay healthy.

`;

  const { steps } = parseExerciseMarkdown(guidedPracticeMarkdown);
  console.log(steps);
  expect(steps[2].type).toBe("action");
  expect(steps[2].content).toEqual([
    {
      functionName: "askForEstimation",
      args: ["If 'you' only?", "tired, sick, low energy, not good"],
    },
  ]);
});

test("should parse the markdown when code block has \` inside", () => {
  // The full markdown from our original goal
  const guidedPracticeMarkdown = `
# humans on candy

## Exercises and Content

Imagine you have a big sweet tooth, and all you want to eat is candy. Sounds fun, right? But would it be good for you?

Test another line.

\`\`\`ts
askForEstimation({
  question:
    "If \`you\` only?",
  expect: "tired, sick, low energy, not good",
});
\`\`\`

Well.. you wouldn't feel very good! Even though candy gives you a quick burst of energy, it's missing many important things your body needs to grow, repair itself, and stay healthy.

`;

  const { steps } = parseExerciseMarkdown(guidedPracticeMarkdown);
  console.log(steps);
  expect(steps[2].type).toBe("action");
  expect(steps[2].content).toEqual([
    {
      functionName: "askForEstimation",
      args: ["If `you` only?", "tired, sick, low energy, not good"],
    },
  ]);
});
