import { useState, useRef, useEffect } from "react";

import CreateLessonModal from "./CreateLessonModal";
import { decodeFileName } from "../utils/fileNameEncoder";
import { useLessonStore } from "../stores/LessonStore";

interface MobileFileSelectorProps {
  files: string[];
  onSelect: (file: string) => void;
  onAIGeneratedLesson?: (lessonTitle: string) => void;
  updateUrl: (url: string | null) => void;
}

const MobileFileSelector: React.FC<MobileFileSelectorProps> = ({
  files,
  onSelect,
  onAIGeneratedLesson,
  updateUrl,
}) => {
  const { selectedFile, modifiedFiles } = useLessonStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileSelect = (file: string) => {
    onSelect(file);
    setIsOpen(false);
  };

  const currentFileName = selectedFile
    ? decodeFileName(selectedFile)
    : "No file selected";
  const isCurrentFileModified = selectedFile && modifiedFiles.has(selectedFile);

  return (
    <div className="mobile-file-selector" ref={dropdownRef}>
      <button
        className="mobile-file-selector-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="file-name">
          {currentFileName}
          {isCurrentFileModified && " *"}
        </span>
        <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>▼</span>
      </button>

      {isOpen && (
        <div className="mobile-file-dropdown">
          <div className="file-list">
            {files.map((file) => (
              <button
                key={file}
                className={`file-item ${file === selectedFile ? "selected" : ""}`}
                onClick={() => handleFileSelect(file)}
              >
                <span className="file-name">
                  {decodeFileName(file)}
                  {modifiedFiles.has(file) && " *"}
                </span>
              </button>
            ))}
          </div>

          <div className="create-file-section">
            <button
              className="create-file-button"
              onClick={() => setShowModal(true)}
            >
              + New File
            </button>
          </div>
        </div>
      )}
      <CreateLessonModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAIGeneratedLesson={onAIGeneratedLesson}
        updateUrl={updateUrl}
      />
    </div>
  );
};

export default MobileFileSelector;
