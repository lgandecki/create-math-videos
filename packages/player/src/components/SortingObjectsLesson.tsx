import React, { useState, useEffect } from "react";
import { ManualSorter } from "./ManualSorter/ManualSorter";

interface SorterConfig {
  items: Record<string, string>;
}

export const SortingObjectsLesson: React.FC = () => {
  const [sorterConfig, setSorterConfig] = useState<SorterConfig | null>(null);
  const [showSorter, setShowSorter] = useState(false);

  console.log("sorterConfig", sorterConfig);
  console.log("showSorter", showSorter);
  useEffect(() => {
    const handleCreateManualSorter = (event: CustomEvent<SorterConfig>) => {
      setSorterConfig(event.detail);
      setShowSorter(true);
    };

    const handleHideManualSorter = () => {
      setShowSorter(false);
      setSorterConfig(null);
    };

    window.addEventListener("createManualSorter", handleCreateManualSorter as EventListener);
    window.addEventListener("hideManualSorter", handleHideManualSorter);

    return () => {
      window.removeEventListener("createManualSorter", handleCreateManualSorter as EventListener);
      window.removeEventListener("hideManualSorter", handleHideManualSorter);
    };
  }, []);

  const handleSorterComplete = (isCorrect: boolean, order: string[]) => {
    window.dispatchEvent(
      new CustomEvent("manualSorterComplete", {
        detail: { isCorrect, order },
      })
    );
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      {showSorter && sorterConfig ? (
        <ManualSorter items={sorterConfig.items} onComplete={handleSorterComplete} />
      ) : (
        <div className="text-center text-gray-600">
          <p className="text-2xl mb-4">Lesson 6: Sorting Objects</p>
          <p>Follow the tutorial instructions to begin the sorting exercise.</p>
        </div>
      )}
    </div>
  );
};
