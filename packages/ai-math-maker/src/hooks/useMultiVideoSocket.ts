import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface VideoSection {
  index: number;
  title: string;
  content: string;
  videoPath?: string;
  thumbnailPath?: string;
  sessionId?: string;
  isComplete: boolean;
  error?: string;
}

interface UseMultiVideoSocketProps {
  onSectionVideoPath?: (
    path: string,
    sectionIndex: number,
    thumbnailPath?: string,
  ) => void;
  onSectionProgress?: (delta: string, sectionIndex: number) => void;
  onSectionComplete?: (sectionIndex: number, section: VideoSection) => void;
  onAllVideosComplete?: (sections: VideoSection[]) => void;
  onError?: (error: string, sectionIndex?: number) => void;
}

export function useMultiVideoSocket({
  onSectionVideoPath,
  onSectionProgress,
  onSectionComplete,
  onAllVideosComplete,
  onError,
}: UseMultiVideoSocketProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [sections, setSections] = useState<VideoSection[]>([]);
  const [activeRequests, setActiveRequests] = useState<Set<number>>(new Set());

  // Use refs to store the latest callbacks
  const callbacksRef = useRef({
    onSectionVideoPath,
    onSectionProgress,
    onSectionComplete,
    onAllVideosComplete,
    onError,
  });

  // Update the ref when callbacks change
  useEffect(() => {
    callbacksRef.current = {
      onSectionVideoPath,
      onSectionProgress,
      onSectionComplete,
      onAllVideosComplete,
      onError,
    };
  }, [
    onSectionVideoPath,
    onSectionProgress,
    onSectionComplete,
    onAllVideosComplete,
    onError,
  ]);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL, {
      path: "/ws",
    });

    newSocket.on("connect", () => {
      console.log("Connected to video server (multi)");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from video server (multi)");
      setIsConnected(false);
    });

    // Handle video responses with section index
    newSocket.on("video-response-delta", (data) => {
      if (data.sectionIndex !== undefined) {
        console.log(
          `Video response delta for section ${data.sectionIndex}:`,
          data.response,
        );
        callbacksRef.current.onSectionProgress?.(
          data.response,
          data.sectionIndex,
        );
      }
    });

    newSocket.on("video-path", (data) => {
      if (data.sectionIndex !== undefined) {
        console.log(
          `Video path received for section ${data.sectionIndex}:`,
          data.path,
          `thumbnail:`,
          data.thumbnailPath,
        );

        // Update section with video path and thumbnail
        setSections((prev) => {
          const updated = prev.map((section) =>
            section.index === data.sectionIndex
              ? {
                  ...section,
                  videoPath: data.path,
                  thumbnailPath: data.thumbnailPath,
                }
              : section,
          );
          return updated;
        });

        callbacksRef.current.onSectionVideoPath?.(
          data.path,
          data.sectionIndex,
          data.thumbnailPath,
        );
      }
    });

    newSocket.on("video-response-complete", (data) => {
      if (data?.sectionIndex !== undefined) {
        console.log(
          `Video creation complete for section ${data.sectionIndex}, sessionId: ${data.sessionId}`,
        );

        // Remove from active requests and mark as complete with sessionId
        setActiveRequests((prev) => {
          const next = new Set(prev);
          next.delete(data.sectionIndex);
          return next;
        });

        setSections((prev) => {
          const updated = prev.map((section) =>
            section.index === data.sectionIndex
              ? { ...section, isComplete: true, sessionId: data.sessionId }
              : section,
          );

          // Find the completed section
          const completedSection = updated.find(
            (s) => s.index === data.sectionIndex,
          );
          if (completedSection) {
            callbacksRef.current.onSectionComplete?.(
              data.sectionIndex,
              completedSection,
            );
          }

          // Check if all sections are complete
          const allComplete = updated.every((s) => s.isComplete || s.error);
          if (allComplete && updated.length > 0) {
            callbacksRef.current.onAllVideosComplete?.(updated);
          }

          return updated;
        });
      }
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
      if (error.sectionIndex !== undefined) {
        setSections((prev) =>
          prev.map((section) =>
            section.index === error.sectionIndex
              ? {
                  ...section,
                  error: error.message || "An error occurred",
                  isComplete: true,
                }
              : section,
          ),
        );
        setActiveRequests((prev) => {
          const next = new Set(prev);
          next.delete(error.sectionIndex);
          return next;
        });
      }
      callbacksRef.current.onError?.(
        error.message || "An error occurred",
        error.sectionIndex,
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const splitMarkdownBySections = (markdown: string): VideoSection[] => {
    // Split by ## headers (not ### or more)
    const lines = markdown.split("\n");
    const sections: VideoSection[] = [];
    let currentSection: VideoSection | null = null;
    let currentContent: string[] = [];

    lines.forEach((line) => {
      if (line.match(/^##\s+(.+)$/)) {
        // Save previous section if exists
        if (currentSection) {
          currentSection.content = currentContent.join("\n").trim();
          if (currentSection.content) {
            sections.push(currentSection);
          }
        }

        // Start new section
        const title = line.replace(/^##\s+/, "").trim();
        currentSection = {
          index: sections.length,
          title,
          content: "",
          isComplete: false,
        };
        currentContent = [];
      } else if (currentSection) {
        currentContent.push(line);
      }
    });

    // Don't forget the last section
    if (currentSection) {
      currentSection.content = currentContent.join("\n").trim();
      if (currentSection.content) {
        sections.push(currentSection);
      }
    }

    // Limit to 5 sections max
    return sections.slice(0, 5);
  };

  const createVideosFromScript = (script: string) => {
    if (!socket || !isConnected) {
      callbacksRef.current.onError?.("Not connected to video server");
      return;
    }

    // Split the script into sections
    const scriptSections = splitMarkdownBySections(script);

    if (scriptSections.length === 0) {
      callbacksRef.current.onError?.("No sections found in the script");
      return;
    }

    console.log(
      `Creating ${scriptSections.length} videos from script sections`,
    );
    setSections(scriptSections);
    setActiveRequests(new Set(scriptSections.map((s) => s.index)));

    // Send video creation requests for each section
    scriptSections.forEach((section) => {
      const prompt = `Section: ${section.title}\n\n${section.content}`;
      socket.emit("create-video", {
        prompt,
        sectionIndex: section.index,
        sectionTitle: section.title,
      });
    });
  };

  const updateVideo = (
    sectionIndex: number,
    newPrompt: string,
    sessionId: string,
    sectionTitle: string,
  ) => {
    if (!socket || !isConnected) {
      callbacksRef.current.onError?.("Not connected to video server");
      return;
    }

    console.log(
      `Updating video for section ${sectionIndex} with sessionId ${sessionId}`,
    );

    // Mark section as being updated
    setSections((prev) =>
      prev.map((section) =>
        section.index === sectionIndex
          ? { ...section, isComplete: false, error: undefined }
          : section,
      ),
    );

    setActiveRequests((prev) => {
      const next = new Set(prev);
      next.add(sectionIndex);
      return next;
    });

    socket.emit("update-video", {
      prompt: newPrompt,
      sectionIndex,
      sectionTitle,
      sessionId,
    });
  };

  return {
    createVideosFromScript,
    updateVideo,
    isConnected,
    sections,
    activeRequests: activeRequests.size,
    totalSections: sections.length,
  };
}
