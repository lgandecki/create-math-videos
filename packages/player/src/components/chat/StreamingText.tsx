import React, { useEffect, useState } from "react";

interface StreamingTextProps {
  content: string;
  speed?: number;
  finished?: boolean;
  onFinished?: () => void;
  showCursor?: boolean;
}

export const StreamingText: React.FC<StreamingTextProps> = ({
  content,
  speed = 5,
  finished = false,
  onFinished,
  showCursor = true,
}) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // If animation should be complete immediately or content is empty
    if (finished || content === "") {
      setDisplayedContent(content);
      setCurrentIndex(content.length);
      setIsComplete(true);
      onFinished?.();
      return;
    }

    // Reset when content changes completely
    if (currentIndex === 0) {
      setDisplayedContent("");
    }

    // Skip animation if we're already at the end
    if (currentIndex >= content.length) {
      return;
    }

    // Add one character at a time
    const timer = setTimeout(() => {
      setDisplayedContent((prev) => prev + content[currentIndex]);
      setCurrentIndex((prevIndex) => prevIndex + 1);

      // Check if animation is complete
      if (currentIndex === content.length - 1) {
        setIsComplete(true);
        onFinished?.();
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [content, currentIndex, speed, finished, onFinished]);

  return (
    <>
      {displayedContent}
      {showCursor && !isComplete && <span className="text-cursor"></span>}
    </>
  );
};
