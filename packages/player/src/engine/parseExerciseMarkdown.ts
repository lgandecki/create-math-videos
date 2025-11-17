import { marked } from "marked";
import * as acorn from "acorn";
import { evaluate as safeEvaluate } from "eval-estree-expression";
import type { Token, Tokens } from "marked";

// --- Types for our new Lesson Engine ---
export type Action = { functionName: string; args: (string | number)[] };
export type Check = { action: Action; onSuccess: string; onFail: string };
export type ExerciseStep = {
  type: "text" | "task" | "action" | "check";
  content: string | Action[] | Check;
  event?: string;
};

export const parseFunctionCalls = (code: string): Action[] => {
  try {
    const ast = acorn.parse(code, { ecmaVersion: "latest", sourceType: "script" });
    const actions: Action[] = [];
    for (const node of ast.body) {
      if (
        node.type === "ExpressionStatement" &&
        node.expression.type === "CallExpression" &&
        node.expression.callee.type === "Identifier"
      ) {
        const functionName = node.expression.callee.name;
        const argNodes = node.expression.arguments;
        const evaluatedArgs = argNodes.map((argNode) => safeEvaluate.sync(argNode, {}, { strict: true }));
        let args: (string | number)[] = [];
        if (evaluatedArgs.length === 1 && typeof evaluatedArgs[0] === "object" && evaluatedArgs[0] !== null) {
          args = Object.values(evaluatedArgs[0]).map((v) => (typeof v === "number" ? v : String(v)));
        } else {
          args = evaluatedArgs.map((v) => (typeof v === "number" ? v : String(v)));
        }
        actions.push({ functionName, args });
      }
    }
    return actions;
  } catch (e) {
    console.warn(`Failed to parse code: ${code}`, e);
    return [];
  }
};

// --- Main Parsing Function ---
export const parseExerciseMarkdown = (markdown: string): { steps: ExerciseStep[]; aiContext: string } => {
  // Intermediate representation can include separators
  const rawSteps: (ExerciseStep | { type: "separator" })[] = [];
  let currentCheck: Check | null = null;
  let lastEventName: string | undefined = undefined;
  let isParsingOutcomeText = false; // Flag to ignore text for check outcomes
  let aiContext = ""; // Initialize AI context
  let isInAiGuideSection = false; // Track if we're in the AI Guide section

  // --- Helper Functions ---
  const sanitizeEvent = (s: string) =>
    s
      .toUpperCase()
      .replace(/[^A-Z0-9\s]+/g, "")
      .replace(/\s+/g, "_")
      .replace(/^_+|_+$/g, "");

  const isHeadingToken = (token: Token): token is Tokens.Heading => token.type === "heading";

  const tokens = marked.lexer(markdown);
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (token.type === "space") {
      i++;
      continue;
    }

    if (isHeadingToken(token)) {
      if (token.depth === 2) {
        if (/Notes for AI Guide/i.test(token.text)) {
          isInAiGuideSection = true;
          i++;
          while (i < tokens.length) {
            const t = tokens[i];
            if (isHeadingToken(t) && t.depth <= 2) {
              break;
            }
            if (t.type === "paragraph") {
              aiContext += (t as Tokens.Paragraph).text.trim() + "\n\n";
            } else if (t.type === "list") {
              const items =
                (t as Tokens.List).items?.map((item) => {
                  if (item.tokens && Array.isArray(item.tokens)) {
                    return item.tokens.map((sub) => (sub as any).text ?? "").join(" ");
                  }
                  return item.text ?? "";
                }) ?? [];
              aiContext += items.join(" ") + "\n";
            } else if (t.type === "blockquote") {
              const text =
                (t as Tokens.Blockquote).tokens
                  ?.map((sub) => {
                    if ("text" in sub) {
                      return (sub as any).text ?? "";
                    }
                    return "";
                  })
                  .join(" ") ?? "";
              aiContext += text.trim() + "\n\n";
            }
            i++;
          }
          isInAiGuideSection = false;
          continue;
        } else {
          isInAiGuideSection = false;
        }
      }

      if (token.depth === 1 || token.depth === 2) {
        isParsingOutcomeText = false;
        i++;
        continue;
      }

      if (token.depth === 3 && /Check/i.test(token.text)) {
        currentCheck = {
          action: { functionName: "", args: [] },
          onSuccess: "",
          onFail: "",
        };
        rawSteps.push({ type: "check", content: currentCheck });
        lastEventName = undefined;
        isParsingOutcomeText = false;
        i++;
        continue;
      }

      if (token.depth === 4) {
        const headingText = token.text.trim();

        if (currentCheck) {
          isParsingOutcomeText = true;
          const eventIdentifier = headingText;
          lastEventName = eventIdentifier;

          if (/^(correct|success|pass)/i.test(headingText)) {
            currentCheck.onSuccess = eventIdentifier;
          } else if (/^(incorrect|wrong|fail)/i.test(headingText)) {
            currentCheck.onFail = eventIdentifier;
          }
        } else {
          isParsingOutcomeText = false;
          const eventIdentifier = sanitizeEvent(headingText);
          lastEventName = eventIdentifier;
          rawSteps.push({ type: "separator" });
        }
        i++;
        continue;
      }
    }

    if (token.type === "code") {
      isParsingOutcomeText = false;
      const actions = parseFunctionCalls(token.text);
      if (actions.length > 0) {
        if (currentCheck && currentCheck.action.functionName === "") {
          currentCheck.action = actions[0];
        } else {
          rawSteps.push({ type: "action", content: actions });
        }
      } else {
        rawSteps.push({ type: "separator" });
      }
      lastEventName = undefined;
      i++;
      continue;
    }

    if (token.type === "hr") {
      isParsingOutcomeText = false;
      rawSteps.push({ type: "separator" });
      currentCheck = null;
      lastEventName = undefined;
      i++;
      continue;
    }

    if (["paragraph", "list", "blockquote", "table"].includes(token.type)) {
      if (isParsingOutcomeText) {
        isParsingOutcomeText = false;
        lastEventName = undefined;
        i++;
        continue;
      }

      const content = token.raw.trim();
      rawSteps.push({ type: "text", content, event: lastEventName });
      if (lastEventName) {
        lastEventName = undefined;
      } else if (currentCheck) {
        currentCheck = null;
      }
      i++;
      continue;
    }

    i++;
  }

  // Post-processing to merge consecutive text steps that are not event-driven
  const finalSteps: ExerciseStep[] = [];

  console.log(rawSteps);

  for (const step of rawSteps) {
    if (step.type !== "separator") {
      const exerciseStep = step as ExerciseStep;

      // If this is a text step without an event, check if we can merge with the previous step
      if (exerciseStep.type === "text" && !exerciseStep.event && finalSteps.length > 0) {
        const lastStep = finalSteps[finalSteps.length - 1];

        // Only merge if the last step ends with a colon (introduces a list) and this step looks like a list
        if (
          lastStep.type === "text" &&
          !lastStep.event &&
          typeof lastStep.content === "string" &&
          typeof exerciseStep.content === "string" &&
          lastStep.content.trim().endsWith(":") &&
          /^\s*(\*|-|\d+\.)\s/.test(exerciseStep.content.trim())
        ) {
          lastStep.content += "\n" + exerciseStep.content;
          continue;
        }
      }

      finalSteps.push(exerciseStep);
    }
  }

  return { steps: finalSteps, aiContext: aiContext.trim() };
};
