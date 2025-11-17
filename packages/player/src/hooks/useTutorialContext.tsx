import { useContext } from "react";

import { TutorialContext } from "@/context/TutorialContext";

export const useTutorialContext = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error("useTutorialContext must be used within a TutorialProvider");
  }

  return context;
};
