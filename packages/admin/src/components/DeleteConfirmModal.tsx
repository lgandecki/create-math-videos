import React from "react";
import { useLessonHandlers } from "../handlers/lessonHandlers";
import { useLessonStore } from "../stores/LessonStore";

interface Props {
  isOpen: boolean;
  fileName: string;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  fileName,
  onCancel,
}: Props) {
  const { selectedFile } = useLessonStore();
  const { deleteLessonMutation } = useLessonHandlers();

  if (!isOpen || !selectedFile) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content delete-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title">Delete Lesson</h2>
        <div className="modal-body">
          <p className="delete-warning">
            Are you sure you want to delete <strong>"{fileName}"</strong>?
          </p>
          <p className="delete-warning-sub">This action cannot be undone.</p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            onClick={onCancel}
            className="modal-button modal-button-cancel"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => deleteLessonMutation.mutate({ name: selectedFile })}
            className="modal-button modal-button-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
