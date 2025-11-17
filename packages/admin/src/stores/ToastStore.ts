import { create } from "zustand";
import { ToastData } from "../components/Toast/Toast";

interface ToastStore {
  toasts: ToastData[];
  addToast: (toast: ToastData) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, toast],
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),

  clearToasts: () => set(() => ({ toasts: [] })),
}));
