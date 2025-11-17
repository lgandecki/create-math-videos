import { Bus } from "@/core/events";
import { TutorialPlugin } from "@/engine/ToolRegistry.ts";

export type CliToolConfig = {
  actions: string[];
  checks?: string[];
  events?: string[];
};

/**
 * Represents a stateful, non-UI tool for the CLI environment.
 * It now emits events for all its activities instead of logging directly.
 */
export class CliTool {
  public ns: string;
  public config: CliToolConfig;
  private bus: Bus;
  private state: Record<string, any> = {};

  constructor(bus: Bus, namespace: string, config: CliToolConfig) {
    this.bus = bus;
    this.ns = namespace;
    this.config = config;
  }

  public emitEvent(eventName: string, payload: any) {
    const eventTopic = `rs.${this.ns}.${eventName}`;
    this.bus.emit(eventTopic, payload);
  }

  public getPlugin(): TutorialPlugin {
    const plugin: TutorialPlugin = {
      ns: this.ns,
      actions: {},
      checks: {},
    };

    // Actions now emit a 'cmd.*' event.
    this.config.actions.forEach((actionName) => {
      plugin.actions[actionName] = (...args: any[]) => {
        const eventTopic = `cmd.${this.ns}.${actionName}`;
        const payload = args.length > 1 ? args : args[0];
        this.bus.emit(eventTopic as any, payload);
        this.state[actionName] = args.length > 0 ? args[0] : true;
      };
    });

    // Checks now emit a 'check.activated' event.
    (this.config.checks || []).forEach((checkName) => {
      plugin.checks![checkName] = (expectedValue: any) => {
        this.bus.emit("check.activated" as any, { name: `${this.ns}.${checkName}`, args: [expectedValue] });

        return new Promise<void>((resolve, reject) => {
          const eventName = this.config.events?.[0];
          if (!eventName) {
            return reject(new Error(`No event configured for check ${checkName} on tool ${this.ns}`));
          }
          const eventTopic = `rs.${this.ns}.${eventName}` as any;

          const handler = (payload: { value: any }) => {
            if (payload.value === expectedValue) {
              this.bus.off(eventTopic, handler as any);
              resolve();
            } else {
              reject(new Error("Incorrect user input"));
            }
          };
          this.bus.on(eventTopic, handler as any);
        });
      };
    });

    return plugin;
  }
}
