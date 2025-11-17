import { useEffect, useState } from "react";

import { Cube, cubesDensityApi } from "./CubesDensityEvents";
import CubesDensity from "./CubesDensity";
import { slideRuleApi } from "@/components/bridges/SlideRuleBridge.tsx";

const MIN_CUBE_SIDE = 1;
const MAX_CUBE_SIDE = 20;

interface CubesDensityWrapperProps {
  cube?: Cube;
}

export default function CubesDensityWrapper({
  cube = {
    side: 10,
    density: 7.8,
    units: "g/cm³",
    cubeType: "steel",
    tolerance: 100,
  },
}: CubesDensityWrapperProps) {
  const [cubeConfig, setCubeConfig] = useState<Cube>(cube);
  const [componentKey, setComponentKey] = useState(0);

  useEffect(() => {
    const offReset = cubesDensityApi.onCmdReset(() => {
      setComponentKey((key) => key + 1);
    });
    const offSetCube = cubesDensityApi.onCmdSetCube((config) => {
      setCubeConfig(config);
    });

    return () => {
      offReset();
      offSetCube();
    };
  }, []);

  useEffect(() => {
    const offSlideRuleValueSet = slideRuleApi.onRsAlignmentSet(({ value }) => {
      const newSide = Math.max(MIN_CUBE_SIDE, Math.min(MAX_CUBE_SIDE, value));
      setCubeConfig((prev) => ({ ...prev, side: newSide }));
    });

    return () => {
      offSlideRuleValueSet();
    };
  }, []);

  const handleComplete = (result: { isCorrect: boolean; studentAnswer: number }) => {
    cubesDensityApi.emitRsCompleted(result);
  };

  return (
    <CubesDensity
      key={componentKey}
      side={cubeConfig.side}
      density={cubeConfig.density}
      units={cubeConfig.units}
      cubeType={cubeConfig.cubeType}
      tolerance={cubeConfig.tolerance}
      onComplete={handleComplete}
    />
  );
}
