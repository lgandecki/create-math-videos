import { useLessonBackgroundStore } from "../../stores/LessonBackgroundStore";
import { useBackgroundHandlers } from "../../handlers/backgroundHandlers";
import { useLessonStore } from "../../stores/LessonStore";

export const PreviewLessonBackground = () => {
  const { isGenerating, setShowLessonBackgroundModal, backgroundUrl } =
    useLessonBackgroundStore();
  const { selectedFile, content } = useLessonStore();
  const { generateBackgroundMutation } = useBackgroundHandlers();

  if (!selectedFile) {
    return null;
  }

  return (
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h2 className="modal-title">Preview Lesson Background</h2>
      <div className="modal-body">
        {isGenerating ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Generating background for lesson...</p>
          </div>
        ) : backgroundUrl ? (
          <div className="existing-image-container">
            <img src={backgroundUrl} alt={selectedFile} />
          </div>
        ) : (
          <div className="no-background-message">
            <p>No background image available for this lesson.</p>
          </div>
        )}
      </div>
      <div className="modal-footer">
        <div className="flex w-full justify-between">
          <button
            type="button"
            onClick={() => setShowLessonBackgroundModal(false)}
            className="modal-button modal-button-cancel"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              generateBackgroundMutation.mutate({
                fileName: selectedFile,
                fileContent: content,
              });
            }}
            className="modal-button modal-button-primary"
            disabled={isGenerating}
          >
            {isGenerating ? "Regenerating..." : "Regenerate"}
          </button>
        </div>
      </div>
    </div>
  );
};
