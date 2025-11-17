import React, { useState } from "react";

interface CounterProps {
  expectedNumber: number;
  onNumberSet?: (next: number) => void;
}

const Counter = ({ expectedNumber, onNumberSet }: CounterProps) => {
  const [value, setValue] = useState(0);

  const handleClick = () => {
    const next = value + 1;
    setValue(next);
    if (onNumberSet) {
      onNumberSet(next);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <p>Button has been clicked {value} times</p>
      <p>Expected number: {expectedNumber}</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
};

export default Counter;
