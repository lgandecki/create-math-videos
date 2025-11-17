import React from "react";
import { useSlideRuleStore } from "@/stores/slideRuleStore";

const DinoProgressBar: React.FC = () => {
  const { userValueA } = useSlideRuleStore();

  // Calculate leg strength (square relationship)
  const legStrength = Math.pow(userValueA, 2);

  // Calculate mass (cube relationship)
  const mass = Math.pow(userValueA, 3);

  // Calculate percentages for progress bars using the same max value
  const maxScale = 10;
  const maxValue = Math.pow(maxScale, 3); // Use cube (mass) as the common maximum
  const legStrengthPercentage = Math.min((legStrength / maxValue) * 100, 100);
  const massPercentage = Math.min((mass / maxValue) * 100, 100);

  // Calculate stability
  const isStable = legStrength >= mass * 0.8;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg w-80 text-slate-800">
      <h3 className="text-lg font-semibold mb-4 text-center text-slate-800">Dinosaur Scaling</h3>

      <div className="space-y-4">
        {/* Dino Scale Display */}
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">Scale: {userValueA.toFixed(1)}x</div>
        </div>

        {/* Leg Strength Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700">Leg Strength</span>
            <span className="text-sm text-slate-600">{legStrength.toFixed(1)}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${legStrengthPercentage}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 mt-1">Square relationship (scale²)</div>
        </div>

        {/* Mass Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700">Mass</span>
            <span className="text-sm text-slate-600">{mass.toFixed(1)}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className="bg-red-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${massPercentage}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 mt-1">Cube relationship (scale³)</div>
        </div>

        {/* Stability Indicator */}
        <div className="pt-2 border-t border-slate-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-700">Stability</span>
            <span className={`text-sm font-semibold ${isStable ? "text-green-600" : "text-red-600"}`}>
              {isStable ? "✓ Stable" : "⚠ Unstable"}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {isStable ? "Legs can support the dinosaur's weight" : "Mass is growing faster than leg strength"}
          </div>
        </div>

        {/* Educational Note */}
        <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg">
          <p className="font-medium mb-1">Square-Cube Law:</p>
          <p>
            As size increases, leg strength grows by scale² but mass grows by scale³, making large dinosaurs
            structurally unstable.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DinoProgressBar;
