import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Wall from "./Wall";

interface PaintTheWallProps {
  width: number;
  height: number;
  units: string;
  tolerance: number;
  onComplete?: (result: { isCorrect: boolean; studentAnswer: number }) => void;
}

const PaintTheWall = ({ width, height, units, tolerance, onComplete }: PaintTheWallProps) => {
  const [paintedSquares, setPaintedSquares] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  const area = useMemo(() => width * height, [width, height]);
  const correctAnswer = useMemo(() => area, [area]); // 1 bucket per 1 square unit

  useEffect(() => {
    setPaintedSquares(0);
    setIsCorrect(null);
    setHasChecked(false);
  }, [width, height, units]);

  const handlePaintedSquaresChange = (count: number) => {
    setPaintedSquares(count);
    setIsCorrect(null);
    setHasChecked(false);
  };

  const checkAnswer = () => {
    const correct = Math.abs(paintedSquares - correctAnswer) <= tolerance;
    setIsCorrect(correct);
    setHasChecked(true);

    if (onComplete) {
      onComplete({ isCorrect: correct, studentAnswer: paintedSquares });
    }
  };

  const getEncouragement = () => {
    if (!hasChecked) return "";

    if (isCorrect) {
      return "🎉 Perfect! You painted enough area for the wall!";
    } else {
      if (paintedSquares < correctAnswer - tolerance) {
        return "🎨 You need more paint! Paint more squares to cover the area!";
      } else if (paintedSquares > correctAnswer + tolerance) {
        return "💡 You painted extra area - that's okay but you only needed " + correctAnswer + " squares!";
      } else {
        return "🏠 Almost there! Keep trying!";
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">🎨 Paint the Wall Game!</CardTitle>
        <CardDescription className="text-lg">
          You need to paint a {width} × {height} {units} area. Click on squares to paint them!
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <Wall
          width={width}
          height={height}
          units={units}
          onPaintedSquaresChange={handlePaintedSquaresChange}
          className="w-full"
        />

        {/* Paint bucket counter */}
        <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg">
          <div className="text-4xl">🪣</div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{paintedSquares}</p>
            <p className="text-sm text-blue-500">Paint Buckets Used</p>
          </div>
        </div>

        {/* Wall info */}
        <div className="grid grid-cols-2 gap-4 text-center w-full max-w-lg">
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-slate-600">Wall Size</p>
            <p className="text-lg font-bold">8 × 8 {units}</p>
            <p className="text-xs text-slate-500">(64 total squares)</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-blue-600">Area to Paint</p>
            <p className="text-lg font-bold text-blue-700">
              {width} × {height} = {area} {units}²
            </p>
            <p className="text-xs text-blue-500">Paint at least {area} squares</p>
          </div>
        </div>

        <Button
          onClick={checkAnswer}
          className="w-full max-w-md text-lg py-6 bg-green-500 hover:bg-green-600"
          disabled={paintedSquares === 0}
        >
          🏁 Check My Answer!
        </Button>

        {/* Feedback */}
        {hasChecked && (
          <div
            className={`w-full max-w-md text-center p-4 rounded-lg ${
              isCorrect ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
            }`}
          >
            <p className="text-lg font-medium mb-2">{getEncouragement()}</p>
            {isCorrect ? (
              <div>
                <p className="text-sm">Perfect! You painted at least {correctAnswer} squares!</p>
                <p className="text-xs mt-1">
                  Area = {width} × {height} = {correctAnswer} squares
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm">
                  You painted {paintedSquares} squares, but need at least {correctAnswer} squares.
                </p>
                <p className="text-xs mt-1">
                  Paint {paintedSquares < correctAnswer ? "more" : "the right amount of"} squares to cover the {width}×
                  {height} area!
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaintTheWall;
