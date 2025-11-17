import { createScopedBus } from "./bus";
import { v4 as uuidv4 } from "uuid";

export interface BusSliceAPI {
  name?: string;
  commands: Record<string, any>;
  responses: Record<string, any>;
}

type Emitter<P> = (payload: P) => void;
type Listener<P> = (handler: (payload: P) => void) => () => void;
type Waiter<P> = (pred?: (p: P) => boolean) => Promise<P>;

type Capitalize<S extends string> = S extends `${infer T}${infer U}` ? `${Uppercase<T>}${U}` : S;

/* -------------------------------------------------- public wrapper type */
type _BusWrapper<Cmd, Rs> = { [K in keyof Cmd as `emitCmd${Capitalize<string & K>}`]: Emitter<Cmd[K]> } & {
  [K in keyof Cmd as `onCmd${Capitalize<string & K>}`]: Listener<Cmd[K]>;
} & { [K in keyof Rs as `emitRs${Capitalize<string & K>}`]: Emitter<Rs[K]> } & {
  [K in keyof Rs as `onRs${Capitalize<string & K>}`]: Listener<Rs[K]>;
} & { [K in keyof Rs as `waitOnRs${Capitalize<string & K>}`]: Waiter<Rs[K]> };

/* --------------------------------- public ---------------------------- */
/**
 *  – `BusWrapper<Cmd, Rs>`     (2-arg form, fully explicit)
 *  – `BusWrapper<MySlice>`     (1-arg form, where MySlice has {commands,responses})
 */
export type BusWrapper<APIorCmd, Rs = never> = APIorCmd extends { commands: infer C; responses: infer R }
  ? _BusWrapper<C, R> // 1-arg “slice” form
  : _BusWrapper<APIorCmd, Rs>; // 2-arg classic form

/* -------------------------------------------------- main factory 2-in-1 */
export function createBusWrapper<
  NS extends string,
  Cmd extends Record<string, any>,
  Rs extends Record<string, any>,
  CK extends readonly (keyof Cmd)[],
  RK extends readonly (keyof Rs)[],
>(
  cmdKeys: CK, // ② whitelisted command keys
  rsKeys: RK, // ③ whitelisted response keys
  ns: NS // ① namespace, e.g. "core"
): BusWrapper<Pick<Cmd, CK[number]>, Pick<Rs, RK[number]>> {
  /* Build the namespaced bus once, use it below */
  const bus = createScopedBus<NS, Cmd, Rs>(ns);

  const w: any = {};

  /* ----- Cmd helpers ----- */
  for (const key of cmdKeys) {
    const cap = `${String(key)[0].toUpperCase()}${String(key).slice(1)}`;
    w[`emitCmd${cap}`] = (p: Cmd[typeof key]) => bus.emitCmd(key, p);
    w[`onCmd${cap}`] = (h: (p: Cmd[typeof key]) => void) => bus.onCmd(key, h);
  }

  /* ----- Rs helpers ----- */
  for (const key of rsKeys) {
    const cap = `${String(key)[0].toUpperCase()}${String(key).slice(1)}`;
    w[`emitRs${cap}`] = (p: Rs[typeof key]) => bus.emitRs(key, p);
    w[`onRs${cap}`] = (h: (p: Rs[typeof key]) => void) => bus.onRs(key, h);
    w[`waitOnRs${cap}`] = (pred?: (p: Rs[typeof key]) => boolean) => bus.waitRs(key, pred);
  }

  /* <optional> expose on window in dev exactly as createScopedBus did */
  if (import.meta.env.DEV && typeof window !== "undefined") {
    (window as any)[`${ns}Bus`] = bus;
  }

  /*
   * You may want the raw bus as well (e.g. for tests).
   * Either return just `w`, or a tuple/object that also contains `bus`.
   */
  return w as BusWrapper<Pick<Cmd, CK[number]>, Pick<Rs, RK[number]>>;
}
