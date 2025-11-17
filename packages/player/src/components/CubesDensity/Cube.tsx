import React from "react";

interface CubeProps {
  side: number;
  material: "steel" | "styrofoam";
  className?: string;
}

const Cube = ({ side, material, className }: CubeProps) => {
  const materialColors = {
    steel: {
      front: "#4a5568",
      top: "#718096",
      right: "#2d3748",
    },
    styrofoam: {
      front: "#f7fafc",
      top: "#edf2f7",
      right: "#e2e8f0",
    },
  };

  const colors = materialColors[material];
  const cubeSize = Math.min(side * 10, 150);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        width={cubeSize * 1.5}
        height={cubeSize * 1.5}
        viewBox={`0 0 ${cubeSize * 1.5} ${cubeSize * 1.2}`}
        className="drop-shadow-md"
      >
        <defs>
          <pattern id={`steel-pattern-${side}`} patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill={colors.front} />
            <circle cx="10" cy="10" r="1" fill="#2d3748" opacity="0.3" />
          </pattern>
          <pattern id={`styrofoam-pattern-${side}`} patternUnits="userSpaceOnUse" width="15" height="15">
            <rect width="15" height="15" fill={colors.front} />
            <circle cx="3" cy="3" r="1" fill="#cbd5e0" opacity="0.5" />
            <circle cx="12" cy="7" r="1" fill="#cbd5e0" opacity="0.5" />
            <circle cx="7" cy="12" r="1" fill="#cbd5e0" opacity="0.5" />
          </pattern>
        </defs>

        {/* Front face */}
        <rect
          x={cubeSize * 0.2}
          y={cubeSize * 0.3}
          width={cubeSize}
          height={cubeSize}
          fill={material === "steel" ? `url(#steel-pattern-${side})` : `url(#styrofoam-pattern-${side})`}
          stroke="#2d3748"
          strokeWidth="1"
        />

        {/* Top face */}
        <polygon
          points={`${cubeSize * 0.2},${cubeSize * 0.3} ${cubeSize * 0.5},${cubeSize * 0.1} ${cubeSize * 1.5},${cubeSize * 0.1} ${cubeSize * 1.2},${cubeSize * 0.3}`}
          fill={colors.top}
          stroke="#2d3748"
          strokeWidth="1"
        />

        {/* Right face */}
        <polygon
          points={`${cubeSize * 1.2},${cubeSize * 0.3} ${cubeSize * 1.5},${cubeSize * 0.1} ${cubeSize * 1.5},${cubeSize * 1.1} ${cubeSize * 1.2},${cubeSize * 1.3}`}
          fill={colors.right}
          stroke="#2d3748"
          strokeWidth="1"
        />

        {/* Material label */}
        <text x={cubeSize * 0.7} y={cubeSize * 0.8} textAnchor="middle" fontSize="12" fill="#2d3748" fontWeight="bold">
          {material.toUpperCase()}
        </text>
      </svg>
    </div>
  );
};

export default Cube;
