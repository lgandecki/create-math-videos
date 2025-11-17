import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import { TutorialProvider } from "./context/TutorialContext";
import { ChatInterface } from "./components/chat/ChatInterface";
import { ToolBridge } from "./components/ToolBridge";
import { coreApi } from "@/components/bridges/CoreBridge.tsx";
import { PhaserGame } from "@/components/PhaserGame.tsx";
import SlideRuleCalculator from "./components/SlideRuleCalculator";
import { Lesson, useLessonsStore } from "@/stores/lessonsStore.ts";
import { useSlideRuleStore } from "./stores/slideRuleStore";
import { useDinoStore } from "@/stores/dinoStore.ts";

const LessonBackground = ({ currentLesson, showPirates }: { currentLesson: Lesson; showPirates: boolean }) => {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    const fetchBackground = async () => {
      if (currentLesson !== Lesson.PIRATES && !showPirates) {
        try {
          const response = await fetch(`/api/v1/lesson-background?fileName=${currentLesson}`);
          if (!response.ok) {
            console.error("Failed to fetch lesson background");
            setBackgroundImageUrl(null);
            return;
          }
          const blob = await response.blob();
          objectUrl = URL.createObjectURL(blob);
          setBackgroundImageUrl(objectUrl);
        } catch (error) {
          console.error("Error fetching background:", error);
          setBackgroundImageUrl(null);
        }
      } else {
        setBackgroundImageUrl(null);
      }
    };

    fetchBackground();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [currentLesson, showPirates]);

  if (!backgroundImageUrl) return null;

  return (
    <div
      className="absolute inset-0 z-10 bg-cover bg-center animate-zoom-in-out"
      style={{
        backgroundImage: `url("${backgroundImageUrl}")`,
      }}
    />
  );
};

const GameEngine = ({ showPirates }: { showPirates: boolean }) => {
  const showDino = useDinoStore((state) => state.showDino);

  if (!showDino && !showPirates) return null;

  return (
    <div className="absolute inset-0 z-20">
      <PhaserGame dino={showDino} pirates={showPirates} backgroundOnly={false} />
    </div>
  );
};

const CenteredChat = ({ showPirates }: { showPirates: boolean }) => {
  const showSlideRule = useSlideRuleStore((state) => state.showSlideRule);

  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      <motion.div
        className="h-full w-full relative pointer-events-auto"
        layout
        initial={false}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <motion.div
          className={`h-full w-full ${
            showSlideRule
              ? "flex justify-center items-start"
              : "lg:px-0 lg:grid lg:grid-cols-[1fr_minmax(800px,1fr)_1fr]"
          }`}
          layout
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.div
            className={`${
              showSlideRule ? "grid grid-cols-2 gap-4 px-4 w-full max-w-[1440px] h-full" : "lg:col-start-2 w-full"
            }`}
            layout
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <motion.div
              className={`${showSlideRule ? "col-span-1" : ""} flex flex-col`}
              layout
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {!showPirates && <ChatInterface />}
            </motion.div>
            <AnimatePresence mode="popLayout">
              {showSlideRule && (
                <motion.div
                  className="col-span-1 flex flex-col items-center pb-6"
                  initial={{ opacity: 0, x: 100, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 100, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  layout
                >
                  <SlideRuleCalculator />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export const App = () => {
  const { setCurrentLesson, currentLesson } = useLessonsStore();

  useEffect(() => {
    const unsubscribe = coreApi.onRsLessonChanged((lesson) => {
      setCurrentLesson(lesson as Lesson);
    });

    return () => unsubscribe();
  }, [setCurrentLesson]);

  const showPirates = currentLesson === Lesson.PIRATES;

  return (
    <TutorialProvider>
      <div className="relative h-screen w-screen overflow-hidden bg-slate-800">
        <ToolBridge />
        <LessonBackground currentLesson={currentLesson} showPirates={showPirates} />
        <GameEngine showPirates={showPirates} />
        <CenteredChat showPirates={showPirates} />
      </div>
    </TutorialProvider>
  );
};
