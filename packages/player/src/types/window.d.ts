/**
 * Global Window Interface Extensions
 *
 * This file extends the global Window interface to include bus properties
 * that are dynamically added in development mode by createScopedBus and createBusWrapper.
 */

// Type for the scoped bus object returned by createScopedBus
type ScopedBus<Cmd extends Record<string, any>, Rs extends Record<string, any>> = {
  readonly emitCmd: <K extends keyof Cmd>(k: K, payload: Cmd[K]) => void;
  readonly onCmd: <K extends keyof Cmd>(k: K, h: (p: Cmd[K]) => void) => () => void;
  readonly emitRs: <K extends keyof Rs>(k: K, payload: Rs[K]) => void;
  readonly onRs: <K extends keyof Rs>(k: K, h: (p: Rs[K]) => void) => () => void;
  readonly waitRs: <K extends keyof Rs>(k: K, pred?: (p: Rs[K]) => boolean) => Promise<Rs[K]>;
};

declare global {
  interface Window {
    // Global bus added by enableBusDebug
    bus?: import("@/core/events").Bus;

    // Bus properties added by createScopedBus/createBusWrapper in DEV mode
    dinoBus?: ScopedBus<any, any>;
    coreBus?: ScopedBus<any, any>;
    counterBus?: ScopedBus<any, any>;
    slideRuleBus?: ScopedBus<any, any>;
    perfectOrangeJuiceBus?: ScopedBus<any, any>;
    cubesDensityBus?: ScopedBus<any, any>;
    EarthquakeBus?: ScopedBus<any, any>;
    manualSorterBus?: ScopedBus<any, any>;
    chatActionsBus?: ScopedBus<any, any>;
    batteryIndicatorBus?: ScopedBus<any, any>;
    paintTheWallBus?: ScopedBus<any, any>;

    // Generic fallback for any other dynamically added buses
    [key: `${string}Bus`]: ScopedBus<any, any> | undefined;
  }
}

export {};
