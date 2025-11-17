import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { useToast } from "../hooks/useToast";

interface Message {
  type: "user" | "assistant" | "reasoning";
  content: string;
  attachedFile?: File;
}

interface Props {
  onSend: (prompt: string, attachedFile?: File) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface ChatPanelRef {
  showReasoning: (reasoning: string) => void;
  hideReasoning: () => void;
  addAssistantMessage: (message: string) => void;
  appendToLastAssistantMessage: (chunk: string) => void;
  startNewAssistantMessage: () => void;
  sendMessage: (message: string) => void;
  resetMessages: () => void;
}

const ChatPanel = forwardRef<ChatPanelRef, Props>(
  ({ onSend, style, className }, ref) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isWaiting, setIsWaiting] = useState(false);
    const [reasoningIndex, setReasoningIndex] = useState<number | null>(null);
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showError } = useToast();

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const validateFileSize = (file: File): boolean => {
      const isUnder10MB = file.size <= 10 * 1024 * 1024; // 10MB in bytes

      if (!isUnder10MB) {
        showError("File size must be 10MB or less.");
        return false;
      }

      return true;
    };

    const validatePDF = (file: File): boolean => {
      const isPDF =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      if (!isPDF) {
        return false;
      }

      return true;
    };

    const validateDOCX = (file: File): boolean => {
      const isDOCX =
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.name.toLowerCase().endsWith(".docx");

      if (!isDOCX) {
        return false;
      }

      return true;
    };

    const validateFile = (file: File): boolean => {
      const isValidType = validatePDF(file) || validateDOCX(file);

      if (!isValidType) {
        showError("Please select a PDF or DOCX file only.");
        return false;
      }

      return validateFileSize(file);
    };

    const handleFileSelect = (file: File) => {
      if (validateFile(file)) {
        setAttachedFile(file);
      }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    }, []);

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const file = e.dataTransfer.files[0];
        if (file) {
          handleFileSelect(file);
        }
      },
      [handleFileSelect],
    );

    const removeAttachedFile = () => {
      setAttachedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    useImperativeHandle(
      ref,
      () => ({
        showReasoning: (reasoning: string) => {
          console.log("showReasoning", reasoning);
          setIsWaiting(false);
          if (reasoningIndex !== null) {
            // Update existing reasoning
            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[reasoningIndex] = {
                type: "reasoning",
                content: reasoning,
              };
              return newMessages;
            });
          } else {
            // Add new reasoning
            setMessages((prev) => {
              setReasoningIndex(prev.length);
              return [...prev, { type: "reasoning", content: reasoning }];
            });
          }
        },
        hideReasoning: () => {
          if (reasoningIndex !== null) {
            setMessages((prev) =>
              prev.filter((_, index) => index !== reasoningIndex),
            );
            setReasoningIndex(null);
          }
        },
        addAssistantMessage: (message: string) => {
          setIsWaiting(false);
          setMessages((prev) => [
            ...prev,
            { type: "assistant", content: message },
          ]);
        },
        startNewAssistantMessage: () => {
          setIsWaiting(false);
          setMessages((prev) => [...prev, { type: "assistant", content: "" }]);
        },
        resetMessages: () => {
          setMessages([]);
        },
        appendToLastAssistantMessage: (chunk: string) => {
          setMessages((prev) => {
            if (prev.length === 0) return prev;
            const lastMsg = prev[prev.length - 1];
            if (lastMsg.type !== "assistant") {
              setIsWaiting(false);
              // If last message isn't assistant, create a new one
              return [...prev, { type: "assistant", content: chunk }];
            }
            // Update the last assistant message
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              ...lastMsg,
              content: lastMsg.content + chunk,
            };
            return newMessages;
          });
        },
        sendMessage: (message: string) => {
          const messageWithFile: Message = {
            type: "user",
            content: message,
          };

          setMessages((prev) => [...prev, messageWithFile]);
          setIsWaiting(true);
          setReasoningIndex(null);

          onSend(message);
        },
      }),
      [reasoningIndex, onSend],
    );

    const send = async () => {
      if (!input.trim()) return;

      const userMessage = input;
      const messageWithFile: Message = {
        type: "user",
        content: userMessage,
        attachedFile: attachedFile || undefined,
      };

      setMessages([...messages, messageWithFile]);
      setInput("");
      setIsWaiting(true);
      setReasoningIndex(null);

      onSend(userMessage, attachedFile || undefined);
      setAttachedFile(null);
      removeAttachedFile();
    };

    return (
      <div className={`chat-panel ${className}`} style={style}>
        <div className="chat-header">AI Assistant</div>
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.type}`}>
              {msg.type === "reasoning" &&
                (() => {
                  const parts = msg.content.split("\n");
                  const title = parts[0];
                  const content = parts.slice(1).join("\n");
                  return (
                    <div className="p-4 rounded-lg my-2 animate-fade-in">
                      <div className="bg-white p-4 rounded border-l-4 border-blue-400 animate-pulse">
                        <div className="flex items-center mb-2">
                          <span className="w-4 h-4 mr-2 text-blue-600">🤔</span>
                          <h4 className="font-semibold text-blue-800">
                            {title || "Thinking"}
                          </h4>
                        </div>
                        {content && (
                          <div className="text-sm text-blue-700 leading-relaxed whitespace-pre-wrap">
                            {content}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              {msg.type !== "reasoning" && (
                <div>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  {msg.attachedFile && (
                    <div className="mt-2 p-2 bg-gray-100 rounded-lg border">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">📄</span>
                        <span className="font-medium">
                          {msg.attachedFile.name}
                        </span>
                        <span className="ml-2 text-xs">
                          ({(msg.attachedFile.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {isWaiting && messages[messages.length - 1]?.type !== "reasoning" && (
            <div className="chat-message">
              <div className="p-4 rounded-lg my-2 animate-fade-in">
                <div className="bg-white p-4 rounded border-l-4 border-blue-400 animate-pulse">
                  <div className="flex items-center mb-2">
                    <span className="w-4 h-4 mr-2 text-blue-600">🤔</span>
                    <h4 className="font-semibold text-blue-800">
                      {"Thinking"}
                    </h4>
                  </div>
                  <div className="text-sm text-blue-700 leading-relaxed whitespace-pre-wrap">
                    Warming up neural engine...
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input-container">
          {attachedFile && (
            <div className="attached-file-preview">
              <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-lg mb-2">
                <div className="flex items-center">
                  <span className="mr-2">📄</span>
                  <span className="text-sm font-medium">
                    {attachedFile.name}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    ({(attachedFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  onClick={removeAttachedFile}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          <div
            className={`chat-input-wrapper ${isDragOver ? "drag-over" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="chat-input-actions">
              <button
                className="action-button generate-background-button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isWaiting}
                title="Attach PDF / Word DOCX file"
              >
                <span className="emoji"> 📎</span>
                <span className="text"></span>
              </button>
              <button
                className={`action-button save-button ${!input.trim() || isWaiting ? "disabled" : ""}`}
                onClick={send}
                disabled={!input.trim() || isWaiting}
              >
                <span className="emoji">✉️</span>
                <span className="text">
                  {isWaiting ? "Processing..." : "Send"}
                </span>
              </button>
            </div>
            <textarea
              className="form-input chat-input"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);

                e.target.style.height = "2.5rem";
                if (e.target.scrollHeight > e.target.clientHeight) {
                  const newHeight = Math.min(e.target.scrollHeight, 125);
                  e.target.style.height = `${newHeight}px`;
                }
              }}
              style={{
                height: "2.5rem",
                maxHeight: "125px",
                overflowY: "auto",
                resize: "none",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (e.shiftKey) return;

                  e.preventDefault();
                  send();
                }
              }}
              placeholder={
                isDragOver ? "Drop PDF file here..." : "Type your message..."
              }
            />
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileInputChange}
              style={{ display: "none" }}
            />
          </div>
        </div>
      </div>
    );
  },
);

ChatPanel.displayName = "ChatPanel";

export default ChatPanel;
