import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Sparkles, Image } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  relatedClipId?: string;
}

interface ChatInterfaceProps {
  selectedClipId: string | null;
  selectedClipName?: string;
  onGenerateClip?: (description: string) => void;
  onModifyClip?: (
    clipId: string,
    instruction: string,
    picturePath?: string,
  ) => void;
  isGeneratingScript?: boolean;
  currentThinking?: string;
  initialPrompt?: string;
}

export function ChatInterface({
  selectedClipId,
  selectedClipName,
  onGenerateClip,
  onModifyClip,
  isGeneratingScript,
  currentThinking,
  initialPrompt,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI assistant for creating math videos. I can help you generate new scenes or modify existing ones. What would you like to create?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedImagePath, setUploadedImagePath] = useState<
    string | undefined
  >();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const uploadImageMutation = useMutation({
    ...trpc.uploads.uploadVideoEditImage.mutationOptions(),
    onSuccess: () => {
      // showSuccess("Image uploaded successfully!");
    },
    onError: (error) => {
      // if (error.message.includes("exceeds 10MB")) {
      //   showError("The image cannot be uploaded because it is too large!");
      // } else {
      //   showError(error.message || "Upload failed");
      // }
    },
  });

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const result = await await uploadImageMutation.mutateAsync(formData);
      setUploadedImagePath(result.url);

      // Add a message to show the image was uploaded
      const uploadMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `Image uploaded: ${file.name}`,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, uploadMessage]);
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith("image/"));

    if (imageFile) {
      await uploadImage(imageFile);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      await uploadImage(file);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      relatedClipId: selectedClipId || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    if (selectedClipId && onModifyClip) {
      onModifyClip(selectedClipId, inputValue, uploadedImagePath);
      // Clear the uploaded image path after sending
      setUploadedImagePath(undefined);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find((item) => item.type.indexOf("image") !== -1);

    if (imageItem) {
      e.preventDefault();
      e.stopPropagation(); // Prevent event from bubbling up
      const blob = imageItem.getAsFile();
      if (blob) {
        // Create a file from the blob with a timestamp-based name
        const fileName = `screenshot-${Date.now()}.png`;
        const file = new File([blob], fileName, { type: blob.type });
        await uploadImage(file);
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className={`w-80 bg-chat border-l border-border flex flex-col h-full relative ${
        isDragging ? "border-primary" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onPaste={handlePaste}
      tabIndex={0}
    >
      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-primary/10 backdrop-blur-sm flex items-center justify-center border-2 border-dashed border-primary">
          <div className="text-center">
            <Image className="h-12 w-12 text-primary mx-auto mb-2" />
            <p className="text-lg font-semibold text-primary">
              Drop image here
            </p>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Chat Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        {selectedClipId && selectedClipName && (
          <div className="text-sm text-muted-foreground bg-timeline-item rounded px-2 py-1">
            Editing: {selectedClipName}
          </div>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "ai" && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}

              <div
                className={`max-w-[70%] rounded-lg p-3 ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
              >
                <div className="text-sm whitespace-pre-wrap">
                  {message.content}
                </div>
                <div className={`text-xs mt-1 opacity-70`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>

              {message.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="h-4 w-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="bg-muted text-foreground rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {currentThinking && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="max-w-[70%] rounded-lg p-3 bg-muted text-foreground">
                <div className="text-sm animate-fade-in" key={currentThinking}>
                  {currentThinking.slice(0, 200)}
                </div>
                <div className="text-xs mt-1 opacity-70">
                  {formatTime(new Date())}
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-border">
        {/* Show uploaded image indicator */}
        {uploadedImagePath && (
          <div className="mb-2 p-2 bg-muted rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Image className="h-4 w-4 text-primary" />
              <span>Image attached</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUploadedImagePath(undefined)}
              className="h-6 px-2"
            >
              Remove
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            onPaste={handlePaste}
            placeholder={
              selectedClipId
                ? "How should I modify this clip?"
                : "Describe the math scene you want to create..."
            }
            className="flex-1"
            disabled={isUploading}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            size="sm"
            variant="outline"
            title="Upload image"
          >
            <Image className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping || isUploading}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {isUploading && (
          <div className="mt-2 text-sm text-muted-foreground">
            Uploading image...
          </div>
        )}
      </div>
    </div>
  );
}
