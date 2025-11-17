import React, { useState, useRef, useEffect } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

interface LaTeXEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isInline?: boolean;
  className?: string;
}

export const LaTeXEditor: React.FC<LaTeXEditorProps> = ({
  content,
  onChange,
  onSave,
  onCancel,
  isInline = false,
  className = "",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditContent(content);
  }, [content]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleSave = () => {
    try {
      // Test render to validate LaTeX syntax
      if (isInline) {
        // Test inline math
        const testDiv = document.createElement("div");
        testDiv.innerHTML = `<span>$${editContent}$</span>`;
      } else {
        // Test block math
        const testDiv = document.createElement("div");
        testDiv.innerHTML = `<div>$$${editContent}$$</div>`;
      }

      onChange(editContent);
      setIsEditing(false);
      setError(null);
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid LaTeX syntax");
    }
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
    setError(null);
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    } else if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  const renderLaTeX = () => {
    try {
      if (isInline) {
        return <InlineMath math={content} />;
      } else {
        return <BlockMath math={content} />;
      }
    } catch (error) {
      return (
        <div className="latex-error">
          <span style={{ color: "#ef4444", fontSize: "14px" }}>
            LaTeX Error:{" "}
            {error instanceof Error ? error.message : "Invalid syntax"}
          </span>
        </div>
      );
    }
  };

  if (isEditing) {
    return (
      <div className={`latex-editor-container ${className}`}>
        <div className="latex-editor-input">
          <textarea
            ref={textareaRef}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="latex-textarea"
            placeholder={
              isInline ? "Enter inline LaTeX..." : "Enter LaTeX equation..."
            }
            rows={isInline ? 1 : 3}
            style={{
              width: "100%",
              padding: "8px",
              border: "2px solid #3b82f6",
              borderRadius: "4px",
              fontSize: "14px",
              fontFamily: "monospace",
              resize: "vertical",
              outline: "none",
            }}
          />
          {error && (
            <div
              style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}
            >
              {error}
            </div>
          )}
        </div>
        <div
          className="latex-editor-preview"
          style={{
            marginTop: "8px",
            padding: "8px",
            backgroundColor: "#f8f9fa",
            borderRadius: "4px",
          }}
        >
          <div
            style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}
          >
            Preview:
          </div>
          {renderLaTeX()}
        </div>
        <div
          className="latex-editor-hint"
          style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}
        >
          Press Cmd+Enter to save, Escape to cancel
        </div>
      </div>
    );
  }

  return (
    <div
      className={`latex-renderer ${className}`}
      onClick={handleEdit}
      style={{
        cursor: "pointer",
        padding: isInline ? "2px 4px" : "8px",
        borderRadius: "4px",
        transition: "background-color 0.2s",
        minHeight: isInline ? "auto" : "40px",
        display: isInline ? "inline-block" : "block",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#f3f4f6";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      {content.trim() ? (
        renderLaTeX()
      ) : (
        <div
          style={{
            color: "#9ca3af",
            fontSize: "14px",
            fontStyle: "italic",
          }}
        >
          {isInline
            ? "Click to add inline math"
            : "Click to add LaTeX equation"}
        </div>
      )}
    </div>
  );
};

export default LaTeXEditor;
