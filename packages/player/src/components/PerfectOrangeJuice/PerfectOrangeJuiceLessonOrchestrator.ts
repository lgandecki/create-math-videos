import { useEffect } from "react";
import { perfectOrangeJuiceApi } from "@/components/PerfectOrangeJuice/PerfectOrangeJuiceEvents.ts";

export function PerfectOrangeJuiceLessonOrchestrator() {
  useEffect(() => {
    const runThreeLevels = async () => {
      for (const target of [
        { concentrate: 200, units: "ml", proportion: "1:3" },
        { concentrate: 100, units: "ml", proportion: "1:5" },
        { concentrate: 50, units: "ml", proportion: "1:10" },
      ]) {
        perfectOrangeJuiceApi.emitCmdSetMixture({
          concentrate: target.concentrate,
          units: target.units,
          proportion: target.proportion,
        });

        console.log(`-> Waiting for ${target} ...`);

        await perfectOrangeJuiceApi.waitOnRsCompleted((e) => {
          console.log("58: e BANG!", e);
          if (e.isCorrect) {
            return true;
          }
          console.log("sdfsdfsd", e.water, target);
          return false;
        });
      }
    };

    const offEveryChange = perfectOrangeJuiceApi.onRsCompleted(({ isCorrect, water }) => {
      console.log("64: isCorrect BANG!", isCorrect);
      console.log("65: water BANG!", water);
    });

    runThreeLevels();

    return () => offEveryChange();
  }, []);

  return null;
}
