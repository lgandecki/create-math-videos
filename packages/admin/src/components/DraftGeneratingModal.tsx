import React, { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
}

export default function DraftGeneratingModal({ isOpen }: Props) {
  const [extraMessage, setExtraMessage] = useState<string | null>(null);
  const [showExtraMessage, setShowExtraMessage] = useState(false);
  const [showSecondMessage, setShowSecondMessage] = useState(false);

  useEffect(() => {
    const preventByReload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", preventByReload);

    return () => {
      if (isOpen) {
        window.removeEventListener("beforeunload", preventByReload);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setShowExtraMessage(false);
      setShowSecondMessage(false);
      return;
    }

    const timer1 = setTimeout(() => {
      setExtraMessage(
        "It takes more time than usual, but no worries, I'm working on it!",
      );
    }, 20000); // 20 seconds

    const timer2 = setTimeout(() => {
      setExtraMessage("Wow, this lesson seems huge. It's almost finished!");
    }, 40000); // 40 seconds

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay bg-black">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Lesson Draft Generation</h2>
        <div className="modal-body">
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>We're generating your lesson draft...</p>
            <p>Please wait.</p>
            {extraMessage && (
              <p
                style={{
                  marginTop: "10px",
                  fontStyle: "italic",
                  color: "#888",
                }}
              >
                {extraMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
