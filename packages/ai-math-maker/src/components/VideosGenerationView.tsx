import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatInterface } from "./ChatInterface";
import { Progress } from "@/components/ui/progress";

interface VideosGenerationViewProps {
  isGeneratingVideos: boolean;
  thoughts?: string;
  completedVideos?: number;
  totalVideos?: number;
}

const thinkingPhrases = [
  "Analyzing your request...",
  "Planning the script structure...",
  "Identifying key learning objectives...",
  "Crafting engaging content...",
  "Optimizing for clarity...",
];

export function VideosGenerationView({
  isGeneratingVideos,
  thoughts,
  completedVideos = 0,
  totalVideos = 0,
}: VideosGenerationViewProps) {
  const [currentThinking, setCurrentThinking] = useState(0);

  useEffect(() => {
    if (!isGeneratingVideos) return;

    const interval = setInterval(() => {
      setCurrentThinking((prev) => (prev + 1) % thinkingPhrases.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isGeneratingVideos]);

  return (
    <div className="h-screen bg-background flex">
      {/* Script Area */}
      <div className="container mx-auto px-6 w-full flex flex-col flex-1 space-y-4">
        <div className="flex-1 flex flex-col p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Video Generation
            </h2>
          </div>

          <div className="flex-1 relative">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
                {/* Progress section with fixed layout */}
                <div className="flex flex-col items-center space-y-3">
                  <div className="animate-pulse text-lg text-muted-foreground">
                    Generating videos...
                    {totalVideos > 0 && ` ${completedVideos}/${totalVideos}`}
                  </div>
                  <div className="w-full max-w-md">
                    {totalVideos > 0 ? (
                      <Progress
                        value={(completedVideos / totalVideos) * 100}
                        className="h-2"
                      />
                    ) : (
                      <div className="h-2" />
                    )}
                  </div>
                </div>

                {/* Thoughts section with fixed dimensions */}
                <div className="w-full max-w-2xl h-[300px] flex items-start justify-center">
                  <div className="w-full px-4">
                    {thoughts ? (
                      <div className="text-sm text-muted-foreground whitespace-pre-wrap text-left animate-pulse overflow-y-auto max-h-[300px]">
                        {thoughts}
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="animate-pulse text-sm text-muted-foreground">
                          {thinkingPhrases[currentThinking]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
