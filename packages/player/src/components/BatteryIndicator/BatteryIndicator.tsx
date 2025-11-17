import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";

interface BatteryIndicatorProps {
  expectedBatteryLevel: number;
  onBatteryLevelSet: (level: number) => void;
  expectedBatteryLevelReached: number | null;
  batteryLevel: number;
}

const BatteryIndicator = ({
  expectedBatteryLevel,
  onBatteryLevelSet,
  expectedBatteryLevelReached,
  batteryLevel,
}: BatteryIndicatorProps) => {
  const [displayValue, setDisplayValue] = useState<number | null>(null);

  useEffect(() => {
    if (expectedBatteryLevelReached !== null) {
      setDisplayValue(expectedBatteryLevelReached);
    }
  }, [expectedBatteryLevelReached]);

  const getBatteryColor = (level: number) => {
    if (level <= 20) return "#ef4444";
    if (level <= 50) return "#eab308";
    return "#16a34a";
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-center">
        <div className="relative">
          <svg width="140" height="220" viewBox="0 0 59.616 59.616" className="drop-shadow-lg filter">
            {/* Phone outline */}
            <path
              d="M41.559,0H18.057c-3.394,0-6.156,2.762-6.156,6.156v0.572v41.971v4.761c0,3.395,2.762,6.156,6.156,6.156h23.502
                c3.395,0,6.156-2.762,6.156-6.156v-4.761V6.728V6.156C47.716,2.762,44.954,0,41.559,0z M29.808,56.395
                c-1.65,0-2.988-1.338-2.988-2.988c0-1.65,1.338-2.988,2.988-2.988c1.65,0,2.988,1.338,2.988,2.988
                C32.796,55.058,31.458,56.395,29.808,56.395z M44.716,47.199H14.901V8.229h29.815V47.199z"
              // fill="var(--muted)" // lighter color
              className="transition-colors duration-300"
            />

            {/* Screen area (inner rectangle) */}
            <rect
              x="14.901"
              y="8.229"
              width="29.815"
              height="38.97"
              fill="var(--background)"
              className="transition-colors duration-300"
            />

            {/* Battery container */}
            <rect
              x="17"
              y="12"
              width="25.6"
              height="32"
              fill="var(--muted-foreground)"
              rx="2"
              className="transition-colors duration-300"
            />

            {/* Battery fill */}
            <rect
              x="18"
              y={43 - (batteryLevel / 100) * 30}
              width="23.6"
              height={(batteryLevel / 100) * 30}
              fill={getBatteryColor(batteryLevel)}
              rx="1"
              className="transition-all duration-500 ease-out"
            />

            {/* Battery percentage text */}
            <text
              x="29.8"
              y="30"
              textAnchor="middle"
              fontSize="6"
              fill="white"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontWeight="bold"
              className="transition-colors duration-300"
            >
              {batteryLevel}%
            </text>
          </svg>
        </div>
      </div>

      {/* Expected Battery Level Display */}
      <div className="text-center space-y-2">
        <div className="text-xs font-medium text-muted-foreground">Expected: {expectedBatteryLevel}</div>
      </div>

      {/* Controls */}
      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="battery-slider" className="block text-sm font-medium text-muted-foreground">
            Adjust Battery Level
          </label>
          <div className="relative">
            <input
              id="battery-slider"
              type="range"
              min="0"
              max="100"
              step="5"
              value={batteryLevel}
              onChange={(e) => onBatteryLevelSet(Number(e.target.value))}
              className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              style={{
                background: `linear-gradient(to right, ${getBatteryColor(batteryLevel)} 0%, ${getBatteryColor(batteryLevel)} ${batteryLevel}%, var(--muted) ${batteryLevel}%, var(--muted) 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expected Battery Level Reached Notification */}
      <div
        className={cn(
          "mt-4 p-2 bg-green-100 text-green-800 rounded-md text-sm transition-opacity duration-300 text-center",
          expectedBatteryLevelReached ? "opacity-100" : "opacity-0"
        )}
      >
        Expected battery level of {displayValue}% reached!
      </div>
    </div>
  );
};

export default BatteryIndicator;
