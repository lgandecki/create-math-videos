import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import { ObsidianStyleEditor } from "./ObsidianStyleEditor";

interface MarkdownPreviewModalProps {
  isOpen: boolean;
  content: string;
  fileName: string;
  onClose: () => void;
}

export default function MarkdownPreviewModal({
  isOpen,
  content,
  fileName,
  onClose,
}: MarkdownPreviewModalProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    if (!previewRef.current) return;

    const element = previewRef.current;

    const options = {
      margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
      filename: `${fileName.replace(/\.[^/.]+$/, "")}.pdf`,
      image: {
        type: "jpeg",
        quality: 0.98,
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
        backgroundColor: "#ffffff",
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: {
        mode: ["avoid-all", "css", "legacy"],
      },
    };

    html2pdf()
      .set(options)
      .from(element)
      .save()
      .catch((error) => {
        console.error("PDF generation failed:", error);
        // You could also show a user-friendly error message here
        alert("Failed to generate PDF. Please try again.");
      });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div
        className="modal-content markdown-preview-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title">Preview: {fileName}</h2>

        <div className="modal-body preview-content" ref={previewRef}>
          <ObsidianStyleEditor value={content} readOnly={true} />
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="modal-button modal-button-cancel"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="modal-button modal-button-primary"
          >
            <span className="button-icon">📄</span>
            Download as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
