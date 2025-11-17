import { useLessonBackgroundStore } from "../../stores/LessonBackgroundStore";
import { GenerateLessonBackground } from "./GenerateLessonBackgroundModal";
import { ConfirmLessonBackground } from "./ConfirmLessonBackgroundModal";
import { PreviewLessonBackground } from "./PreviewLessonBackgroundModal";

export const LessonBackgroundModal = () => {
  const {
    showLessonBackgroundModal,
    setShowLessonBackgroundModal,
    lessonBackgroundModalType,
  } = useLessonBackgroundStore();

  if (!showLessonBackgroundModal) {
    return null;
  }

  return (
    <div
      className="modal-overlay"
      onClick={() => setShowLessonBackgroundModal(false)}
    >
      {lessonBackgroundModalType === "generate" && <GenerateLessonBackground />}
      {lessonBackgroundModalType === "confirm" && <ConfirmLessonBackground />}
      {lessonBackgroundModalType === "preview" && <PreviewLessonBackground />}
    </div>
  );
};
