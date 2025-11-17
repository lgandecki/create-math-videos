import React, { useState } from "react";

import CreateLessonModal from "./CreateLessonModal";
import { decodeFileName } from "../utils/fileNameEncoder";
import { useLessonStore } from "../stores/LessonStore";

interface Props {
  files: string[];
  onSelect: (file: string) => void;
  onAIGeneratedLesson?: (lessonTitle: string) => void;
  updateUrl: (url: string | null) => void;
  style?: React.CSSProperties;
}

export default function FileList({
  files,
  onSelect,
  onAIGeneratedLesson,
  updateUrl,
  style,
}: Props) {
  const { selectedFile, modifiedFiles } = useLessonStore();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="file-panel" style={style}>
        <div className="file-panel-header">
          <span>Lessons</span>
          <button
            className="create-file-btn"
            onClick={() => setShowModal(true)}
            title="Create new lesson"
          >
            +
          </button>
        </div>
        <div className="file-list">
          <ul>
            {files.map((file) => {
              const displayName = decodeFileName(file);
              return (
                <li
                  key={file}
                  onClick={() => onSelect(file)}
                  className={`file-item ${selectedFile === file ? "selected" : ""} ${modifiedFiles.has(file) ? "modified" : ""}`}
                >
                  {displayName}
                  {modifiedFiles.has(file) && " *"}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <CreateLessonModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAIGeneratedLesson={onAIGeneratedLesson}
        updateUrl={updateUrl}
      />
    </>
  );
}
