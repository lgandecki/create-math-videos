import { parseExerciseMarkdown } from "@/engine/parseExerciseMarkdown";
import { expect, test } from "vitest";

test.skip("ignore answers in markdown", () => {
  const markdown = `

# Lesson 1: Guided Practice

## Exercise Flow

Now, move the inner circle to 4.

### Check

\`\`\`js
slideRule.waitForAlignmentTo(4);
\`\`\`

#### Incorrect Answer

elo2. Not quite yet.

#### Correct Answer

Elo. Good job.
`;

  const { steps } = parseExerciseMarkdown(markdown);

  console.log(steps);

  const allTexts = steps.filter((r) => r.type === "text").map((r) => r.content);
  expect(allTexts).toContain("Now, move the inner circle to 4.");
  expect(allTexts).not.toContain("Good job");
  expect(allTexts).not.toContain("Not quite yet");
});
