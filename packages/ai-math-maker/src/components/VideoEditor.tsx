import { useState, useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";
import { VideoPlayer } from "./VideoPlayer";
import { VideoTimeline } from "./VideoTimeline";
import { ChatInterface } from "./ChatInterface";
import { ScriptEditor } from "./ScriptEditor";
import { LayoutControls } from "./LayoutControls";
import { OnboardingChat } from "./OnboardingChat";
import { GenerationProgress } from "./GenerationProgress";
import { ScriptGenerationView } from "./ScriptGenerationView";
import { VideoClip, LayoutMode, GenerationState, AppState } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useTRPCSubscription } from "@/hooks/useTRPCSubscription";
import { useMultiVideoSocket } from "@/hooks/useMultiVideoSocket";
import { VideosGenerationView } from "./VideosGenerationView";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

const TIMEOUTS = 5;
export function VideoEditor() {
  const { toast } = useToast();
  const sessionId = useRef(uuid()).current;

  // App state management
  const [appState, setAppState] = useState<AppState>("onboarding");
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    progress: 0,
    stage: "script",
  });

  // Script state
  const [generatedScript, setGeneratedScript] = useState("");
  const [initialPrompt, setInitialPrompt] = useState("");

  // Video state
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [regeneratingClipId, setRegeneratingClipId] = useState<string | null>(
    null,
  );
  const regenerationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Layout state
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("split");

  // Insert after line 18, after sessionId
  const [isModifyingClip, setIsModifyingClip] = useState<string | null>(null);
  const [currentVideoThinking, setCurrentVideoThinking] = useState("");

  // Download state
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const combineVideosMutation = useMutation({
    ...trpc.videoOperations.combineVideos.mutationOptions(),
    onSuccess: (data) => {
      console.log("combineVideosMutation success", data);
    },
    onError: (error) => {
      console.error("combineVideosMutation error", error);
    },
  });

  // Load clip metadata (duration only) when clips are added
  const loadClipMetadata = async (initialClips: VideoClip[]) => {
    console.log("=== loadClipMetadata called with clips:", initialClips);

    const loadedClips = await Promise.all(
      initialClips.map(async (clip) => {
        console.log(`Loading metadata for clip ${clip.id}:`, clip.src);

        // Skip loading if it's a placeholder
        if (clip.src === "/placeholder.svg") {
          console.log(`Skipping placeholder clip ${clip.id}`);
          return clip;
        }

        const video = document.createElement("video");
        video.src = clip.src;
        video.preload = "metadata";

        try {
          console.log(`Waiting for metadata to load for ${clip.src}...`);

          // Wait for metadata to load (gets duration)
          await new Promise((resolve, reject) => {
            video.onloadedmetadata = () => {
              console.log(
                `Video ${clip.src}: metadata loaded, duration:`,
                video.duration,
              );
              resolve(undefined);
            };
            video.onerror = (event) => {
              console.error(`Video ${clip.src}: ERROR event:`, event);
              console.error("Video error:", video.error);
              reject(event);
            };
          });

          const duration = video.duration;
          console.log(`Video ${clip.src} duration:`, duration);

          // Use server-provided thumbnail or placeholder
          const thumbnail = clip.thumbnail || "/placeholder.svg";

          console.log(`Successfully loaded clip ${clip.id}:`, {
            duration,
            thumbnail: thumbnail.substring(0, 50) + "...",
          });
          return { ...clip, duration, thumbnail };
        } catch (error) {
          console.error("Error loading clip metadata:", error);
          // Return clip with default duration but still add it
          return { ...clip, duration: clip.duration || 0 };
        } finally {
          // Clean up video element
          // video.pause();
          // video.src = "";
          // video.remove();
        }
      }),
    );

    console.log("=== All clips loaded:", loadedClips);
    return loadedClips;
  };

  // Calculate total duration when clips change
  useEffect(() => {
    const duration = clips.reduce((acc, clip) => acc + clip.duration, 0);
    setTotalDuration(duration);
  }, [clips]);

  const handleClipSelect = (clipId: string) => {
    setSelectedClipId(clipId);

    // Calculate the start time of the selected clip
    const clipIndex = clips.findIndex((clip) => clip.id === clipId);
    if (clipIndex !== -1) {
      let startTime = 0;
      for (let i = 0; i < clipIndex; i++) {
        startTime += clips[i].duration;
      }

      // Update the current time to the start of the selected clip
      setCurrentTime(startTime);

      // Pause the video when selecting a new clip
      setIsPlaying(false);
    }
  };

  const handleClipRemove = (clipId: string) => {
    setClips((prev) => prev.filter((clip) => clip.id !== clipId));
    if (selectedClipId === clipId) {
      setSelectedClipId(null);
    }
  };

  const handleClipReorder = (fromIndex: number, toIndex: number) => {
    const newClips = [...clips];
    const [movedClip] = newClips.splice(fromIndex, 1);
    newClips.splice(toIndex, 0, movedClip);
    setClips(newClips);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleLoadedMetadata = (duration: number) => {
    setTotalDuration(duration);
  };

  const getSelectedClip = () => {
    return clips.find((clip) => clip.id === selectedClipId) || null;
  };

  const getSelectedClipName = () => {
    return clips.find((clip) => clip.id === selectedClipId)?.name;
  };

  // Script generation state
  const [scriptThoughts, setScriptThoughts] = useState<string>("");
  const [scriptResponseType, setScriptResponseType] = useState<
    "answer" | "edit" | null
  >(null);

  // TRPC subscription for script generation
  const { sendAIEdit, cleanup } = useTRPCSubscription({
    onReasoning: (reasoning) => {
      console.log("Script generation thoughts:", reasoning);
      setScriptThoughts(reasoning);
    },
    onAnswerChunk: (chunk) => {
      console.log("Script chunk:", chunk);
      setGeneratedScript((prev) => prev + chunk);
    },
    onAnswerComplete: (fullAnswer) => {
      console.log("Script generation complete (answer):", fullAnswer);
      setGeneratedScript(fullAnswer);
      setGenerationState({
        isGenerating: false,
        progress: 100,
        stage: "script",
      });
    },
    onResponseComplete: (modifiedContent) => {
      console.log("Script generation complete (modified):", modifiedContent);
      setGeneratedScript(modifiedContent);
      setGenerationState({
        isGenerating: false,
        progress: 100,
        stage: "script",
      });
      if (isModifyingClip) {
        setClips((prev) =>
          prev.map((c) =>
            c.id === isModifyingClip ? { ...c, script: modifiedContent } : c,
          ),
        );
        handleRegenerateVideo(isModifyingClip, modifiedContent);
        setIsModifyingClip(null);
      }
    },
    onResponseType: (type) => {
      console.log("Response type:", type);
      setScriptResponseType(type);
    },
    onError: (error) => {
      console.error("Script generation error:", error);
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      setGenerationState({ isGenerating: false, progress: 0, stage: "script" });
      setAppState("onboarding");
    },
  });

  // Multi-video socket connection for creating videos from script sections
  const {
    createVideosFromScript,
    updateVideo,
    isConnected: isVideoSocketConnected,
    sections,
    activeRequests,
    totalSections,
  } = useMultiVideoSocket({
    onSectionVideoPath: (path, sectionIndex) => {
      console.log(`Video file path for section ${sectionIndex}:`, path);
    },
    onSectionProgress: (delta, sectionIndex) => {
      console.log(
        `Video creation progress for section ${sectionIndex}:`,
        delta,
      );
      try {
        if (delta.includes("base64")) {
          return;
        }
        const attemptedJson = JSON.parse(delta);
        const message =
          attemptedJson.message.content?.[0].content ||
          attemptedJson.message.content?.[0].text;
        if (typeof message === "string" && message) {
          if (!message.includes("Todos have been modified")) {
            setCurrentVideoThinking(message.slice(0, 1000));
          }
        }
      } catch (e) {
        console.error("Error parsing delta:", e);
      }
    },
    onSectionComplete: (sectionIndex, completedSection) => {
      console.log(`Video creation complete for section ${sectionIndex}`);

      if (!completedSection) {
        console.error(
          `Section ${sectionIndex} completed but section data not provided`,
        );
        return;
      }

      if (completedSection.error) {
        console.error(
          `Section ${sectionIndex} completed with error: ${completedSection.error}`,
        );

        // Handle regeneration error if applicable
        const clipToUpdate = clips.find((c) => c.sectionIndex === sectionIndex);
        if (clipToUpdate && clipToUpdate.id === regeneratingClipId) {
          setClips((prev) =>
            prev.map((c) =>
              c.id === clipToUpdate.id ? { ...c, isRegenerating: false } : c,
            ),
          );

          if (regenerationTimeoutRef.current) {
            clearTimeout(regenerationTimeoutRef.current);
            regenerationTimeoutRef.current = null;
          }

          setGenerationState({
            isGenerating: false,
            progress: 0,
            stage: "complete",
          });
          setRegeneratingClipId(null);
          toast({
            title: "Video Regeneration Failed",
            description: completedSection.error,
            variant: "destructive",
          });
        }
        return;
      }

      if (!completedSection.videoPath) {
        console.error(
          `Section ${sectionIndex} completed but has no video path. Section data:`,
          completedSection,
        );
        return;
      }

      // First update the clip with the new video path
      const clipToUpdate = clips.find((c) => c.sectionIndex === sectionIndex);
      if (!clipToUpdate) {
        console.error(`No clip found for section index ${sectionIndex}`);
        return;
      }

      const updatedClip: VideoClip = {
        ...clipToUpdate,
        src: completedSection.videoPath!,
        thumbnail: completedSection.thumbnailPath || "/placeholder.svg",
        sessionId: completedSection.sessionId,
        isGenerating: false, // Clear generating flag
        isRegenerating: false, // Clear regenerating flag
      };

      // Load metadata for the updated clip
      loadClipMetadata([updatedClip]).then((loadedClips) => {
        const loadedClip = loadedClips[0];
        setClips((prevClips) =>
          prevClips.map((c) =>
            c.sectionIndex === sectionIndex
              ? {
                  ...c,
                  src: completedSection.videoPath!,
                  thumbnail: loadedClip.thumbnail,
                  sessionId: completedSection.sessionId,
                  duration: loadedClip.duration,
                  isGenerating: false,
                  isRegenerating: false,
                }
              : c,
          ),
        );

        // Handle regeneration completion if applicable
        if (clipToUpdate && clipToUpdate.id === regeneratingClipId) {
          if (regenerationTimeoutRef.current) {
            clearTimeout(regenerationTimeoutRef.current);
            regenerationTimeoutRef.current = null;
          }

          setGenerationState({
            isGenerating: false,
            progress: 100,
            stage: "complete",
          });
          setRegeneratingClipId(null); // Clear the regenerating state
          toast({
            title: "Video Regenerated!",
            description: "Your video has been updated successfully.",
          });
        }
      });

      // Update progress when a section completes
      setGenerationState((prev) => {
        const completedClips = (prev.completedClips || 0) + 1;
        const progress = Math.round(
          (completedClips / (prev.totalClips || 1)) * 100,
        );
        return {
          ...prev,
          completedClips,
          progress,
        };
      });
    },
    onAllVideosComplete: (completedSections) => {
      console.log("All videos complete!", completedSections);
      if (regeneratingClipId) {
        console.log("Skipping all videos complete handler during regeneration");
        return;
      }

      // We're now in editor mode already, just need to finish the generation state
      setGenerationState({
        isGenerating: false,
        progress: 100,
        stage: "complete",
      });

      const successfulSections = completedSections.filter(
        (section) => section.videoPath && !section.error,
      );

      if (successfulSections.length === 0) {
        toast({
          title: "No Videos Generated",
          description:
            "Failed to generate any videos from the script sections.",
          variant: "destructive",
        });
        // Remove all placeholder clips since nothing was generated
        setClips([]);
        return;
      }

      toast({
        title: "Videos Generated!",
        description: `${successfulSections.length} videos have been created and are ready for editing.`,
      });
    },
    onError: (error, sectionIndex) => {
      console.error(
        `Video creation error${sectionIndex !== undefined ? ` for section ${sectionIndex}` : ""}:`,
        error,
      );
      toast({
        title: "Video Creation Error",
        description: `${sectionIndex !== undefined ? `Section ${sectionIndex}: ` : ""}${error}`,
        variant: "destructive",
      });
    },
  });

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (regenerationTimeoutRef.current) {
        clearTimeout(regenerationTimeoutRef.current);
        regenerationTimeoutRef.current = null;
      }
    };
  }, []);

  const handleGenerate = async (prompt: string) => {
    setInitialPrompt(prompt); // Store the initial prompt
    setGenerationState({ isGenerating: true, progress: 0, stage: "script" });
    setAppState("script-generation");
    setGeneratedScript(""); // Clear previous script
    setScriptThoughts(""); // Clear previous thoughts

    // Generate a script prompt that asks for a markdown format
    const scriptPrompt = `Create a detailed educational script for a math video about: ${prompt}
    
Please format the script as markdown with clear sections and timestamps. Include:
- Introduction
- Main concepts explanation
- Examples with step-by-step solutions
- Summary/conclusion

The script should be engaging, clear, and suitable for creating an educational video.`;

    // Send the script generation request
    sendAIEdit({
      sessionId,
      prompt: scriptPrompt,
      fileContent: "",
    });
  };

  const handleContinueToVideo = () => {
    if (!isVideoSocketConnected) {
      toast({
        title: "Connection Error",
        description: "Not connected to video server. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Check if script has sections
    const hasHeaders = generatedScript.includes("\n##");
    if (!hasHeaders) {
      toast({
        title: "No Sections Found",
        description:
          "Please ensure your script has sections marked with ## headers.",
        variant: "destructive",
      });
      return;
    }

    // Parse script sections to create placeholder clips
    // First split by ## to get only the actual sections (not the main title)
    const scriptParts = generatedScript.split(/\n(?=##\s)/);
    // Filter out the first part if it doesn't start with ## (it's the main title)
    const scriptSections = scriptParts.filter((section) =>
      section.trim().startsWith("##"),
    );

    const placeholderClips: VideoClip[] = scriptSections.map(
      (section, index) => {
        // Extract title from section
        const titleMatch = section.match(/^##\s+(.+)$/m);
        const title = titleMatch
          ? titleMatch[1].trim()
          : `Section ${index + 1}`;

        return {
          id: uuid(),
          name: title,
          src: "/placeholder.svg", // Placeholder source
          duration: 30, // Fake 30-second duration for equal sizing
          thumbnail: "/placeholder.svg",
          script: section,
          isGenerating: true, // New flag to indicate this is being generated
          sectionIndex: index,
          sectionTitle: title,
        };
      },
    );

    // Set clips immediately and transition to editor
    setClips(placeholderClips);
    setAppState("editor");
    if (placeholderClips.length > 0) {
      setSelectedClipId(placeholderClips[0].id);
    }

    // Start video generation in background
    createVideosFromScript(generatedScript);

    // Update generation state
    setGenerationState({
      isGenerating: true,
      progress: 0,
      stage: "video",
      completedClips: 0,
      totalClips: scriptSections.length,
    });
  };

  const handleInterrupt = () => {
    if (generationState.isGenerating && generationState.stage === "video") {
      setGenerationState((prev) => ({ ...prev, isPaused: true }));
      toast({
        title: "Generation paused",
        description:
          "Video generation paused due to edits. Use 'Generate' to restart.",
        duration: 5000,
      });
    }
  };

  const handleScriptUpdate = (clipId: string, script: string) => {
    setClips((prev) =>
      prev.map((clip) => (clip.id === clipId ? { ...clip, script } : clip)),
    );
  };

  const handleRegenerateVideo = (clipId: string, newScript: string) => {
    const clip = clips.find((c) => c.id === clipId);
    if (!clip || !clip.sessionId || clip.sectionIndex === undefined) {
      toast({
        title: "Cannot Regenerate",
        description: "Missing required information for video regeneration.",
        variant: "destructive",
      });
      return;
    }

    if (!isVideoSocketConnected) {
      toast({
        title: "Connection Error",
        description: "Not connected to video server. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Clear any existing regeneration timeout
    if (regenerationTimeoutRef.current) {
      clearTimeout(regenerationTimeoutRef.current);
      regenerationTimeoutRef.current = null;
    }

    // Track which clip is being regenerated
    setRegeneratingClipId(clipId);

    // Mark the clip as regenerating
    setClips((prev) =>
      prev.map((c) => (c.id === clipId ? { ...c, isRegenerating: true } : c)),
    );

    // Set generation state for video update
    setGenerationState({
      isGenerating: true,
      progress: 0,
      stage: "video",
      completedClips: 0,
      totalClips: 1,
    });

    // Update the video using the saved sessionId and new script
    updateVideo(
      clip.sectionIndex,
      newScript,
      clip.sessionId,
      clip.sectionTitle || clip.name,
    );

    // // Cleanup timeout - if regeneration takes too long, reset state
    // regenerationTimeoutRef.current = setTimeout(() => {
    //   setRegeneratingClipId((currentRegeneratingId) => {
    //     if (currentRegeneratingId === clipId) {
    //       setClips((prev) =>
    //         prev.map((c) =>
    //           c.id === clipId ? { ...c, isRegenerating: false } : c,
    //         ),
    //       );
    //       setGenerationState((prev) =>
    //         prev.isGenerating ? { ...prev, isGenerating: false } : prev,
    //       );
    //       regenerationTimeoutRef.current = null; // Clear the ref
    //       return null;
    //     }
    //     return currentRegeneratingId;
    //   });
    // }, 300000); // 5 minutes timeout
  };

  const handleRequestModify = (
    clipId: string,
    instruction: string,
    picturePath?: string,
  ) => {
    const clip = clips.find((c) => c.id === clipId);
    if (
      !clip ||
      clip.sectionIndex === undefined ||
      !clip.sessionId ||
      !clip.script
    ) {
      toast({
        title: "Error",
        description: "Invalid clip for modification",
        variant: "destructive",
      });
      return;
    }
    // setIsModifyingClip(clipId);
    setClips((prev) =>
      prev.map((c) => (c.id === clipId ? { ...c, isRegenerating: true } : c)),
    );
    updateVideo(
      clip.sectionIndex,
      picturePath
        ? instruction +
            `\n\n For context, take a look at the screenshot provided by the user: ${picturePath.replace("/uploads/", "")}`
        : instruction,
      clip.sessionId,
      clip.sectionTitle || clip.name,
    );
  };

  const handleDownloadAll = async () => {
    if (clips.length === 0) {
      toast({
        title: "No Videos",
        description: "There are no videos to download.",
        variant: "destructive",
      });
      return;
    }

    setIsDownloadingAll(true);

    try {
      // Get video paths in order
      const videoPaths = clips.map((clip) => clip.src);

      const result = await combineVideosMutation.mutateAsync({
        videoPaths,
        outputFileName: undefined, // Will use timestamp
      });

      if (result.success && result.outputPath) {
        // Download the combined video
        const link = document.createElement("a");
        link.href = result.outputPath;
        link.download =
          result.outputPath.split("/").pop() || "combined-video.mp4"; // Force download with filename
        setTimeout(() => {
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, 1000);

        toast({
          title: "Download Started",
          description: "Your combined video is downloading.",
        });
      } else {
        throw new Error(result.error || "Failed to combine videos");
      }
    } catch (error) {
      console.error("Error downloading all videos:", error);
      toast({
        title: "Download Failed",
        description:
          error instanceof Error ? error.message : "Failed to combine videos",
        variant: "destructive",
      });
    } finally {
      setIsDownloadingAll(false);
    }
  };

  // Render based on app state
  if (appState === "onboarding") {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <OnboardingChat onGenerate={handleGenerate} />
      </div>
    );
  }

  if (appState === "initial-video-generation") {
    return (
      <>
        <VideosGenerationView
          isGeneratingVideos={generationState.isGenerating}
          thoughts={scriptThoughts}
          completedVideos={generationState.completedClips}
          totalVideos={generationState.totalClips}
        />
      </>
    );
  }

  if (appState === "script-generation") {
    return (
      <>
        <GenerationProgress generationState={generationState} />
        <div className={generationState.isGenerating ? "pt-16" : ""}>
          <ScriptGenerationView
            script={generatedScript}
            isGeneratingScript={
              generationState.isGenerating && generationState.stage === "script"
            }
            thoughts={scriptThoughts}
            initialPrompt={initialPrompt}
            onScriptChange={setGeneratedScript}
            onContinueToVideo={handleContinueToVideo}
          />
        </div>
      </>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <GenerationProgress generationState={generationState} />

      <div
        className={`flex-1 flex flex-col ${generationState.isGenerating ? "pt-16" : ""}`}
      >
        {/* Header */}
        <div className="h-16 bg-card border-b border-border flex items-center px-6">
          <h1 className="text-xl font-semibold text-foreground">
            Math Video Editor
          </h1>
          <div className="flex items-center gap-4 ml-auto">
            {clips.length > 0 && (
              <Button
                onClick={handleDownloadAll}
                disabled={isDownloadingAll}
                size="sm"
                variant="outline"
              >
                {isDownloadingAll ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Combining...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Combined Video
                  </>
                )}
              </Button>
            )}
            <LayoutControls
              layoutMode={layoutMode}
              onLayoutChange={setLayoutMode}
            />
            <div className="text-sm text-muted-foreground">
              {clips.length} clips • {Math.floor(totalDuration / 60)}:
              {(totalDuration % 60).toFixed(0).padStart(2, "0")} total
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex animate-fade-in">
          {/* Video Player Area */}
          {layoutMode !== "script-only" && (
            <div
              className={`${layoutMode === "split" ? "w-1/2" : "flex-1"} flex flex-col`}
            >
              <VideoPlayer
                clips={clips}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                currentTime={currentTime}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClipChange={setSelectedClipId}
              />

              {/* Timeline */}
              <div
                className="animate-fade-in"
                style={{ animationDelay: "0.2s" }}
                key={`timeline-${layoutMode}`}
              >
                <VideoTimeline
                  clips={clips}
                  selectedClipId={selectedClipId}
                  onClipSelect={handleClipSelect}
                  onClipRemove={handleClipRemove}
                  onClipReorder={handleClipReorder}
                  isPlaying={isPlaying}
                  onPlayPause={handlePlayPause}
                  currentTime={currentTime}
                  totalDuration={totalDuration}
                  onSeek={setCurrentTime}
                  layoutMode={layoutMode}
                />
              </div>
            </div>
          )}

          {/* Script Editor */}
          {layoutMode !== "video-only" && (
            <div
              className={`${layoutMode === "split" ? "w-1/2" : "flex-1"} border-l border-border animate-fade-in`}
              style={{ animationDelay: "0.1s" }}
            >
              <ScriptEditor
                clip={getSelectedClip()}
                onScriptUpdate={handleScriptUpdate}
                onInterrupt={handleInterrupt}
                onRegenerateVideo={handleRegenerateVideo}
              />
            </div>
          )}

          {/* Chat Interface */}
          <div
            className="animate-slide-in-right"
            style={{ animationDelay: "0.3s" }}
          >
            <ChatInterface
              selectedClipId={selectedClipId}
              selectedClipName={getSelectedClipName()}
              onModifyClip={handleRequestModify}
              isGeneratingScript={generationState.isGenerating}
              currentThinking={
                generationState.stage === "script"
                  ? scriptThoughts
                  : currentVideoThinking
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
