import React, { useState } from "react";

interface WallProps {
  width: number;
  height: number;
  units: string;
  onPaintedSquaresChange?: (count: number) => void;
  onReset?: () => void;
  className?: string;
}

const Wall = ({ width, height, units, onPaintedSquaresChange, onReset, className }: WallProps) => {
  const [paintedSquares, setPaintedSquares] = useState<Set<string>>(new Set());

  const resetWall = () => {
    setPaintedSquares(new Set());
    onPaintedSquaresChange?.(0);
    onReset?.();
  };

  // Always show an 8x8 grid for visual consistency
  const gridSize = 8;
  const scaleFactor = 35; // Fixed size for consistency
  const squareSize = scaleFactor;
  const wallWidth = gridSize * squareSize;
  const wallHeight = gridSize * squareSize;

  const handleSquareClick = (row: number, col: number) => {
    const squareId = `${row}-${col}`;
    const newPaintedSquares = new Set(paintedSquares);

    if (newPaintedSquares.has(squareId)) {
      newPaintedSquares.delete(squareId);
    } else {
      newPaintedSquares.add(squareId);
    }

    setPaintedSquares(newPaintedSquares);
    onPaintedSquaresChange?.(newPaintedSquares.size);
  };

  const renderSquares = () => {
    const squares = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const squareId = `${row}-${col}`;
        const isPainted = paintedSquares.has(squareId);
        const x = col * squareSize + 20;
        const y = row * squareSize + 20;

        squares.push(
          <rect
            key={squareId}
            x={x}
            y={y}
            width={squareSize}
            height={squareSize}
            fill={isPainted ? "#3b82f6" : "#f1f5f9"}
            stroke="#475569"
            strokeWidth="1"
            className={`cursor-pointer transition-all duration-200 hover:opacity-80 ${
              isPainted ? "fill-blue-500" : "fill-slate-100 hover:fill-slate-200"
            }`}
            onClick={() => handleSquareClick(row, col)}
          />
        );

        // Add paint drip effect for painted squares
        if (isPainted) {
          squares.push(
            <g key={`drip-${squareId}`} className="animate-pulse">
              <circle cx={x + squareSize / 2} cy={y + squareSize / 2} r="2" fill="#1e40af" opacity="0.8" />
              <path
                d={`M${x + squareSize / 2},${y + squareSize / 2} L${x + squareSize / 2},${y + squareSize - 5} L${x + squareSize / 2 - 2},${y + squareSize - 3} L${x + squareSize / 2 + 2},${y + squareSize - 3} Z`}
                fill="#1e40af"
                opacity="0.6"
              />
            </g>
          );
        }
      }
    }
    return squares;
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative bg-white rounded-lg shadow-lg p-4">
        <svg
          width={wallWidth + 40}
          height={wallHeight + 80}
          viewBox={`0 0 ${wallWidth + 40} ${wallHeight + 80}`}
          className="drop-shadow-md"
        >
          {/* Wall background */}
          <rect
            x={20}
            y={20}
            width={wallWidth}
            height={wallHeight}
            fill="#f8fafc"
            stroke="#334155"
            strokeWidth="2"
            rx="4"
          />

          {/* Interactive squares */}
          {renderSquares()}

          {/* Width dimension */}
          <line
            x1={20}
            y1={wallHeight + 35}
            x2={wallWidth + 20}
            y2={wallHeight + 35}
            stroke="#475569"
            strokeWidth="1"
            markerEnd="url(#arrowhead)"
            markerStart="url(#arrowhead)"
          />
          <text
            x={wallWidth / 2 + 20}
            y={wallHeight + 50}
            textAnchor="middle"
            fontSize="14"
            fill="#475569"
            fontWeight="bold"
          >
            {gridSize} {units}
          </text>

          {/* Height dimension */}
          <line
            x1={5}
            y1={20}
            x2={5}
            y2={wallHeight + 20}
            stroke="#475569"
            strokeWidth="1"
            markerEnd="url(#arrowhead)"
            markerStart="url(#arrowhead)"
          />
          <text
            x={12}
            y={wallHeight / 2 + 25}
            textAnchor="middle"
            fontSize="14"
            fill="#475569"
            fontWeight="bold"
            transform={`rotate(-90, 12, ${wallHeight / 2 + 25})`}
          >
            {gridSize} {units}
          </text>

          {/* Arrow marker definition */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Instructions and reset button for kids */}
      <div className="mt-4 text-center space-y-2">
        <p className="text-sm text-gray-600 font-medium">
          🎨 Paint an area of {width} × {height} = {width * height} squares
        </p>
        <p className="text-xs text-gray-500">
          Each square = 1 bucket of paint • Paint at least {width * height} squares!
        </p>
        <button
          onClick={resetWall}
          className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
        >
          🧽 Clear Wall
        </button>
      </div>
    </div>
  );
};

export default Wall;
