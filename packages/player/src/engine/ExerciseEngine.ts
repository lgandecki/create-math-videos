import { Bus } from "@/core/events";
import { parseExerciseMarkdown, ExerciseStep, Action, Check } from "./parseExerciseMarkdown";
import { chatActionsApi } from "@/components/chat/ChatActionEvents";
import { ToolRegistry, toolRegistry } from "./ToolRegistry";
import { getRandomGoOn } from "@/engine/humanizer.ts";
import { coreApi } from "@/components/bridges/CoreBridge";

// --- Type Definitions ---

type ExerciseEngineOptions = {
  markdown: string;
  bus: Bus;
};

export type EngineStatus =
  | "idle"
  | "running"
  | "waiting_for_check"
  | "waiting_for_estimation"
  | "waiting_for_answer"
  | "waiting_for_go_on"
  | "complete"
  | "error";

type QuestionContext = {
  question: string;
  expect: any;
};

// --- The Engine Class ---

export class ExerciseEngine {
  private bus: Bus;
  private steps: ExerciseStep[];
  private markdown: string;
  private aiContext: string;
  private currentStepIndex = -1;
  private status: EngineStatus = "idle";
  private visibleText = "";
  private conversationHistory: { role: "user" | "assistant" | "system"; content: string }[] = [];
  private currentQuestionContext: QuestionContext | null = null;
  private toolRegistry!: ToolRegistry;
  private goOnUnsubscribe: (() => void) | null = null;

  private resolveRunPromise!: (value: void | PromiseLike<void>) => void;
  private rejectRunPromise!: (reason?: any) => void;

  constructor(options: ExerciseEngineOptions, internalToolRegistry = toolRegistry) {
    this.bus = options.bus;
    this.markdown = options.markdown;
    const parsed = parseExerciseMarkdown(options.markdown);
    this.steps = parsed.steps;
    this.aiContext = parsed.aiContext;
    this.listenForUserEvents();
    this.toolRegistry = internalToolRegistry;
  }

  private setStatus(newStatus: EngineStatus) {
    this.status = newStatus;
    console.log("[ExerciseEngine] Status changed to:", newStatus);
    // **FIX**: Broadcast status changes on the event bus.
    coreApi.emitRsStatusUpdated({ status: newStatus });

    if (newStatus === "complete") {
      if (this.resolveRunPromise) this.resolveRunPromise();
    } else if (newStatus === "error") {
      if (this.rejectRunPromise) this.rejectRunPromise(new Error("Exercise failed due to an error."));
    }
  }

  private updateVisibleText(newText: string, role: "assistant" | "system" | "user" = "assistant") {
    this.visibleText += newText + "\n";
    this.conversationHistory.push({ role, content: newText });
    coreApi.emitRsTextUpdated({ text: newText, role });
  }

