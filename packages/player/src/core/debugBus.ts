import { Bus, bus } from "./events";

/**
 * Installs a global listener that prints every event and,
 * in dev mode, mounts the bus instance on `window`.
 */
export function enableBusDebug(opts: { attachWindow?: boolean } = {}) {
  // 1. log everything
  const off = bus.on("*", (type: string, payload: unknown) => {
    // style a bit for readability
    const dir = type.startsWith("cmd.") ? "⬅︎ CMD" : "➡︎ RS ";
    console.log(`%c${dir} %c${type}`, "color:#0bf;font-weight:bold", "color:#999", payload);
  });

  // 2. expose to window (optional)
  if (opts.attachWindow && typeof window !== "undefined") {
    // raw bus
    (window as unknown as { bus: Bus }).bus = bus;
  }
  return off; // call to stop logging
}
