import { useEarthquakeStore } from "@/stores/earthquakeStore";
import { Earthquake } from "./Earthquake";
import { useEffect } from "react";
import { slideRuleApi } from "../bridges/SlideRuleBridge";

// Wrapper component that syncs Storybook args with the Zustand store
export const EarthquakeWrapper = ({ magnitude = 6 }: { magnitude?: number }) => {
  const { setMagnitude } = useEarthquakeStore();

  // Update the store whenever the magnitude arg changes
  useEffect(() => {
    setMagnitude(magnitude);
  }, [magnitude, setMagnitude]);

  useEffect(() => {
    const offSlideRuleValueSet = slideRuleApi.onRsAlignmentSet(({ value }) => {
      setMagnitude(value);
    });
    return () => {
      offSlideRuleValueSet();
    };
  }, [setMagnitude]);

  return <Earthquake />;
};
