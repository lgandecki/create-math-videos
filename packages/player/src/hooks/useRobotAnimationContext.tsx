import { useContext } from "react";

import { RobotAnimationContext } from "@/context/RobotAnimationContext";

export const useRobotAnimationContext = () => {
  const context = useContext(RobotAnimationContext);
  if (!context) {
    throw new Error("useRobotAnimationContext must be used within a RobotAnimationContext");
  }

  return context;
};
