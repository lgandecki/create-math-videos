import mitt from "mitt";

export interface CmdPayload {} // engine → widget
export interface RsPayload {} // widget → engine

export const bus = mitt<Record<string, unknown>>();

export type Bus = typeof bus;

export const resetBus = () => {
  bus.all.clear();
};