  private listenForUserEvents() {
    let currentAIResponse = "";

    // Listen for AI stream deltas to keep conversation history in sync
    coreApi.onRsAiStreamDelta((payload) => {
      currentAIResponse += payload.delta;
    });

    coreApi.onRsAiStreamComplete(() => {
      if (currentAIResponse) {
        this.conversationHistory.push({ role: "assistant", content: currentAIResponse });
        currentAIResponse = "";
      }
    });
    coreApi.onRsQuestionAnswered(async (payload) => {
      console.log("[ExerciseEngine] onRsQuestionAnswered", this.status, this.currentQuestionContext);
      if (this.status === "waiting_for_answer" && this.currentQuestionContext) {
        this.conversationHistory.push({ role: "user", content: payload.answer });
        // Create a promise that will resolve when streaming is complete
        const streamCompletePromise = new Promise<void>((resolve) => {
          const unsubscribe = coreApi.onRsAiStreamComplete(() => {
            unsubscribe();
            resolve();
          });
        });

        const evaluationPromise = new Promise<{ isTrue: boolean }>((resolve) => {
          const unsubscribe = coreApi.onRsAnswerEvaluated(({ isTrue }) => {
            console.log("[ExerciseEngine] onRsAnswerEvaluated", isTrue);
            unsubscribe();
            resolve({ isTrue });
          });
        });

        const nextSentence = this.steps[this.currentStepIndex + 1]?.content;
        const remainingSentences = this.steps
          .slice(this.currentStepIndex + 1)
          .filter((s) => s.type === "text")
          .map((s) => s.content)
          .join(" ");

        // Build the evaluation prompt
        const evaluationPrompt = `You are an expert AI tutor. Your goal is to guide a student to a full understanding of the lesson concepts through conversation.

---

### **Current Situation**

* **The student was asked:**
  "${this.currentQuestionContext.question}"
* **The student's most recent answer is:**
  "${payload.answer}"
* **The ideal conceptual answer is:**
  "${this.currentQuestionContext.expect}"
* **Teacher's guidance for you:**
  "${this.aiContext}"

---

### **Your Evaluation and Response Strategy**

Analyze the student's answer by choosing one of the following three states. Base your analysis on **conceptual understanding**, not on matching exact words. **Crucially, review the last 1-2 messages in the conversation history** to see if the student is building their answer over multiple turns.

**1. If the answer is "CORRECT":**
* **Condition:** The student's current answer, or the combination of their recent answers, fully captures the core concepts of the "expected answer".
* **Your Action:**
    * Warmly and explicitly affirm that their answer is correct.
    * Smoothly transition to the next part of the lesson by incorporating the teacher's suggested **"${nextSentence}"** adjusting it slightly if necessary, to naturally fit your reply to the student’s answer.

**2. If the answer is "PARTIALLY_CORRECT":**
* **Condition:** The student has identified at least one key concept from the "expected answer" but has missed others.
* **Your Action:**
    * Acknowledge and praise the part they got right (e.g., "You're exactly right about the verification aspect...").
    * Ask a targeted Socratic question to prompt them for the **specific missing piece** of the answer.
    * **Do NOT include the "${nextSentence}".**

**3. If the answer is "INCORRECT":**
* **Condition:** The student's answer does not align with the concepts in the "expected answer".
* **Your Action:**
    * Be encouraging. Do not say "you are wrong."
    * Ask a broader Socratic question to gently guide them back to the core topic of the original question.
    * **Do NOT include the "${nextSentence}".**

---

### **Critical Rules**

* **Never reveal the answer directly.** Your role is to guide, not to tell.
* **Do not mention upcoming lesson content.** The student should only see content as you reveal it. The "upcoming lesson content" below is for your context only.
* **Stay conversational and friendly.**

---

### **Content for Your Response (If student is "CORRECT")**

* **Teacher's suggested next sentence:**
  "${nextSentence}"
* **Upcoming lesson content (FOR YOUR EYES ONLY):**
  "${remainingSentences}"`;

        const contextWithEvaluation = [
          ...this.conversationHistory,
          { role: "system" as const, content: evaluationPrompt },
        ];

        coreApi.emitCmdAiAnswerStreamRequest({
          answer: `Please evaluate this answer and provide feedback.`,
          conversationHistory: contextWithEvaluation,
        });

        console.log("[ExerciseEngine] before evaluationPromise");
        // Wait for streaming to complete
        const { isTrue } = await evaluationPromise;
        console.log("[ExerciseEngine] evaluationPromise", isTrue);

        if (isTrue) {
          console.log("[ExerciseEngine] Student is correct, skipping next text step");
          this.currentQuestionContext = null;

          // Skip the next text step since AI already incorporated it
          if (nextSentence && this.steps[this.currentStepIndex + 1]?.type === "text") {
            this.currentStepIndex++;
          }

          this.setStatus("waiting_for_go_on");
        } else {
          console.log("[ExerciseEngine] Student is wrong, asking follow up question", this.getStatus());
        }
        await streamCompletePromise;
      }
    });
    coreApi.onRsEstimationProvided(async (payload) => {
      if (this.status === "waiting_for_estimation" && this.currentQuestionContext) {
        this.conversationHistory.push({ role: "user", content: payload.answer });
        // Create a promise that will resolve when streaming is complete
        const streamCompletePromise = new Promise<void>((resolve) => {
          const unsubscribe = coreApi.onRsAiStreamComplete(() => {
            unsubscribe();
            resolve();
          });
        });

        const nextSentence = this.steps[this.currentStepIndex + 1]?.content;
        const remainingSentences = this.steps
          .slice(this.currentStepIndex + 1)
          .filter((s) => s.type === "text")
          .map((s) => s.content)
          .join(" ");

        // Build the evaluation prompt
        const evaluationPrompt = `You are an AI tutor assisting a student.
The student was asked:
<question>${this.currentQuestionContext.question}</question>

The student answered:
<userAnswer>${payload.answer}</userAnswer>

The expected answer was:
<expectedAnswer>${this.currentQuestionContext.expect}</expectedAnswer>

Teacher's guidance notes for you:
<teacherNotes>${this.aiContext}</teacherNotes>

Important:

- Provide a friendly, conversational response directly addressing the student's answer.
- Do NOT include any explanations, concepts, or details that appear in the upcoming lesson content.
- Do NOT ask follow up questions.

The teacher has suggested the following next sentence:
<nextSentence>${nextSentence}</nextSentence>
Please incorporate this sentence into your response, adjusting it slightly if necessary, to naturally fit your reply to the student’s answer.

Upcoming lesson content (do NOT include or repeat any of this information in your reply):
<remainingSentences>${remainingSentences}</remainingSentences>`;

        const contextWithEvaluation = [
          ...this.conversationHistory,
          { role: "system" as const, content: evaluationPrompt },
        ];

        coreApi.emitCmdAiStreamRequest({
          question: `Please evaluate this answer and provide feedback.`,
          conversationHistory: contextWithEvaluation,
        });

        // Wait for streaming to complete
        await streamCompletePromise;

        // For now, we'll use a simple heuristic to determine correctness
        // In a real implementation, we'd need to parse the AI response
        // const isCorrect = String(payload.answer) === String(this.currentQuestionContext.expect);

        // if (isCorrect) {
        this.currentQuestionContext = null;

        // Skip the next text step since AI already incorporated it
        if (nextSentence && this.steps[this.currentStepIndex + 1]?.type === "text") {
          this.currentStepIndex++;
        }

        // this.setStatus("idle");
        this.setStatus("waiting_for_go_on");
        // await this.executeNextStep();
        // } else {
        // if (!this.currentQuestionContext.expect) {
        // this.currentQuestionContext = null;
        // await this.executeNextStep();
        // }
        // }
      }
    });

    coreApi.onRsGeneralQuestionAsked(async (payload) => {
      this.conversationHistory.push({ role: "user", content: payload.question });

      // Create a promise that will resolve when streaming is complete
      const streamCompletePromise = new Promise<void>((resolve) => {
        const unsubscribe = coreApi.onRsAiStreamComplete(() => {
          unsubscribe();
          resolve();
        });
      });

      // Request AI streaming with the full conversation context including AI context
      const contextWithAIInstructions = [
        ...this.conversationHistory,
        { role: "system" as const, content: `Notes for you from the teacher: ${this.aiContext}` },
      ];

      coreApi.emitCmdAiStreamRequest({
        question: payload.question,
        conversationHistory: contextWithAIInstructions,
      });

      // Wait for streaming to complete
      await streamCompletePromise;
    });

    // Listen for GO ON command from ChatActions
    this.goOnUnsubscribe = chatActionsApi.onCmdGoOn(async () => {
      // Don't add the "GO ON" message to conversation history - just process the action
      console.log("[ExerciseEngine] Received GO ON command, current status:", this.status);
      if (this.status === "waiting_for_go_on") {
        console.log("[ExerciseEngine] Resuming execution...");
        this.setStatus("idle");
        await this.executeNextStep();
      }
    });
  }

