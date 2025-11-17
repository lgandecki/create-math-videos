import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Download } from "lucide-react";
import { VideoClip } from "@/types";

interface VideoTimelineProps {
  clips: VideoClip[];
  selectedClipId: string | null;
  onClipSelect: (clipId: string) => void;
  onClipRemove: (clipId: string) => void;
  onClipReorder: (fromIndex: number, toIndex: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTime: number;
  totalDuration: number;
  onSeek?: (time: number) => void;
  layoutMode?: "split" | "video-only" | "script-only";
}

export function VideoTimeline({
  clips,
  selectedClipId,
  onClipSelect,
  onClipRemove,
  onClipReorder,
  isPlaying,
  onPlayPause,
  currentTime,
  totalDuration,
  onSeek,
  layoutMode = "split",
}: VideoTimelineProps) {
  const [draggedClip, setDraggedClip] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isHoveringProgress, setIsHoveringProgress] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(0);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [hoveredClipId, setHoveredClipId] = useState<string | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedClip(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedClip !== null && draggedClip !== dropIndex) {
      onClipReorder(draggedClip, dropIndex);
    }
    setDraggedClip(null);
    setDragOverIndex(null);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    return totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;
  };

  const handleDownloadClip = (clip: VideoClip, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent clip selection

    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = clip.src;
    link.download = `${clip.name.replace(/[^a-z0-9]/gi, "_")}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setHoverPosition(percentage);

    if (isDraggingProgress && onSeek) {
      const seekTime = (percentage / 100) * totalDuration;
      onSeek(seekTime);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !onSeek) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const seekTime = (percentage / 100) * totalDuration;
    onSeek(seekTime);
  };

  const handleProgressMouseDown = () => {
    setIsDraggingProgress(true);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDraggingProgress(false);
    };

    if (isDraggingProgress) {
      document.addEventListener("mouseup", handleMouseUp);
      return () => document.removeEventListener("mouseup", handleMouseUp);
    }
  }, [isDraggingProgress]);

  // Track container width
  useEffect(() => {
    const updateWidth = () => {
      if (timelineRef.current) {
        setContainerWidth(timelineRef.current.offsetWidth);
      }
    };

    // Add a small delay to ensure DOM has updated after layout change
    const timeoutId = setTimeout(updateWidth, 100);

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateWidth);
    };
  }, [layoutMode]);

  // Calculate clip width based on duration
  const getClipWidth = (clipDuration: number) => {
    if (totalDuration === 0 || containerWidth === 0) return 160; // Default width

    const ratio = clipDuration / totalDuration;
    // Use actual container width minus gaps between clips
    const totalGaps = (clips.length - 1) * 8; // 8px gap between clips (gap-2)
    const availableWidth = containerWidth - totalGaps;

    const calculatedWidth = Math.floor(availableWidth * ratio);
    // Minimum width of 60px to ensure visibility
    return Math.max(60, calculatedWidth);
  };

  return (
    <div className="bg-timeline border-t border-border p-4 h-52 flex flex-col">
      {/* Timeline Controls */}

      {/* Progress Bar */}
      <div
        ref={progressBarRef}
        className="w-full h-6 mb-4 relative cursor-pointer group"
        onMouseEnter={() => setIsHoveringProgress(true)}
        onMouseLeave={() => setIsHoveringProgress(false)}
        onMouseMove={handleProgressMouseMove}
        onClick={handleProgressClick}
        onMouseDown={handleProgressMouseDown}
      >
        {/* Click area */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-1 bg-timeline-item rounded-full">
            <div
              className="h-full bg-primary rounded-full transition-all duration-100"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* Hover indicator */}
        {isHoveringProgress && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full -ml-1.5 pointer-events-none transition-opacity"
            style={{ left: `${hoverPosition}%` }}
          />
        )}

        {/* Current position indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full -ml-1 pointer-events-none"
          style={{ left: `${getProgressPercentage()}%` }}
        />
      </div>

      {/* Timeline Clips */}
      <div className="flex-1 overflow-hidden" ref={timelineRef}>
        <div className="flex gap-2 h-28 items-center py-2">
          {clips.map((clip, index) => (
            <div
              key={clip.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onClick={() => onClipSelect(clip.id)}
              onMouseEnter={() => setHoveredClipId(clip.id)}
              onMouseLeave={() => setHoveredClipId(null)}
              style={{ width: `${getClipWidth(clip.duration)}px` }}
              className={`
                relative flex-shrink-0 h-20 rounded-lg cursor-pointer 
                transition-all duration-200 border-2
                ${
                  selectedClipId === clip.id
                    ? "border-timeline-selected bg-timeline-selected/20"
                    : "border-timeline-item bg-timeline-item hover:bg-timeline-hover"
                }
                ${dragOverIndex === index ? "scale-105" : ""}
              `}
            >
              {/* Video Thumbnail */}
              <div className="absolute inset-0 rounded-md bg-video flex items-center justify-center overflow-hidden">
                {clip.thumbnail && clip.thumbnail !== "/placeholder.svg" ? (
                  <img
                    src={clip.thumbnail}
                    alt={clip.name}
                    className="h-full w-auto object-contain"
                  />
                ) : (
                  <video
                    src={clip.src}
                    className="h-full w-auto object-contain"
                    muted
                    preload="metadata"
                  />
                )}

                {/* Regenerating/Generating Overlay */}
                {(clip.isRegenerating || clip.isGenerating) && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* Clip Info */}
              <div className="absolute bottom-1 left-1 right-1">
                <div className="text-xs text-foreground rounded px-1 py-0.5 truncate">
                  {clip.name}
                </div>
              </div>

              {/* Duration Badge */}
              <div className="absolute top-1 right-1">
                <div className="text-xs text-foreground bg-background/80 rounded px-1 py-0.5">
                  {formatTime(clip.duration)}
                </div>
              </div>

              {/* Download Button - shown on hover */}
              {hoveredClipId === clip.id &&
                !clip.isRegenerating &&
                !clip.isGenerating && (
                  <button
                    onClick={(e) => handleDownloadClip(clip, e)}
                    className="absolute top-1 left-1 p-1 bg-background/80 hover:bg-background rounded transition-colors"
                    title="Download clip"
                  >
                    <Download className="h-3 w-3 text-foreground" />
                  </button>
                )}
            </div>
          ))}

          {clips.length === 0 && (
            <div className="flex items-center justify-center h-full w-full text-muted-foreground">
              No video clips in timeline
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
