export interface TutorialPlugin {
  ns: string;
  actions: Record<string, (...args: any[]) => any>;
  checks?: Record<string, (...args: any[]) => Promise<any>>;
}

export class ToolRegistry {
  private registeredPlugins: Map<string, TutorialPlugin> = new Map();
  public actionRegistry: Map<string, (...args: any[]) => any> = new Map();
  public checkRegistry: Map<string, (...args: any[]) => Promise<any>> = new Map();
  public registerTool(plugin: TutorialPlugin) {
    this.registeredPlugins.set(plugin.ns, plugin);
    for (const key in plugin.actions) {
      this.actionRegistry.set(`${plugin.ns}.${key}`, plugin.actions[key]);
    }
    if (plugin.checks) {
      for (const key in plugin.checks) {
        this.checkRegistry.set(`${plugin.ns}.${key}`, plugin.checks[key]);
      }
    }
  }
}

export const toolRegistry = new ToolRegistry();
