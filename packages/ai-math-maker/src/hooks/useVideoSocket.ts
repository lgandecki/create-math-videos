import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface UseVideoSocketProps {
  onVideoPath?: (path: string) => void;
  onVideoResponseDelta?: (delta: string) => void;
  onVideoComplete?: () => void;
  onError?: (error: string) => void;
}

export function useVideoSocket({
  onVideoPath,
  onVideoResponseDelta,
  onVideoComplete,
  onError,
}: UseVideoSocketProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);

  // Use refs to store the latest callbacks without triggering re-renders
  const callbacksRef = useRef({
    onVideoPath,
    onVideoResponseDelta,
    onVideoComplete,
    onError,
  });

  // Update the ref when callbacks change
  useEffect(() => {
    callbacksRef.current = {
      onVideoPath,
      onVideoResponseDelta,
      onVideoComplete,
      onError,
    };
  }, [onVideoPath, onVideoResponseDelta, onVideoComplete, onError]);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL, {
      path: "/ws",
    });

    newSocket.on("connect", () => {
      console.log("Connected to video server");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from video server");
      setIsConnected(false);
    });

    newSocket.on("video-response-delta", (data) => {
      console.log("Video response delta:", data.response);
      callbacksRef.current.onVideoResponseDelta?.(data.response);
    });

    newSocket.on("video-path", (data) => {
      console.log("Video path received:", data.path);
      callbacksRef.current.onVideoPath?.(data.path);
    });

    newSocket.on("video-response-complete", () => {
      console.log("Video creation complete");
      setIsCreatingVideo(false);
      callbacksRef.current.onVideoComplete?.();
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
      setIsCreatingVideo(false);
      callbacksRef.current.onError?.(error.message || "An error occurred");
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []); // Remove dependencies to prevent recreating socket on every render

  const createVideo = (prompt: string) => {
    if (!socket || !isConnected) {
      callbacksRef.current.onError?.("Not connected to video server");
      return;
    }

    setIsCreatingVideo(true);
    socket.emit("create-video", { prompt });
  };

  return {
    createVideo,
    isConnected,
    isCreatingVideo,
  };
}
