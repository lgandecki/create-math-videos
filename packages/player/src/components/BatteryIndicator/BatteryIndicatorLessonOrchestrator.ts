import { useEffect } from "react";

import { batteryIndicatorApi } from "./BatteryIndicatorEvents.ts";

export function BatteryIndicatorLessonOrchestrator() {
  useEffect(() => {
    /** pattern B — make them hit 3 targets in a row */
    const runThreeLevels = async () => {
      for (const target of [55, 30, 5]) {
        batteryIndicatorApi.emitCmdSetExpectedBatteryLevel({ level: target });

        console.log(`→ Waiting for ${target} …`);

        await batteryIndicatorApi.waitOnRsBatteryLevelSet((e) => {
          if (e.level === target) {
            batteryIndicatorApi.emitRsExpectedBatteryLevelReached({ level: target });

            return true;
          }

          return false;
        });

        console.log(`✓ Reached ${target}`);
      }

      console.log("🏆 All levels done!");
    };

    /** pattern C — observe every increment while still awaiting milestones */
    const offEveryChange = batteryIndicatorApi.onRsBatteryLevelSet(({ level }) => {
      console.log("battery level is now", level);
    });

    runThreeLevels();

    return () => {
      offEveryChange();
    };
  }, []);

  return null; // no UI – it's just a controller
}
