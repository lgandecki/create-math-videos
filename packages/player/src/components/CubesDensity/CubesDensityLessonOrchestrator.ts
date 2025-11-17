import { useEffect } from "react";
import { cubesDensityApi } from "@/components/CubesDensity/CubesDensityEvents";

export function CubesDensityLessonOrchestrator() {
  useEffect(() => {
    const runTwoLevels = async () => {
      for (const target of [
        {
          side: 10,
          density: 7.8,
          units: "g/cm³",
          cubeType: "steel",
          tolerance: 100,
        },
        {
          side: 10,
          density: 0.05,
          units: "g/cm³",
          cubeType: "styrofoam",
          tolerance: 5,
        },
      ]) {
        cubesDensityApi.emitCmdSetCube({
          ...target,
          cubeType: target.cubeType as "steel" | "styrofoam",
        });

        console.log(`-> Waiting for ${target.cubeType} cube calculation...`);

        await cubesDensityApi.waitOnRsCompleted((e) => {
          console.log(`${target.cubeType} cube result:`, e);
          if (e.isCorrect) {
            return true;
          }
          const expectedMass = target.density * Math.pow(target.side, 3);
          console.log(`${target.cubeType} cube incorrect, expected: ${expectedMass}g, got:`, e.studentAnswer);
          return false;
        });
        console.log(`-> ${target.cubeType} cube calculation completed!`);
      }
      console.log("🏆 All levels done!");
    };

    const offEveryChange = cubesDensityApi.onRsCompleted(({ isCorrect, studentAnswer }) => {
      console.log("Cube calculation result:", { isCorrect, studentAnswer });
    });

    runTwoLevels();

    return () => offEveryChange();
  }, []);

  return null;
}
