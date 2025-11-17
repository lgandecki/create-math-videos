import React, { useEffect, useState } from "react";
import { manualSorterApi } from "./events";
import { ManualSorter } from "./ManualSorter";

export default function ManualSorterWrapper() {
  const [items, setItems] = useState<Record<string, string>>({});
  const [sorterKey, setSorterKey] = useState(0);

  useEffect(() => {
    const offReset = manualSorterApi.onCmdReset(() => {
      setSorterKey((key) => key + 1);
    });
    const offSetItems = manualSorterApi.onCmdSetItems(({ items }) => {
      setItems(items);
    });

    return () => {
      offReset();
      offSetItems();
    };
  }, []);

  const handleComplete = (isCorrect: boolean, order: string[]) => {
    manualSorterApi.emitRsCompleted({ isCorrect, order });
  };

  return <ManualSorter key={sorterKey} items={items} onComplete={handleComplete} />;
}
