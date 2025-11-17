import React, { useEffect, useState } from "react";

interface LoadingDotsProps {
  className?: string;
  text?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({ className, text = "" }) => {
  const [dots, setDots] = useState<number>(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots % 3) + 1);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className={className}>
      {text}
      {".".repeat(dots)}
    </span>
  );
};
