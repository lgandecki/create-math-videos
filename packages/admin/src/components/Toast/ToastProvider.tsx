import React from "react";

import { ToastContainer } from "./ToastContainer";
import { useToastStore } from "../../stores/ToastStore";

export const ToastProvider: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return <ToastContainer toasts={toasts} onRemoveToast={removeToast} />;
};
