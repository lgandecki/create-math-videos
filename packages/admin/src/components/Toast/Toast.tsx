import React, { useEffect, useState, useCallback, useRef } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastData {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastProps {
  toast: ToastData;
  onClose: (id: string) => void;
  forceClose?: boolean;
}

const TOAST_ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const TOAST_STYLES = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
};

const ICON_STYLES = {
  success: "text-green-500",
  error: "text-red-500",
  warning: "text-yellow-500",
  info: "text-blue-500",
};

const TOAST_DURATION = 5000;

export const Toast: React.FC<ToastProps> = ({
  toast,
  onClose,
  forceClose = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const closingRef = useRef(false);

  const Icon = TOAST_ICONS[toast.type];
  const duration = toast.duration ?? TOAST_DURATION;

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setIsExiting(true);

    setTimeout(() => {
      onClose(toast.id);
    }, 150);
  }, [onClose, toast.id]);

  useEffect(() => {
    setIsVisible(true);

    if (forceClose) {
      handleClose();
      return;
    }

    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, forceClose, handleClose]);

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border shadow-sm min-w-80 max-w-md transition-all duration-150 ease-in-out ${
        isVisible && !isExiting
          ? "translate-x-0 opacity-100"
          : "-translate-x-full opacity-0"
      } ${TOAST_STYLES[toast.type]}`}
      role="alert"
    >
      <Icon
        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${ICON_STYLES[toast.type]}`}
      />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <div className="font-medium text-sm mb-1">{toast.title}</div>
        )}
        <div className="text-sm">{toast.message}</div>
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-sm font-medium underline hover:no-underline focus:outline-none"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-0.5 rounded hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
