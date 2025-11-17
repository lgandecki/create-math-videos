import { useState, useEffect, useCallback } from "react";

interface PanelWidths {
  filePanel: number;
  chatPanel: number;
}

const DEFAULT_WIDTHS: PanelWidths = {
  filePanel: 15,
  chatPanel: 30,
};

const MIN_WIDTHS = {
  filePanel: 10,
  chatPanel: 20,
  editorPanel: 40,
};

const MAX_WIDTHS = {
  filePanel: 20,
  chatPanel: 50,
  editorPanel: 70,
};

const STORAGE_KEY = "lesson-editor-panel-widths";

export function useResizablePanels() {
  const [widths, setWidths] = useState<PanelWidths>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);

        if (
          typeof parsed.filePanel === "number" &&
          typeof parsed.chatPanel === "number" &&
          parsed.filePanel >= MIN_WIDTHS.filePanel &&
          parsed.filePanel <= MAX_WIDTHS.filePanel &&
          parsed.chatPanel >= MIN_WIDTHS.chatPanel &&
          parsed.chatPanel <= MAX_WIDTHS.chatPanel &&
          // Ensure total width leaves room for editor
          parsed.filePanel + parsed.chatPanel <= 100 - MIN_WIDTHS.editorPanel
        ) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn("Failed to load panel widths from localStorage:", error);
    }
    return DEFAULT_WIDTHS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(widths));
    } catch (error) {
      console.warn("Failed to save panel widths to localStorage:", error);
    }
  }, [widths]);

  const updateFilePanel = useCallback((newWidth: number) => {
    setWidths((prev) => {
      const maxAllowedWidth = Math.min(
        MAX_WIDTHS.filePanel,
        100 - prev.chatPanel - MIN_WIDTHS.editorPanel,
      );

      const clampedWidth = Math.max(
        MIN_WIDTHS.filePanel,
        Math.min(maxAllowedWidth, newWidth),
      );

      return {
        ...prev,
        filePanel: clampedWidth,
      };
    });
  }, []);

  const updateChatPanel = useCallback((newWidth: number) => {
    setWidths((prev) => {
      const maxAllowedWidth = Math.min(
        MAX_WIDTHS.chatPanel,
        100 - prev.filePanel - MIN_WIDTHS.editorPanel,
      );

      const clampedWidth = Math.max(
        MIN_WIDTHS.chatPanel,
        Math.min(maxAllowedWidth, newWidth),
      );

      return {
        ...prev,
        chatPanel: clampedWidth,
      };
    });
  }, []);

  const editorPanelWidth = 100 - widths.filePanel - widths.chatPanel;

  return {
    widths: {
      ...widths,
      editorPanel: editorPanelWidth,
    },
    updateFilePanel,
    updateChatPanel,
  };
}
