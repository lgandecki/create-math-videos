import { useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { v4 as uuid } from "uuid";

import { ToastData, ToastType } from "../components/Toast/Toast";
import { useToastStore } from "../stores/ToastStore";

const DEBOUNCE_WAIT = 2000;
const DEBOUNCE_OPTIONS = {
  leading: true,
  trailing: true,
  maxWait: 6000,
};

export interface ShowToastOptions {
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useToast = () => {
  const { addToast, removeToast } = useToastStore();

  const showToast = useCallback(
    (options: ShowToastOptions) => {
      const id = uuid();
      const toast: ToastData = {
        id,
        type: options.type || "info",
        title: options.title,
        message: options.message,
        duration: options.duration,
        action: options.action,
      };

      addToast(toast);
      return id;
    },
    [addToast],
  );

  const debouncedSuccess = useMemo(
    () =>
      debounce(
        (message: string, title?: string) =>
          showToast({ message, title, type: "success" }),
        DEBOUNCE_WAIT,
        DEBOUNCE_OPTIONS,
      ),
    [showToast],
  );

  const debouncedError = useMemo(
    () =>
      debounce(
        (message: string, title?: string) =>
          showToast({ message, title, type: "error" }),
        DEBOUNCE_WAIT,
        DEBOUNCE_OPTIONS,
      ),
    [showToast],
  );

  const debouncedWarning = useMemo(
    () =>
      debounce(
        (message: string, title?: string) =>
          showToast({ message, title, type: "warning" }),
        DEBOUNCE_WAIT,
        DEBOUNCE_OPTIONS,
      ),
    [showToast],
  );

  const debouncedInfo = useMemo(
    () =>
      debounce(
        (message: string, title?: string) =>
          showToast({ message, title, type: "info" }),
        DEBOUNCE_WAIT,
        DEBOUNCE_OPTIONS,
      ),
    [showToast],
  );

  return {
    showToast,
    showSuccess: debouncedSuccess,
    showError: debouncedError,
    showWarning: debouncedWarning,
    showInfo: debouncedInfo,
    removeToast,
  };
};
