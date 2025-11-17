import { useLessonBackgroundStore } from "../../stores/LessonBackgroundStore";
import { useBackgroundHandlers } from "../../handlers/backgroundHandlers";
import { useLessonStore } from "../../stores/LessonStore";
import { decodeFileName } from "../../utils/fileNameEncoder";

export const ConfirmLessonBackground = () => {
  const { isGenerating, setShowLessonBackgroundModal, backgroundUrl } =
    useLessonBackgroundStore();
  const { selectedFile, content } = useLessonStore();
  const { generateBackgroundMutation, confirmBackgroundMutation } =
    useBackgroundHandlers();

  if (!selectedFile) {
    return null;
  }

  return (
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h2 className="modal-title">Confirm Lesson Background</h2>
      <div className="modal-body">
        {isGenerating ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Generating background for lesson...</p>
          </div>
        ) : (
          <div>
            {backgroundUrl ? (
              <>
                <p>
                  A background image has been generated for lesson{" "}
                  <strong>{decodeFileName(selectedFile)}</strong>.
                </p>
                <div className="existing-image-container">
                  <img
                    src={`${backgroundUrl}&cache=${Math.random()}`}
                    alt={selectedFile}
                  />
                </div>
                <p>Do you want to use this image?</p>
              </>
            ) : (
              <p>
                No background image could be generated for lesson{" "}
                <strong>{decodeFileName(selectedFile)}</strong>. Please try
                regenerating.
              </p>
            )}
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
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                confirmBackgroundMutation.mutate({ fileName: selectedFile });
              }}
              className="modal-button modal-button-primary"
              disabled={isGenerating}
            >
              Confirm
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
    </div>
  );
};
