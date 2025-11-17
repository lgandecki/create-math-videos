import { useEffect, useState } from "react";
import { perfectOrangeJuiceApi } from "./PerfectOrangeJuiceEvents.ts";
import PerfectOrangeJuice from "./PerfectOrangeJuice";

interface Mixture {
  concentrate: number;
  units: string;
  proportion: string;
}

export default function PerfectOrangeJuiceWrapper() {
  const [mixture, setMixture] = useState<Mixture>({ concentrate: 0, units: "ml", proportion: "1:1" });
  const [componentKey, setComponentKey] = useState(0);

  useEffect(() => {
    const offReset = perfectOrangeJuiceApi.onCmdReset(() => {
      setComponentKey((key) => key + 1);
    });
    const offSetMixture = perfectOrangeJuiceApi.onCmdSetMixture(({ concentrate, units, proportion }) => {
      setMixture({ concentrate, units, proportion });
    });

    return () => {
      offReset();
      offSetMixture();
    };
  }, []);

  const handleComplete = (result: { isCorrect: boolean; water: number }) => {
    perfectOrangeJuiceApi.emitRsCompleted(result);
  };

  return (
    <PerfectOrangeJuice
      key={componentKey}
      concentrate={mixture.concentrate}
      units={mixture.units}
      proportion={mixture.proportion}
      onComplete={handleComplete}
    />
  );
}
