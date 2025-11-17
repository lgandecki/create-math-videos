import { useState, useMemo, useEffect } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Cube from "./Cube";

interface CubesDensityProps {
  side: number;
  density: number;
  units: string;
  cubeType: "steel" | "styrofoam";
  tolerance: number;
  onComplete?: (result: { isCorrect: boolean; studentAnswer: number }) => void;
}

const CubesDensity = ({ side, density, units, cubeType, tolerance, onComplete }: CubesDensityProps) => {
  const [studentAnswer, setStudentAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const volume = useMemo(() => Math.pow(side, 3), [side]);
  const correctMass = useMemo(() => density * volume, [density, volume]);

  useEffect(() => {
    setStudentAnswer("");
    setIsCorrect(null);
  }, [side, density, cubeType]);

  const handleAnswerChange = (value: string) => {
    setStudentAnswer(value);
    setIsCorrect(null);
  };

  const checkAnswer = () => {
    const answerValue = parseFloat(studentAnswer);
    if (isNaN(answerValue)) {
      return;
    }

    const correct = Math.abs(answerValue - correctMass) <= tolerance;
    setIsCorrect(correct);

    if (onComplete) {
      onComplete({ isCorrect: correct, studentAnswer: answerValue });
    }
  };

  const materialInfo = {
    steel: { color: "bg-slate-600", description: "Dense metallic material" },
    styrofoam: { color: "bg-gray-100", description: "Lightweight foam material" },
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Cubes & Density
          <span className={`px-2 py-1 text-xs font-medium rounded border ${materialInfo[cubeType].color}`}>
            {cubeType.toUpperCase()}
          </span>
        </CardTitle>
        <CardDescription>
          Calculate the mass of a {side} cm cube of {cubeType} (ρ = {density} g/cm³)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Cube side={side} material={cubeType} className="w-48 h-48" />

        <div className="w-full text-center space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Side length:</p>
              <p>{side} cm</p>
            </div>
            <div>
              <p className="font-medium text-wrap">Volume:</p>
              <p className="text-wrap">
                {volume >= 1e15
                  ? `${(volume / 1e15).toLocaleString(undefined, { maximumFractionDigits: 2 })} × 10¹⁵`
                  : volume >= 1e12
                    ? `${(volume / 1e12).toLocaleString(undefined, { maximumFractionDigits: 2 })} × 10¹²`
                    : volume.toLocaleString()}{" "}
                cm³
              </p>
            </div>
            <div>
              <p className="font-medium">Density:</p>
              <p>{density} g/cm³</p>
            </div>
            <div>
              <p className="font-medium">Tolerance:</p>
              <p>+-{tolerance || 0} g</p>
            </div>
            <div className="col-span-2 w-full">
              <p className="font-medium">Your answer:</p>
              <p>{studentAnswer || "0"} g</p>
            </div>
          </div>
        </div>

        <div className="w-full">
          <label htmlFor="mass-input" className="mb-2 block text-sm font-medium">
            Estimated Mass (g)
          </label>
          <Input
            id="mass-input"
            type="number"
            placeholder="Enter mass in grams"
            value={studentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                checkAnswer();
              }
            }}
            className="w-full"
          />
        </div>

        <Button onClick={checkAnswer} className="w-full">
          Check Answer
        </Button>

        {isCorrect !== null && (
          <div
            className={`w-full text-center p-3 rounded-lg ${
              isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {isCorrect ? (
              <div>
                <p className="font-medium">Correct!</p>
                <p className="text-sm">
                  Mass = {correctMass.toLocaleString()} g (±{tolerance}g tolerance)
                </p>
              </div>
            ) : (
              <div>
                <p className="font-medium">Try again!</p>
                <p className="text-sm">Hint: Mass = Density × Volume</p>
                <p className="text-sm">Answer should be within {tolerance}g of the correct value</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CubesDensity;
