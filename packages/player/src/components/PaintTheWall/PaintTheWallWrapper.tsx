import { useEffect, useState } from "react";
import { paintTheWallApi } from "./events";
import PaintTheWall from "./PaintTheWall";

interface WallConfig {
  width: number;
  height: number;
  units: string;
  tolerance: number;
}

export default function PaintTheWallWrapper() {
  const [wallConfig, setWallConfig] = useState<WallConfig>({
    width: 3,
    height: 3,
    units: "m",
    tolerance: 1,
  });
  const [componentKey, setComponentKey] = useState(0);

  useEffect(() => {
    const offReset = paintTheWallApi.onCmdReset(() => {
      setComponentKey((key) => key + 1);
    });
    const offSetWall = paintTheWallApi.onCmdSetWall((config) => {
      setWallConfig(config);
    });

    return () => {
      offReset();
      offSetWall();
    };
  }, []);

  const handleComplete = (result: { isCorrect: boolean; studentAnswer: number }) => {
    paintTheWallApi.emitRsCompleted(result);
  };

  return (
    <PaintTheWall
      key={componentKey}
      width={wallConfig.width}
      height={wallConfig.height}
      units={wallConfig.units}
      tolerance={wallConfig.tolerance}
      onComplete={handleComplete}
    />
  );
}
