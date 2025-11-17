import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { GenerationState } from "@/types";

interface GenerationProgressProps {
  generationState: GenerationState;
}

export function GenerationProgress({
  generationState,
}: GenerationProgressProps) {
  const [fakeProgress, setFakeProgress] = useState(0);

  useEffect(() => {
    if (!generationState.isGenerating) {
      setFakeProgress(0);
      return;
    }

    let interval: number;

    interval = setInterval(() => {
      setFakeProgress((prev) => {
        if (prev < 90) {
          // z 0 do 90 przez 5 min = 300s / 90 kroków = co 3333ms
          return prev + 1;
        } else if (prev < 100) {
          // każdy procent powyżej 90 trwa minutę
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, fakeProgress < 90 ? 3333 : 60000); // 3.3s lub 60s

    return () => clearInterval(interval);
  }, [generationState.isGenerating, fakeProgress]);

  if (!generationState.isGenerating) return null;

  const getStageText = () => {
    switch (generationState.stage) {
      case "script":
        return "Generating script...";
      case "video":
        if (generationState.completedClips && generationState.totalClips) {
          return `Generating video: ${generationState.completedClips}/${generationState.totalClips} clips complete`;
        }
        return "Creating video clips...";
      case "complete":
        return "Complete!";
      default:
        return "Processing...";
    }
  };

  const progressValue = Math.min(fakeProgress, 100);

  return (
    <div className="fixed top-0 left-0 right-0 bg-card border-b border-border shadow-sm z-50 animate-slide-down">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium">{getStageText()}</div>
            {generationState.isPaused && (
              <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                Paused
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-48">
              {/*<Progress value={generationState.progress} />*/}
              <Progress value={progressValue} />
            </div>
            <div className="text-xs text-muted-foreground min-w-[3rem]">
              {progressValue}%
              {/*{generationState.progress}%*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
