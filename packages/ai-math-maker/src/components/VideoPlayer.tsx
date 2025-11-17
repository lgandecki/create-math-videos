import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { VideoClip } from "@/types";

interface VideoPlayerProps {
  clips: VideoClip[];
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  onLoadedMetadata: (duration: number) => void;
  onClipChange?: (clipId: string) => void;
}

export function VideoPlayer({
  clips,
  isPlaying,
  onPlayPause,
  currentTime,
  onTimeUpdate,
  onLoadedMetadata,
  onClipChange,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  // Helper function to check if a clip is available for playback
  const isClipAvailable = (clip: VideoClip) => {
    return (
      !clip.isGenerating &&
      !clip.isRegenerating &&
      clip.src !== "/placeholder.svg"
    );
  };

  // Helper function to find next available clip
  const findNextAvailableClip = (startIndex: number): number => {
    for (let i = startIndex; i < clips.length; i++) {
      if (isClipAvailable(clips[i])) {
        return i;
      }
    }
    return -1;
  };

  // Helper function to find previous available clip
  const findPreviousAvailableClip = (startIndex: number): number => {
    for (let i = startIndex; i >= 0; i--) {
      if (isClipAvailable(clips[i])) {
        return i;
      }
    }
    return -1;
  };

  // Calculate which clip should be playing based on current time
  useEffect(() => {
    let accumulatedTime = 0;
    let clipIndex = 0;

    for (let i = 0; i < clips.length; i++) {
      if (
        currentTime >= accumulatedTime &&
        currentTime < accumulatedTime + clips[i].duration
      ) {
        clipIndex = i;
        break;
      }
      accumulatedTime += clips[i].duration;
    }

    // If the calculated clip is not available, find the next available one
    if (!isClipAvailable(clips[clipIndex])) {
      const nextAvailable = findNextAvailableClip(clipIndex);
      if (nextAvailable !== -1) {
        clipIndex = nextAvailable;
      } else {
        // No available clips after this point, try previous
        const prevAvailable = findPreviousAvailableClip(clipIndex - 1);
        if (prevAvailable !== -1) {
          clipIndex = prevAvailable;
        }
      }
    }

    if (clipIndex !== currentClipIndex && clipIndex !== -1) {
      setCurrentClipIndex(clipIndex);
      if (onClipChange && clips[clipIndex]) {
        onClipChange(clips[clipIndex].id);
      }
    }
  }, [currentTime, clips, currentClipIndex, onClipChange]);

  // Handle video playback
  useEffect(() => {
    console.log("isPlaying", isPlaying, clips);
    const video = videoRef.current;
    if (!video || clips.length === 0) return;

    if (isPlaying) {
      video.play();
    } else {
      video.pause();
    }
  }, [isPlaying, clips]);

  // Update video source when clip changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || clips.length === 0) return;

    const currentClip = clips[currentClipIndex];
    if (!currentClip) return;

    // Update video source
    video.src = currentClip.src;

    // Calculate the time within the current clip
    let accumulatedTime = 0;
    for (let i = 0; i < currentClipIndex; i++) {
      accumulatedTime += clips[i].duration;
    }
    const timeInClip = currentTime - accumulatedTime;

    // When the video source is loaded, set the time and play if needed
    video.addEventListener(
      "loadedmetadata",
      () => {
        video.currentTime = Math.max(0, timeInClip);

        // If we should be playing, start playing the new clip
        if (isPlaying) {
          video
            .play()
            .catch((err) => console.error("Error playing video:", err));
        }
      },
      { once: true },
    );
  }, [currentClipIndex, clips, isPlaying]);

  // Handle external currentTime changes (e.g., from timeline click)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || clips.length === 0) return;

    // Calculate the time within the current clip
    let accumulatedTime = 0;
    for (let i = 0; i < currentClipIndex; i++) {
      accumulatedTime += clips[i].duration;
    }
    const timeInClip = currentTime - accumulatedTime;

    // Only update if the time difference is significant (to avoid feedback loops)
    if (Math.abs(video.currentTime - timeInClip) > 0.1) {
      video.currentTime = Math.max(0, timeInClip);
    }
  }, [currentTime, currentClipIndex, clips]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    // Calculate the global time
    let accumulatedTime = 0;
    for (let i = 0; i < currentClipIndex; i++) {
      accumulatedTime += clips[i].duration;
    }
    const globalTime = accumulatedTime + video.currentTime;
    onTimeUpdate(globalTime);
  };

  const handleVideoEnded = () => {
    // Find next available clip
    const nextAvailable = findNextAvailableClip(currentClipIndex + 1);

    if (nextAvailable !== -1) {
      setCurrentClipIndex(nextAvailable);
      if (onClipChange && clips[nextAvailable]) {
        onClipChange(clips[nextAvailable].id);
      }

      // Calculate time to jump to
      let accumulatedTime = 0;
      for (let i = 0; i < nextAvailable; i++) {
        accumulatedTime += clips[i].duration;
      }
      onTimeUpdate(accumulatedTime);
    } else {
      onPlayPause(); // Stop playing
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;

    // Calculate total duration
    const totalDuration = clips.reduce((acc, clip) => acc + clip.duration, 0);
    onLoadedMetadata(totalDuration);
  };

  const skipToNext = () => {
    const nextAvailable = findNextAvailableClip(currentClipIndex + 1);

    if (nextAvailable !== -1) {
      let accumulatedTime = 0;
      for (let i = 0; i < nextAvailable; i++) {
        accumulatedTime += clips[i].duration;
      }
      onTimeUpdate(accumulatedTime);
    }
  };

  const skipToPrevious = () => {
    const prevAvailable = findPreviousAvailableClip(currentClipIndex - 1);

    if (prevAvailable !== -1) {
      let accumulatedTime = 0;
      for (let i = 0; i < prevAvailable; i++) {
        accumulatedTime += clips[i].duration;
      }
      onTimeUpdate(accumulatedTime);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current;
    if (video) {
      video.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate total duration from clips
  const totalDuration = clips.reduce((acc, clip) => acc + clip.duration, 0);

  if (clips.length === 0) {
    return (
      <div className="flex-1 bg-video flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="text-lg mb-2">No video clips</div>
          <div className="text-sm">
            Add video clips to the timeline to start editing
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-video flex flex-col">
      {/* Video Display */}
      <div className="flex-1 flex items-center justify-center p-4">
        <video
          ref={videoRef}
          className="max-w-full max-h-full rounded-lg shadow-lg"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          onLoadedMetadata={handleLoadedMetadata}
          muted={isMuted}
        />
      </div>

      {/* Video Controls */}
      <div className="p-4 bg-card border-t border-border">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={skipToPrevious}
            disabled={findPreviousAvailableClip(currentClipIndex - 1) === -1}
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="lg" onClick={onPlayPause}>
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={skipToNext}
            disabled={findNextAvailableClip(currentClipIndex + 1) === -1}
          >
            <SkipForward className="h-4 w-4" />
          </Button>

          <div className="ml-4 text-sm text-muted-foreground">
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </div>

          <div className="ml-4 text-sm text-muted-foreground">
            Clip {currentClipIndex + 1} of {clips.length}:{" "}
            {clips[currentClipIndex]?.name}
          </div>
        </div>
      </div>
    </div>
  );
}
