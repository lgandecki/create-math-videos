import React, { useEffect, useState } from "react";

import { LlmMarkdown } from "./LlmMarkdown";
import { StreamingText } from "./StreamingText";
import { useTutorialContext } from "@/hooks/useTutorialContext";

interface StreamingMarkdownProps {
  content: string;
}

export const StreamingMarkdown: React.FC<StreamingMarkdownProps> = ({ content }) => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const { setIsStreamingComplete } = useTutorialContext();

  useEffect(() => {
    setIsStreamingComplete(false);
  }, []);

  const handleOnFinished = () => {
    setIsAnimationComplete(true);
    setIsStreamingComplete(true);
  };

  return isAnimationComplete ? (
    <LlmMarkdown content={content} />
  ) : (
    <div className="whitespace-pre-wrap">
      <StreamingText content={content} onFinished={handleOnFinished} />
    </div>
  );
};
