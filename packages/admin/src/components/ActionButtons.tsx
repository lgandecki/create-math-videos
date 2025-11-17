import React from "react";

import { useLessonStore } from "../stores/LessonStore";

interface ActionButtonsProps {
  variant: "mobile" | "tablet" | "desktop";
  onDelete: () => void;
  onPreview: () => void;
  onGenerateBackground: () => void;
  onChatToggle?: () => void;
  isChatVisible?: boolean;
  onMarkdownPreview?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  variant,
  onDelete,
  onPreview,
  onGenerateBackground,
  onChatToggle,
  isChatVisible = false,
  onMarkdownPreview,
}) => {
  const { selectedFile, modifiedFiles, content } = useLessonStore();
  if (!selectedFile) return null;

  const baseClass = "action-button";
  const showChatToggle = variant === "mobile" && onChatToggle;
  const isLessonEmpty =
    !content ||
    content.trim() === "" ||
    (/^\#\s.+$/.test(content.trim()) &&
      content.trim().split("\n").length === 1);

  return (
    <>
      <button
        className={`${baseClass} delete-button`}
        onClick={onDelete}
        title="Delete file"
      >
        <span className="emoji">🗑️</span>
        <span className="text">Delete</span>
      </button>

      <button
        className={`${baseClass} preview-button ${isLessonEmpty ? "disabled" : ""}`}
        onClick={onPreview}
        disabled={isLessonEmpty}
        title="Open in Lesson Player"
      >
        <span className="emoji">🚀</span>
        <span className="text">Try Lesson!</span>
      </button>

      <button
        className={`${baseClass} generate-background-button`}
        onClick={onGenerateBackground}
        title="Generate Lesson Background"
      >
        <span className="emoji">🎨</span>
        <span className="text">Background</span>
      </button>

      {onMarkdownPreview && (
        <button
          className={`${baseClass} markdown-preview-button`}
          onClick={onMarkdownPreview}
          title="Preview markdown in modal"
        >
          <span className="emoji">📄</span>
          <span className="text">PDF</span>
        </button>
      )}

      {showChatToggle && (
        <button
          className={`${baseClass} chat-toggle-button ${isChatVisible ? "active" : ""}`}
          onClick={onChatToggle}
          title="Toggle AI Chat"
        >
          <span className="emoji">🤖</span>
          <span className="text">AI Chat</span>
        </button>
      )}
    </>
  );
};
