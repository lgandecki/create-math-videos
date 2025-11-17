import React from "react";
import { DiffEditor } from "@monaco-editor/react";

interface Props {
  original: string;
  modified: string;
  onApply: () => void;
  onCancel: () => void;
}
export default function DiffPreview({
  original,
  modified,
  onApply,
  onCancel,
}: Props) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div className="diff-controls">
        <button className="diff-button apply" onClick={onApply}>
          Apply Changes
        </button>
        <button className="diff-button cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
      <DiffEditor
        height="100%"
        original={original}
        modified={modified}
        language="markdown"
        options={{
          fontSize: 14,
          renderSideBySide: true,
          lineNumbers: "off",
          minimap: { enabled: false },
          padding: { top: 16, bottom: 16 },
          wordWrap: "on",
          useInlineViewWhenSpaceIsLimited: false, // Add this to ensure wrapping applies consistently to both sides
          diffWordWrap: "on",
        }}
      />
    </div>
  );
}