  public run(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.resolveRunPromise = resolve;
      this.rejectRunPromise = reject;
      this.currentStepIndex = -1;
      this.setStatus("running");
      this.executeNextStep();
    });
  }

  public async stop(): Promise<void> {
    //HERE we need to stop and delete as much as possible
    if (this.goOnUnsubscribe) {
      this.goOnUnsubscribe();
    }
  }

  public async executeNextStep(): Promise<void> {
    if (this.status !== "running" && this.status !== "idle") return;
    if (this.currentStepIndex >= this.steps.length - 1 && this.status === "idle") {
      this.setStatus("complete");
      return;
    }

    this.currentStepIndex++;
    const step = this.steps[this.currentStepIndex];
    if (!step) {
      this.setStatus("complete");
      return;
    }

    switch (step.type) {
      case "text":
        this.updateVisibleText(step.content as string);
        if (this.steps.length > this.currentStepIndex + 1 && this.steps[this.currentStepIndex + 1]?.type === "check") {
          await this.executeNextStep();
        } else {
          this.setStatus("waiting_for_go_on");
        }
        // No longer automatically continue - wait for GO ON
        return;
      case "action":
        for (const action of step.content as Action[]) {
          await this.callAction(action.functionName, ...action.args);
        }
        return this.executeNextStep();
      case "check":
        this.setStatus("waiting_for_check");
        await this.handleCheckLoop(step.content as Check);
        break;
      default:
        this.setStatus("waiting_for_go_on");
      // this.setStatus("error");
    }
  }

  private async handleCheckLoop(check: Check) {
    while (this.status === "waiting_for_check") {
      try {
        await this.callCheck(check.action.functionName, ...check.action.args);
        this.setStatus("idle");
        const successStep = this.steps.find((s) => s.event === check.onSuccess);
        const successMessage = (successStep?.content as string) || "Correct!";
        console.log("[ExerciseEngine] successMessage:", successMessage);
        this.updateVisibleText(successMessage);
        await this.executeNextStep();
      } catch (error) {
        console.log("[ExerciseEngine] handleCheckLoop error:", error);
        const failStep = this.steps.find((s) => s.event === check.onFail);
        const failMessage = (failStep?.content as string) || "Try again.";
        this.updateVisibleText(failMessage);
      }
    }
  }

  private async callAction(functionName: string, ...args: any[]) {
    console.log("[ExerciseEngine] callAction:", functionName, args);

    if (functionName === "ask") {
      this.setStatus("waiting_for_answer");
      const func = this.toolRegistry.actionRegistry.get("core.ask");
      if (func) {
        const payload = { question: args[0] as string, expect: args[1] };
        this.currentQuestionContext = payload;
        this.updateVisibleText(payload.question);
        await func(payload);
      }
      return;
    }
    if (functionName === "askForEstimation") {
      this.setStatus("waiting_for_estimation");
      const func = this.toolRegistry.actionRegistry.get("core.askForEstimation");
      if (func) {
        const payload = { question: args[0] as string, expect: args[1] };
        this.currentQuestionContext = payload;
        this.updateVisibleText(payload.question);
        await func(payload);
      }
      return;
    }

    let fullName = functionName;
    if (!functionName.includes(".")) {
      for (const key of this.toolRegistry.actionRegistry.keys()) {
        if (key.endsWith(`.${functionName}`)) {
          fullName = key;
          break;
        }
      }
    }
    const func = this.toolRegistry.actionRegistry.get(fullName);
    if (func) {
      await func(...args);
    } else {
      console.error(`[Engine] Action not found in registry: ${functionName}`);
      this.setStatus("error");
    }
  }

  private async callCheck(functionName: string, ...args: any[]) {
    let func = this.toolRegistry.checkRegistry.get(functionName);
    if (!func) {
      for (const [key, value] of this.toolRegistry.checkRegistry.entries()) {
        console.log("[ExerciseEngine] callCheck:", key, value);
        if (key.endsWith(`.${functionName}`)) {
          func = value;
          break;
        }
      }
    }
    if (func) {
      console.log("[ExerciseEngine] callCheck:", functionName, args);
      return func(...args);
    } else {
      console.error(`[Engine] Check not found: ${functionName}`);
      this.setStatus("error");
      throw new Error(`Check function not found: ${functionName}`);
    }
  }

  public getStatus = () => this.status;
  public getVisibleText = () => this.visibleText;
  public isComplete = () => this.status === "complete";
  public getConversationHistory = () => this.conversationHistory;
}
