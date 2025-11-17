import React, { useEffect, useState } from "react";

import { StreamingText } from "./StreamingText";

interface ChatLoadingIndicatorProps {
  text?: string;
}

export const ChatLoadingIndicator: React.FC<ChatLoadingIndicatorProps> = ({ text = "AI is typing" }) => {
  const [dots, setDots] = useState<number>(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots % 3) + 1);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-4">
      <div className="text-slate-300 italic flex items-center gap-1">
        <StreamingText content={text} />
        <span className="inline-block w-4 text-emerald-500">{".".repeat(dots)}</span>
      </div>
    </div>
  );
};
