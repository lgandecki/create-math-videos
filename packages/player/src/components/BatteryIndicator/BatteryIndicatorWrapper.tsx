import { useEffect, useState } from "react";

import { batteryIndicatorApi } from "./BatteryIndicatorEvents.ts";
import BatteryIndicator from "./BatteryIndicator";
import { slideRuleApi } from "@/components/bridges/SlideRuleBridge.tsx";

export default function BatteryIndicatorWrapper() {
  const [batteryLevel, setBatteryLevel] = useState(80);
  const [expectedBatteryLevel, setExpectedBatteryLevel] = useState(55);
  const [expectedBatteryLevelReached, setExpectedBatteryLevelReached] = useState(null);
  const [batteryIndicatorKey, setBatteryIndicatorKey] = useState(0);

  useEffect(() => {
    const offReset = batteryIndicatorApi.onCmdReset(() => {
      setBatteryIndicatorKey((key) => key + 1);
    });
    const offSet = batteryIndicatorApi.onCmdSetExpectedBatteryLevel(({ level }) => {
      setExpectedBatteryLevel(level);
    });
    const offExpectedBatteryLevelReached = batteryIndicatorApi.onRsExpectedBatteryLevelReached(({ level }) => {
      setExpectedBatteryLevelReached(level);

      setTimeout(() => {
        setExpectedBatteryLevelReached(null);
      }, 3000);
    });

    return () => {
      offReset();
      offSet();
      offExpectedBatteryLevelReached();
    };
  }, []);

  useEffect(() => {
    const offSlideRuleValueSet = slideRuleApi.onRsAlignmentSet(({ value }) => {
      handleBatteryLevel(value);
    });
    return () => {
      offSlideRuleValueSet();
    };
  }, []);

  const handleBatteryLevel = (level: number) => {
    const calculatedLevel = level * 10;
    setBatteryLevel(calculatedLevel);
    batteryIndicatorApi.emitRsBatteryLevelSet({ level: calculatedLevel });
  };

  return (
    <BatteryIndicator
      key={batteryIndicatorKey}
      expectedBatteryLevel={expectedBatteryLevel}
      onBatteryLevelSet={handleBatteryLevel}
      expectedBatteryLevelReached={expectedBatteryLevelReached}
      batteryLevel={batteryLevel}
    />
  );
}
