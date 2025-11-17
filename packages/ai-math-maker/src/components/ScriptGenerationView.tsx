import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatInterface } from "./ChatInterface";
import { Progress } from "@/components/ui/progress";

interface ScriptGenerationViewProps {
  script: string;
  isGeneratingScript: boolean;
  thoughts?: string;
  initialPrompt?: string;
  onScriptChange: (script: string) => void;
  onContinueToVideo: () => void;
}

const thinkingPhrases = [
  "Analyzing your request...",
  "Planning the script structure...",
  "Identifying key learning objectives...",
  "Crafting engaging content...",
  "Optimizing for clarity...",
];

export function ScriptGenerationView({
  script,
  isGeneratingScript,
  thoughts,
  initialPrompt,
  onScriptChange,
  onContinueToVideo,
}: ScriptGenerationViewProps) {
  const [currentThinking, setCurrentThinking] = useState(0);
  const [hasScriptEdits, setHasScriptEdits] = useState(false);

  useEffect(() => {
    if (!isGeneratingScript) return;

    const interval = setInterval(() => {
      setCurrentThinking((prev) => (prev + 1) % thinkingPhrases.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isGeneratingScript]);

  const handleScriptEdit = (newScript: string) => {
    onScriptChange(newScript);
    setHasScriptEdits(true);
  };

  return (
    <div className="h-screen bg-background flex">
      {/* Script Area */}
      <div className="container mx-auto px-6 w-full flex flex-col flex-1 space-y-4">
      <div className="flex-1 flex flex-col p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Script Generation
          </h2>
          <p className="text-muted-foreground">
            Review and edit the generated script before creating your video
          </p>
        </div>

        <div className="flex-1 relative">
          {isGeneratingScript ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4 max-w-2xl mx-auto p-6">
                <div className="animate-pulse text-lg text-muted-foreground">
                  Generating script...
                </div>
                <div className="flex flex-col items-center justify-start min-h-[200px] max-h-[400px] overflow-auto px-4 w-full">
                  {thoughts ? (
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap text-left animate-pulse max-h-[400px] overflow-y-auto w-full">
                      {thoughts}
                    </div>
                  ) : (
                    <span className="animate-pulse text-sm text-muted-foreground text-center">
                      {thinkingPhrases[currentThinking]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in flex flex-col h-full">
              <Textarea
                value={script}
                onChange={(e) => handleScriptEdit(e.target.value)}
                placeholder="Your generated script will appear here..."
                className="flex-1 resize-none w-full"
              />

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {hasScriptEdits && "⚠️ Script has been modified"}
                </div>

                <div className="flex gap-2">
                  {hasScriptEdits && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        onScriptChange(script);
                        setHasScriptEdits(false);
                      }}
                    >
                      Discard Changes
                    </Button>
                  )}
                  <Button onClick={onContinueToVideo}>Generate Video</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Interface */}
      {/*<div className="w-80 border-l border-border">*/}
      {/*  <ChatInterface*/}
      {/*    selectedClipId={null}*/}
      {/*    selectedClipName={undefined}*/}
      {/*    isGeneratingScript={isGeneratingScript}*/}
      {/*    currentThinking={thoughts || thinkingPhrases[currentThinking]}*/}
      {/*    initialPrompt={initialPrompt}*/}
      {/*  />*/}
      {/*</div>*/}
      </div>
    </div>
  );
}
