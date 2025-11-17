import { useEffect } from "react";
import { paintTheWallApi } from "@/components/PaintTheWall/events.ts";

export function PaintTheWallLessonOrchestrator() {
  useEffect(() => {
    const runPaintTheWallLesson = async () => {
      // First wall: 3m × 3m
      paintTheWallApi.emitCmdSetWall({
        width: 3,
        height: 3,
        units: "m",
        tolerance: 1,
      });

      console.log("-> Waiting for 3×3 wall calculation (should be 9 buckets)...");

      // @ts-ignore
      await paintTheWallApi.waitOnRsCompleted((e) => {
        console.log("3×3 wall result:", e);
        if (e.isCorrect) {
          return true;
        }
        console.log("3×3 wall incorrect, expected: 9, got:", e.studentAnswer);
        return false;
      });

      // Second wall: 5m × 4m
      paintTheWallApi.emitCmdSetWall({
        width: 5,
        height: 4,
        units: "m",
        tolerance: 1,
      });

      console.log("-> Waiting for 5×4 wall calculation (should be 20 buckets)...");

      await paintTheWallApi.waitOnRsCompleted((e) => {
        console.log("5×4 wall result:", e);
        if (e.isCorrect) {
          return true;
        }
        console.log("5×4 wall incorrect, expected: 20, got:", e.studentAnswer);
        return false;
      });

      console.log("-> Paint the Wall lesson completed!");
    };

    const offEveryChange = paintTheWallApi.onRsCompleted(({ isCorrect, studentAnswer }) => {
      console.log("Wall paint calculation result:", { isCorrect, studentAnswer });
    });

    runPaintTheWallLesson();

    return () => offEveryChange();
  }, []);

  return null;
}
