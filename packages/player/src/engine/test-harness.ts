import { Bus } from "@/core/events";
import { TutorialPlugin } from "@/engine/ToolRegistry";
import { vi } from "vitest";
import type { Mock } from "vitest";
export type FakeToolConfig = {
  actions?: string[];
  checks?: string[];
  events?: string[];
};

/**
 * Simulates a UI component for testing. It now correctly handles check success/failure.
 */
export class FakeTool {
  public actions: { [key: string]: Mock } = {};
  public checks: { [key: string]: Mock } = {};

  private bus: Bus;
  private ns: string;

  constructor(bus: Bus, namespace: string, config: FakeToolConfig) {
    this.bus = bus;
    this.ns = namespace;
    this.setupMocks(config);
  }

  /**
   * Creates jest.fn() mocks for all actions and checks.
   * The check mock now contains the logic to resolve or reject based on events.
   */
  private setupMocks(config: FakeToolConfig) {
    (config.actions || []).forEach((actionName) => {
      this.actions[actionName] = vi.fn();
    });

    (config.checks || []).forEach((checkName) => {
      // **FIX**: The check function now returns a promise that can be rejected.
      this.checks[checkName] = vi.fn((expectedValue: any) => {
        console.log(`[FakeTool:${this.ns}] Check activated: ${checkName}(${expectedValue})`);

        return new Promise<void>((resolve, reject) => {
          // The event handler for this specific check
          const handler = (payload: { value: any }) => {
            console.log(`[FakeTool:${this.ns}] Event received. Expected: ${expectedValue}, Got: ${payload.value}`);

            // Compare the event payload with the expected value
            if (payload.value === expectedValue) {
              console.log(`[FakeTool:${this.ns}] Correct value. Resolving check.`);
              cleanup();
              resolve();
            } else {
              console.log(`[FakeTool:${this.ns}] Incorrect value. Rejecting check.`);
              // Don't clean up the listener yet, allow the user to try again.
              reject(new Error("Incorrect user input"));
            }
          };

          // The event name is assumed to be in the 'events' config.
          const eventTopic = `rs.${this.ns}.${config.events?.[0]}` as any;

          const cleanup = () => {
            this.bus.off(eventTopic, handler as any);
          };

          this.bus.on(eventTopic, handler as any);
        });
      });
    });
  }

  /**
   * Simulates a user action by emitting a result ('rs') event onto the bus.
   */
  public async emitEvent(eventName: string, payload: any) {
    const eventTopic = `rs.${this.ns}.${eventName}` as any;
    console.log(`[FakeTool:${this.ns}] Emitting event '${eventTopic}'`, payload);
    this.bus.emit(eventTopic, payload);
    // Give the bus a moment to process the event and promises to settle
    await new Promise((resolve) => setImmediate(resolve));
  }

  /**
   * Generates a plugin object that the LessonEngine can register.
   */
  public getPlugin(): TutorialPlugin {
    const plugin: TutorialPlugin = {
      ns: this.ns,
      actions: {},
      checks: {},
    };

    Object.keys(this.actions).forEach((name) => {
      plugin.actions[name] = this.actions[name];
    });
    Object.keys(this.checks).forEach((name) => {
      plugin.checks![name] = this.checks[name];
    });

    return plugin;
  }
}
