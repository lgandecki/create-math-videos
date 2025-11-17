import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL, {
      path: "/ws",
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    newSocket.on("video-response-delta", (data) => {
      console.log("Video response delta:", data.response);
    });

    newSocket.on("video-path", (data) => {
      console.log("Video path received:", data.path);
      // TODO: Display the video using the path
    });

    newSocket.on("video-response-complete", () => {
      console.log("Video creation complete");
      setIsCreatingVideo(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleCreateVideo = () => {
    if (!socket || !prompt.trim()) return;

    setIsCreatingVideo(true);
    socket.emit("create-video", { prompt });
  };

  return (
    <div className="App">
      <h1>Video Creator</h1>

      <div className="connection-status">
        Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
      </div>

      <div className="video-form">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your video prompt..."
          disabled={!isConnected || isCreatingVideo}
          onKeyPress={(e) => e.key === "Enter" && handleCreateVideo()}
        />

        <button
          onClick={handleCreateVideo}
          disabled={!isConnected || !prompt.trim() || isCreatingVideo}
        >
          {isCreatingVideo ? "Creating..." : "Create Video"}
        </button>
      </div>

      {isCreatingVideo && (
        <div className="creating-status">
          Creating video... Check console for responses.
        </div>
      )}
    </div>
  );
}

export default App;
