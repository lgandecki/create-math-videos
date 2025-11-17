import { parseExerciseMarkdown } from "@/engine/parseExerciseMarkdown";
import { expect, test } from "vitest";

test("should extract the AI context from the markdown", () => {
  const guidedPracticeMarkdown = `
# humans on candy

## Notes for AI Guide

This lesson introduces the basic concepts of human nutrition (grades 5-8), focusing on why a balanced diet is crucial for health and energy, using candy as a contrasting example. It covers the roles of different macronutrients (carbohydrates, proteins, fats) and the importance of variety.

Anticipate common misunderstandings

## Exercises and Content

Imagine you have a big sweet tooth, and all you want to eat is candy. Sounds fun, right? But would it be good for you?

Test another line.

\`\`\`ts
askForEstimation({ question: "If you only eat candy every day, how would your body feel after a week?", expect: "tired"});
\`\`\`

Well.. you wouldn't feel very good! Even though candy gives you a quick burst of energy, it's missing many important things your body needs to grow, repair itself, and stay healthy.

`;

  const result = parseExerciseMarkdown(guidedPracticeMarkdown);
  expect(result.aiContext).toBe(
    "This lesson introduces the basic concepts of human nutrition (grades 5-8), focusing on why a balanced diet is crucial for health and energy, using candy as a contrasting example. It covers the roles of different macronutrients (carbohydrates, proteins, fats) and the importance of variety.\n\nAnticipate common misunderstandings"
  );
  expect(result.steps.length).toBe(4);
  expect(result.steps[2].type).toBe("action");
  expect(result.steps[2].content).toEqual([
    {
      functionName: "askForEstimation",
      args: ["If you only eat candy every day, how would your body feel after a week?", "tired"],
    },
  ]);
});

test("more advanced AI context", () => {
  const guidedPracticeMarkdown = `
# humans on candy

## Notes for AI Guide


Anticipate common misunderstandings:

- Students may think that energy is the _only_ thing food provides.
- They might believe all calories are the same, regardless of their source.
- They may not understand that different foods have different "jobs" in the body.

**Suggested Socratic Question (when the student is stuck):**

## Exercises and Content

Hi there

`;
  const result = parseExerciseMarkdown(guidedPracticeMarkdown);
  expect(result.aiContext).toBe(
    'Anticipate common misunderstandings:\n\nStudents may think that energy is the _only_ thing food provides. They might believe all calories are the same, regardless of their source. They may not understand that different foods have different "jobs" in the body.\n**Suggested Socratic Question (when the student is stuck):**'
  );
  expect(result.steps.length).toBe(1);
  expect(result.steps[0].type).toBe("text");
  expect(result.steps[0].content).toBe("Hi there");
});
