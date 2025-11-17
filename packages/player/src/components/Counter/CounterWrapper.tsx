import React, { useEffect, useState } from "react";
import { counterApi } from "./events";
import Counter from "./Counter";

export default function CounterWrapper() {
  const [expectedNumber, setExpectedNumber] = useState(0);
  const [counterKey, setCounterKey] = useState(0);

  useEffect(() => {
    const offReset = counterApi.onCmdReset(() => {
      setCounterKey((key) => key + 1);
    });
    const offSet = counterApi.onCmdSetExpectedNumber(({ number }) => {
      setExpectedNumber(number);
    });

    return () => {
      offReset();
      offSet();
    };
  }, []);

  const handleNumberSet = (next: number) => {
    counterApi.emitRsNumberSet({ number: next });
  };

  return <Counter key={counterKey} expectedNumber={expectedNumber} onNumberSet={handleNumberSet} />;
}
