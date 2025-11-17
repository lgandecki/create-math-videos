import { useLessonBackgroundStore } from "../../stores/LessonBackgroundStore";
import { useBackgroundHandlers } from "../../handlers/backgroundHandlers";
import { useLessonStore } from "../../stores/LessonStore";

export const GenerateLessonBackground = () => {
  const { isGenerating, setShowLessonBackgroundModal } =
    useLessonBackgroundStore();
  const { selectedFile, content } = useLessonStore();
  const { generateBackgroundMutation } = useBackgroundHandlers();

  if (!selectedFile || !content) {
    return null;
  }

  return (
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h2 className="modal-title">Generate Lesson Background</h2>
      <div className="modal-body">
        {isGenerating ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Generating background for lesson...</p>
          </div>
        ) : (
          <div>
            <p>
              Are you sure you want to generate a background for lesson{" "}
              <strong>{selectedFile}</strong>?
            </p>
            <p>This action cannot be undone.</p>
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
            {isGenerating ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
};
