import React, { createContext, useState, useCallback, ReactNode, useEffect, useMemo } from "react";
import type { DotLottie } from "@lottiefiles/dotlottie-react";

interface RobotAnimationContextType {
  // Animation instance
  dotLottie: DotLottie | null;
  setDotLottie: (instance: DotLottie | null) => void;

  // Animation state
  isPlaying: boolean;
  isLoaded: boolean;

  // Control methods
  play: () => void;
  pause: () => void;
  stop: () => void;
  playLoop: () => void;
}

export const RobotAnimationContext = createContext<RobotAnimationContextType | undefined>(undefined);

interface RobotAnimationProviderProps {
  children: ReactNode;
}

export const RobotAnimationProvider: React.FC<RobotAnimationProviderProps> = ({ children }) => {
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log("🤖 RobotAnimationProvider: dotLottie instance updated", { dotLottie, hasInstance: !!dotLottie });

    if (dotLottie) {
      setIsLoaded(true);
    }
  }, [dotLottie]);

  const play = useCallback(() => {
    if (!dotLottie) return;

    try {
      dotLottie.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("🤖 RobotAnimationProvider: Error in play()", error);
    }
  }, [dotLottie]);

  const pause = useCallback(() => {
    if (!dotLottie) return;

    try {
      dotLottie.pause();
      dotLottie.setLoop(false);
      setIsPlaying(false);
    } catch (error) {
      console.error("🤖 RobotAnimationProvider: Error in pause()", error);
    }
  }, [dotLottie]);

  const stop = useCallback(() => {
    if (!dotLottie) return;

    try {
      dotLottie.stop();
      dotLottie.setLoop(false);
      setIsPlaying(false);
    } catch (error) {
      console.error("🤖 RobotAnimationProvider: Error in stop()", error);
    }
  }, [dotLottie]);

  const playLoop = useCallback(() => {
    if (!dotLottie) return;

    try {
      dotLottie.setLoop(true);
      dotLottie.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("🤖 RobotAnimationProvider: Error in playLoop()", error);
    }
  }, [dotLottie]);

  const value = useMemo(
    () => ({
      dotLottie,
      setDotLottie,
      isPlaying,
      isLoaded,
      play,
      playLoop,
      pause,
      stop,
    }),
    [dotLottie, isPlaying, isLoaded, play, playLoop, pause, stop]
  );

  return <RobotAnimationContext.Provider value={value}>{children}</RobotAnimationContext.Provider>;
};
