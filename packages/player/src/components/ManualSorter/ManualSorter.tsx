import React, { useState, useRef } from "react";
import { motion, Reorder } from "motion/react";

interface SorterItem {
  id: string;
  label: string;
  value: number;
}

interface ManualSorterProps {
  items: Record<string, string>;
  onComplete?: (isCorrect: boolean, order: string[]) => void;
}

export const ManualSorter: React.FC<ManualSorterProps> = ({ items, onComplete }) => {
  const parseValue = (val: string): number => {
    return parseFloat(val);
  };

  const initialItems: SorterItem[] = Object.entries(items).map(([label, value]) => ({
    id: label.toLowerCase().replace(/\s+/g, "-"),
    label,
    value: parseValue(value),
  }));

  const [sortedItems, setSortedItems] = useState<SorterItem[]>(initialItems);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const checkOrder = () => {
    const currentOrder = sortedItems.map((item) => item.value);
    const correctOrder = [...currentOrder].sort((a, b) => a - b);
    const correct = currentOrder.every((val, idx) => val === correctOrder[idx]);

    setIsCorrect(correct);
    setHasChecked(true);

    if (onComplete) {
      onComplete(
        correct,
        sortedItems.map((item) => item.label)
      );
    }
  };

  const resetOrder = () => {
    setSortedItems(initialItems);
    setHasChecked(false);
    setIsCorrect(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Arrange by Weight (Lightest to Heaviest)</h3>
        <p className="text-gray-600 text-sm">
          Drag and drop the items to arrange them from lightest on the left to heaviest on the right.
        </p>
      </div>

      <Reorder.Group
        axis="x"
        values={sortedItems}
        onReorder={setSortedItems}
        className="flex flex-wrap gap-4 justify-center mb-6"
      >
        {sortedItems.map((item) => (
          <Reorder.Item key={item.id} value={item} className="relative">
            <motion.div
              className={`
                px-4 py-3 bg-blue-100 rounded-lg cursor-grab active:cursor-grabbing
                shadow-md hover:shadow-lg transition-shadow
                select-none min-w-[120px] text-center
                ${hasChecked && isCorrect !== null ? (isCorrect ? "bg-green-100" : "bg-red-100") : ""}
              `}
              whileDrag={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="font-medium text-gray-800">{item.label}</div>
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <div className="flex gap-4 justify-center">
        <button
          onClick={checkOrder}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Check Order
        </button>
        <button
          onClick={resetOrder}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
      </div>

      {hasChecked && (
        <div className={`mt-4 p-4 rounded-lg text-center ${isCorrect ? "bg-green-50" : "bg-red-50"}`}>
          {isCorrect ? (
            <p className="text-green-700 font-semibold">✓ Correct! You've arranged them from lightest to heaviest.</p>
          ) : (
            <p className="text-red-700 font-semibold">✗ Not quite right. Try again!</p>
          )}
        </div>
      )}
    </div>
  );
};
