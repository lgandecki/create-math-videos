import React from "react";

import { Toast, ToastData } from "./Toast";

interface ToastContainerProps {
  toasts: ToastData[];
  onRemoveToast: (id: string) => void;
  maxToasts?: number;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemoveToast,
  maxToasts = 5,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-1001 space-y-3">
      {toasts.map((toast, index) => {
        const overflowAmount = toasts.length - maxToasts;
        const shouldClose = overflowAmount > 0 && index < overflowAmount;

        return (
          <Toast
            key={toast.id}
            toast={toast}
            onClose={onRemoveToast}
            forceClose={shouldClose}
          />
        );
      })}
    </div>
  );
};
