import { useState, useMemo, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Beaker from "./Beaker";
import { Button } from "@/components/ui/button";

interface PerfectOrangeJuiceProps {
  concentrate: number;
  units: string;
  proportion: string;
  onComplete?: (result: { isCorrect: boolean; water: number }) => void;
}

const PerfectOrangeJuice = ({ concentrate, units, proportion, onComplete }: PerfectOrangeJuiceProps) => {
  const [water, setWater] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [concentratePart, waterPart] = useMemo(() => proportion.split(":").map(Number), [proportion]);
  const correctWater = useMemo(
    () => (concentrate * waterPart) / concentratePart,
    [concentrate, concentratePart, waterPart]
  );

  useEffect(() => {
    setWater(0);
  }, [concentrate, proportion]);

  const totalVolume = concentrate + water;
  const maxVolume = correctWater * 2; // Allows for double the correct amount of water

  const handleWaterChange = (newWater: number) => {
    setWater(newWater);
    setIsCorrect(null);
  };

  const checkRatio = () => {
    const correct = water === correctWater;
    setIsCorrect(correct);

    if (onComplete) {
      onComplete({ isCorrect: correct, water });
    }
  };

  const juiceColor = useMemo(() => {
    if (concentrate === 0) return "text-blue-300";
    const ratio = water / concentrate;
    const correctRatio = correctWater / concentrate;

    if (ratio < correctRatio * 0.5) return "text-orange-700";
    if (ratio < correctRatio * 0.75) return "text-orange-600";
    if (ratio < correctRatio) return "text-orange-500";
    if (ratio === correctRatio) return "text-yellow-400"; // Perfect!
    if (ratio > correctRatio) return "text-orange-400";
    return "text-orange-300";
  }, [concentrate, water, correctWater]);

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Perfect Orange Juice</CardTitle>
        <CardDescription>
          Your recipe calls for {proportion.split(":")[0]} part concentrate to {proportion.split(":")[1]} parts water.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Beaker className="w-48 h-48" level={totalVolume / maxVolume} liquidColor={juiceColor} />

        <div className="w-full text-center">
          <p>
            Concentrate: {concentrate} {units}
          </p>
          <p>
            Water: {water} {units}
          </p>
          <p>
            Total: {totalVolume} {units}
          </p>
        </div>

        <div className="w-full">
          <label htmlFor="water-slider" className="mb-2 block">
            Add Water ({units})
          </label>
          <Slider
            id="water-slider"
            min={0}
            max={maxVolume}
            step={10}
            value={[water]}
            onValueChange={(value) => handleWaterChange(value[0])}
          />
        </div>
        <Button onClick={checkRatio}>Check Ratio</Button>
      </CardContent>
    </Card>
  );
};

export default PerfectOrangeJuice;
