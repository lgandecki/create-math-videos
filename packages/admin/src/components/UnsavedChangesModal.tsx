interface Props {
  isOpen: boolean;
  fileName: string;
  onSave: () => Promise<void>;
  onDiscard: () => Promise<void>;
  onCancel: () => void;
}

export default function UnsavedChangesModal({
  isOpen,
  fileName,
  onSave,
  onDiscard,
  onCancel,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content unsaved-changes-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title">Unsaved Changes</h2>
        <div className="modal-body">
          <p className="unsaved-changes-warning">
            You have unsaved changes in <strong>"{fileName}"</strong>.
          </p>
          <p className="unsaved-changes-warning-sub">
            What would you like to do with your changes?
          </p>
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
            onClick={onDiscard}
            className="modal-button modal-button-danger"
          >
            Discard Changes
          </button>
          <button
            type="button"
            onClick={onSave}
            className="modal-button modal-button-primary"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
