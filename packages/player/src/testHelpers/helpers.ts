/* eslint-disable import/prefer-default-export */
/* eslint-env jest */
// Used to avoid using Jest's fake timers and Date.now mocks
// See https://github.com/TheBrainFamily/wait-for-expect/issues/4 and

// https://github.com/TheBrainFamily/wait-for-expect/issues/12 for more info
const globalObj = typeof window === "undefined" ? global : window;

// Currently this fn only supports jest timers, but it could support other test runners in the future.
function runWithRealTimers(callback: () => any) {
  const callbackReturnValue = callback();

  return callbackReturnValue;
}

export function getSetTimeoutFn() {
  return runWithRealTimers(() => globalObj.setTimeout);
}
