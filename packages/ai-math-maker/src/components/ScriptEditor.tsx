import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VideoClip } from "@/types";

interface ScriptEditorProps {
  clip: VideoClip | null;
  onScriptUpdate: (clipId: string, script: string) => void;
  onInterrupt?: () => void;
  onRegenerateVideo?: (clipId: string, newScript: string) => void;
}

export function ScriptEditor({
  clip,
  onScriptUpdate,
  onInterrupt,
  onRegenerateVideo,
}: ScriptEditorProps) {
  const [script, setScript] = useState("");
  const [originalScript, setOriginalScript] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (clip) {
      const clipScript = clip.script || "";
      setScript(clipScript);
      setOriginalScript(clipScript);
      setHasChanges(false);
    }
  }, [clip]);

  const handleScriptChange = (value: string) => {
    setScript(value);
    setHasChanges(value !== originalScript);
    if (onInterrupt && value !== originalScript) {
      onInterrupt();
    }
  };

  const handleSave = () => {
    if (clip && hasChanges) {
      onScriptUpdate(clip.id, script);
      setOriginalScript(script);
      setHasChanges(false);
    }
  };

  const handleSaveAndRegenerate = () => {
    if (clip && hasChanges) {
      onScriptUpdate(clip.id, script);
      setOriginalScript(script);
      setHasChanges(false);

      // Trigger video regeneration
      if (onRegenerateVideo) {
        onRegenerateVideo(clip.id, script);
      }
    }
  };

  const handleDiscard = () => {
    setScript(originalScript);
    setHasChanges(false);
  };

  if (!clip) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a video clip to view its script
      </div>
    );
  }

  const isGenerating = clip.isGenerating || false;
  const isDisabled = isGenerating || clip.isRegenerating;

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="flex items-center justify-between p-4 pb-2">
        <h3 className="text-lg font-semibold">Script - {clip.name}</h3>
        <div className="text-sm text-muted-foreground">
          Duration: {Math.floor(clip.duration / 60)}:
          {(clip.duration % 60).toFixed(0).padStart(2, "0")}
        </div>
      </div>

      <div className="flex-1 p-4 pt-2">
        <Textarea
          value={script}
          onChange={(e) => handleScriptChange(e.target.value)}
          placeholder={
            isGenerating
              ? "Video is being generated..."
              : "Enter the script for this video clip..."
          }
          className="h-full resize-none"
          disabled={isDisabled}
        />
      </div>

      <div className="p-4 pt-2 border-t border-border">
        {isGenerating && (
          <div className="text-sm text-muted-foreground mb-2">
            This clip is currently being generated. Script editing will be
            available once generation is complete.
          </div>
        )}
        <div className="flex gap-2 justify-end">
          {hasChanges && (
            <>
              <Button
                onClick={handleDiscard}
                variant="outline"
                size="sm"
                className="transition-opacity"
              >
                Discard Changes
              </Button>
              <Button
                onClick={handleSave}
                variant="outline"
                size="sm"
                className="transition-opacity"
              >
                Save Only
              </Button>
            </>
          )}
          <Button
            onClick={handleSaveAndRegenerate}
            variant="default"
            size="sm"
            disabled={!hasChanges || !clip?.sessionId || clip?.isRegenerating}
            className="transition-opacity"
          >
            {clip?.isRegenerating ? "Regenerating..." : "Save and Regenerate"}
          </Button>
        </div>
      </div>
    </div>
  );
}
