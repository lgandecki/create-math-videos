import { bus } from "@/core/events";

/**
 * Build a namespaced, typed façade over the global bus.
 */
export function createScopedBus<NS extends string, Cmd extends Record<string, any>, Rs extends Record<string, any>>(
  ns: NS
) {
  /* ───── emitters ─────────────────────────────── */
  function emitCmd<K extends keyof Cmd>(k: K, payload: Cmd[K]) {
    const type = `cmd.${ns}.${String(k)}` as keyof import("@/core/events").CmdPayload;
    bus.emit(type, payload as never);
  }
  function emitRs<K extends keyof Rs>(k: K, payload: Rs[K]) {
    const type = `rs.${ns}.${String(k)}` as keyof import("@/core/events").RsPayload;
    bus.emit(type, payload as never);
  }

  /* ───── listeners (return cleanup fn) ────────── */
  function onCmd<K extends keyof Cmd>(k: K, h: (p: Cmd[K]) => void) {
    const type = `cmd.${ns}.${String(k)}` as any;
    const handler = h as any;
    bus.on(type, handler);
    return () => bus.off(type, handler);
  }
  function onRs<K extends keyof Rs>(k: K, h: (p: Rs[K]) => void) {
    const type = `rs.${ns}.${String(k)}` as any;
    const handler = h as any;
    bus.on(type, handler);
    return () => bus.off(type, handler);
  }

  /* optional promise helper */
  function waitRs<K extends keyof Rs>(k: K, pred: (p: Rs[K]) => boolean = () => true): Promise<Rs[K]> {
    return new Promise((res) => {
      const off = onRs(k, (e) => {
        if (pred(e)) {
          off();
          res(e);
        }
      });
    });
  }

  const scoped = { emitCmd, onCmd, emitRs, onRs, waitRs } as const;

  /* expose on window in dev */
  if (typeof window !== "undefined") {
    (window as any)[`${ns}Bus`] = scoped;
  }
  return scoped;
}
