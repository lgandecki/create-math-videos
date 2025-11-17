import { useEffect } from "react";

import { counterApi } from "@/components/Counter/events";

export function CounterLessonOrchestrator() {
  useEffect(() => {
    /** pattern B — make them hit 3 targets in a row */
    const runThreeLevels = async () => {
      for (const target of [3, 7, 12]) {
        counterApi.emitCmdSetExpectedNumber({ number: target });
        console.log(`→ Waiting for ${target} …`);
        await counterApi.waitOnRsNumberSet((e) => {
          console.log("e", e);
          if (e.number === target) {
            return true;
          }
          console.log("sdfsdfsd", e.number, target);
          return false;
        });
        console.log(`✓ Reached ${target}`);
      }
      console.log("🏆 All levels done!");
    };

    /** pattern C — observe every increment while still awaiting milestones */
    const offEveryChange = counterApi.onRsNumberSet(({ number }) => {
      console.log("counter is now", number);
    });

    // choose the demo you want to run:
    // runLevelOne();
    runThreeLevels();

    // cleanup
    return () => offEveryChange();
  }, []);

  return null; // no UI – it’s just a controller
}
