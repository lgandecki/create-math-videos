import { expect, test } from "vitest";
import { parseExerciseMarkdown } from "@/engine/parseExerciseMarkdown";

const markdown = `
This is first section.

Over these immense timescales, Earth developed an ingenious, natural "thermostat" called the carbon cycle. This intricate, self-regulating cycle involves majestic processes like:
*   **Chemical weathering:** Rocks gracefully absorbing carbon dioxide from the atmosphere.
*   **Plate tectonics:** Earth's colossal surface moving, recycling carbon into its mysterious interior.
*   **Volcanoes:** Ancient, powerful giants releasing carbon dioxide back into the atmosphere.

This astounding cycle helps to perfectly regulate Earth's temperature, speeding up carbon removal when it's hot and slowing down when it's cold, preventing our world from becoming either a searing oven or a frozen wasteland, a testament to its dynamic balance.`;

test("render complex bullet lists", () => {
  const result = parseExerciseMarkdown(markdown);
  expect(result.steps.length).toBe(3);
  expect(result.steps[1].content).toContain("Chemical weathering");
  expect(result.steps[1].content).toContain("Plate tectonics");
  expect(result.steps[1].content).toContain("Volcanoes");
});

test("less complex bullet lists", () => {
  const markdown = `
  This is first section.

  My list:
  * Chemical weathering
  * Plate tectonics
  * Volcanoes

  Other text
  `;
  const result = parseExerciseMarkdown(markdown);
  expect(result.steps.length).toBe(3);
  expect(result.steps[1].content).toContain("Chemical weathering");
  expect(result.steps[1].content).toContain("Plate tectonics");
  expect(result.steps[1].content).toContain("Volcanoes");
});

test("keep bullet lists as markdown", () => {
  const result = parseExerciseMarkdown(markdown);
  expect(result.steps.length).toBe(3);
  // These assertions ensure the plain text is present
  expect(result.steps[1].content).toContain("Chemical weathering");
  expect(result.steps[1].content).toContain("Plate tectonics");
  expect(result.steps[1].content).toContain("Volcanoes");

  // Add these assertions to verify markdown formatting is preserved
  expect(result.steps[1].content).toContain("**Chemical weathering:**");
  expect(result.steps[1].content).toContain("**Plate tectonics:**");
  expect(result.steps[1].content).toContain("**Volcanoes:**");
});

test("deeply nested bullet lists", () => {
  const markdown = `*   **Educational Concepts:** This lesson introduces the difference between mass and weight, the effect of gravity, and the basic requirements for life (oxygen, pressure) by using the imaginative scenario of a panda in space.
*   **Target Grade Range:** Grades 6–9.
*   **Anticipate Common Misunderstandings:**
    *   Students frequently confuse mass and weight, using the terms interchangeably.
    *   Students might believe that "weightlessness" in space means an object no longer has mass.
    *   They may not be aware of the multiple lethal dangers of the vacuum of space beyond just the lack of air.
*   **Guidance on Evaluating Student Responses:**`;
  const result = parseExerciseMarkdown(markdown);

  expect(result.steps.length).toBe(1);
  expect(result.steps[0].content).toContain("Educational Concepts");
  expect(result.steps[0].content).toContain("Target Grade Range");
  expect(result.steps[0].content).toContain("Anticipate Common Misunderstandings");
  expect(result.steps[0].content).toContain("Students frequently confuse mass and weight");
  expect(result.steps[0].content).toContain("Guidance on Evaluating Student Responses");
});
