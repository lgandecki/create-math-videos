// src/utils/env.ts
export function isTestRun(): boolean {
  // Jest sets JEST_WORKER_ID
  if (
    typeof process !== "undefined" &&
    typeof process.env !== "undefined" &&
    typeof process.env.JEST_WORKER_ID !== "undefined"
  ) {
    return true;
  }

  // Vitest injects import.meta.vitest
  // Note: this check will be tree-shaken away in production builds,
  // since import.meta.vitest is only true during Vitest runs.
  // @ts-ignore
  if (typeof import.meta !== "undefined" && !!(import.meta as any).vitest) {
    return true;
  }

  // Running under Node (CLI) but not browser
  if (
    typeof process !== "undefined" &&
    typeof process.versions !== "undefined" &&
    typeof process.versions.node !== "undefined"
  ) {
    return true;
  }

  // Otherwise (e.g. real browser), it’s not a test/CLI run
  return false;
}
