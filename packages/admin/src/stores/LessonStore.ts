import { create } from "zustand";

interface LessonState {
  selectedFile: string | null;
  content: string;
  originalContent: string;
  modifiedFiles: Set<string>;
  showDeleteModal: boolean;
  isEditingFileName: boolean;
  editedFileName: string;
  isDraftGenerating: boolean;

  setSelectedFile: (selectedFile: string | null) => void;
  setContent: (content: string) => void;
  setOriginalContent: (content: string) => void;
  setModifiedFiles: (modifiedFiles: Set<string>) => void;
  setShowDeleteModal: (showDeleteModal: boolean) => void;
  setIsEditingFileName: (isEditingFileName: boolean) => void;
  setEditedFileName: (editedFileName: string) => void;
  setIsDraftGenerating: (isDraftGenerating: boolean) => void;
}

export const useLessonStore = create<LessonState>((set) => ({
  selectedFile: null,
  content: "",
  originalContent: "",
  modifiedFiles: new Set(),
  showDeleteModal: false,
  isEditingFileName: false,
  editedFileName: "",
  isDraftGenerating: false,

  setSelectedFile: (selectedFile: string | null) => set({ selectedFile }),
  setContent: (content: string) => set({ content }),
  setOriginalContent: (originalContent: string) => set({ originalContent }),
  setModifiedFiles: (modifiedFiles: Set<string>) => set({ modifiedFiles }),
  setShowDeleteModal: (showDeleteModal: boolean) => set({ showDeleteModal }),
  setIsEditingFileName: (isEditingFileName: boolean) =>
    set({ isEditingFileName }),
  setEditedFileName: (editedFileName: string) => set({ editedFileName }),
  setIsDraftGenerating: (isDraftGenerating: boolean) =>
    set({ isDraftGenerating }),
}));
