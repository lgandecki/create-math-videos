import React from "react";
import { useLessonStore } from "../stores/LessonStore";

interface FileTitleProps {
  isEditingFileName: boolean;
  editedFileName: string;
  variant: "mobile" | "tablet" | "desktop";
  onEditStart: () => void;
  onEditChange: (value: string) => void;
  onEditComplete: () => void;
  onEditCancel: () => void;
  decodeFileName: (filename: string) => string;
}

export const FileTitle: React.FC<FileTitleProps> = ({
  isEditingFileName,
  editedFileName,
  variant,
  onEditStart,
  onEditChange,
  onEditComplete,
  onEditCancel,
  decodeFileName,
}) => {
  const { selectedFile, modifiedFiles } = useLessonStore();
  if (!selectedFile) return null;

  const handleBlur = () => {
    if (
      editedFileName.trim() &&
      editedFileName !== decodeFileName(selectedFile)
    ) {
      onEditComplete();
    } else {
      onEditCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (
        editedFileName.trim() &&
        editedFileName !== decodeFileName(selectedFile)
      ) {
        onEditComplete();
      } else {
        onEditCancel();
      }
    } else if (e.key === "Escape") {
      onEditCancel();
    }
  };

  const getContainerClass = () => {
    switch (variant) {
      case "mobile":
        return isEditingFileName ? "mobile-file-rename" : "mobile-file-title";
      case "tablet":
        return isEditingFileName ? "tablet-file-rename" : "tablet-file-title";
      case "desktop":
        return "editor-header";
      default:
        return "";
    }
  };

  const getInputClass = () => {
    switch (variant) {
      case "desktop":
        return "form-input editor-title-input";
      default:
        return "form-input";
    }
  };

  const getTitleClass = () => {
    switch (variant) {
      case "desktop":
        return "editor-title clickable";
      default:
        return "file-title clickable";
    }
  };

  const getClickTitle = () => {
    switch (variant) {
      case "mobile":
        return "Tap to rename";
      default:
        return "Click to rename";
    }
  };

  if (variant === "desktop") {
    return (
      <>
        {isEditingFileName ? (
          <input
            type="text"
            value={editedFileName}
            onChange={(e) => onEditChange(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={getInputClass()}
            autoFocus
          />
        ) : (
          <span
            className={getTitleClass()}
            onClick={onEditStart}
            title={getClickTitle()}
          >
            {decodeFileName(selectedFile)}
            {modifiedFiles.has(selectedFile) && " *"}
          </span>
        )}
      </>
    );
  }

  return (
    <div className={getContainerClass()}>
      {isEditingFileName ? (
        <input
          type="text"
          value={editedFileName}
          onChange={(e) => onEditChange(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={getInputClass()}
          autoFocus
        />
      ) : (
        <span
          className={getTitleClass()}
          onClick={onEditStart}
          title={getClickTitle()}
        >
          {decodeFileName(selectedFile)}
          {modifiedFiles.has(selectedFile) && " *"}
        </span>
      )}
    </div>
  );
};
