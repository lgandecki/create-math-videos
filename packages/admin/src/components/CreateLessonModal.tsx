import React, { useState, useEffect } from "react";
import { useLessonHandlers } from "../handlers/lessonHandlers";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAIGeneratedLesson?: (lessonTitle: string) => void;
  updateUrl: (url: string | null) => void;
}

export default function CreateLessonModal({
  isOpen,
  onClose,
  onAIGeneratedLesson,
  updateUrl,
}: Props) {
  const [lessonName, setLessonName] = useState("");
  const [generateContent, setGenerateContent] = useState(true);

  const { createLessonMutation } = useLessonHandlers(
    updateUrl,
    generateContent ? onAIGeneratedLesson : undefined,
  );

  useEffect(() => {
    if (isOpen) {
      setLessonName("");
      setGenerateContent(true);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lessonName.trim()) {
      createLessonMutation.mutate({ fileName: lessonName.trim() });
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Create New Lesson</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <label htmlFor="lesson-name" className="modal-label">
              Lesson Name
            </label>
            <input
              id="lesson-name"
              type="text"
              value={lessonName}
              onChange={(e) => setLessonName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter lesson name..."
              className="modal-input"
              autoFocus
            />
            <p className="modal-hint">
              Enter a descriptive name for your lesson.
              <br />
              Don't sweat it, you can change it later.
            </p>

            <div style={{ marginTop: "16px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  color: "var(--text-primary)",
                }}
              >
                <input
                  type="checkbox"
                  checked={generateContent}
                  onChange={(e) => setGenerateContent(e.target.checked)}
                  style={{ width: "16px", height: "16px" }}
                />
                Generate lesson content with AI
              </label>
              <p
                className="modal-hint"
                style={{ marginTop: "4px", marginBottom: "0" }}
              >
                If checked, AI will automatically create comprehensive lesson
                content based on the title.
              </p>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="modal-button modal-button-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!lessonName.trim()}
              className="modal-button modal-button-primary"
            >
              Create Lesson
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
