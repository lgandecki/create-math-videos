import { queryClient, trpc } from "../utils/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLessonStore } from "../stores/LessonStore";
import { useBackgroundHandlers } from "./backgroundHandlers";
import { useLessonBackgroundStore } from "../stores/LessonBackgroundStore";
import { useToast } from "../hooks/useToast";

export const useLessonHandlers = (
  updateUrl?: (lesson: string | null) => void,
  onAIGeneratedLesson?: (lessonTitle: string) => void,
) => {
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const {
    selectedFile,
    setOriginalContent,
    setContent,
    setSelectedFile,
    modifiedFiles,
    setShowDeleteModal,
    setModifiedFiles,
    setIsEditingFileName,
  } = useLessonStore();
  const {
    setLessonBackgroundModalType,
    setBackgroundUrl,
    setShowLessonBackgroundModal,
  } = useLessonBackgroundStore();
  const {
    generateBackgroundMutation,
    backgroundQuery,
    deleteBackgroundMutation,
    renameBackgroundMutation,
  } = useBackgroundHandlers();

  const { showError, showSuccess } = useToast();

  const setSelectedFileWithUrl = (file: string | null) => {
    setSelectedFile(file);
    if (updateUrl) {
      updateUrl(file);
    }
  };

  const saveLessonMutation = useMutation({
    ...trpc.lessons.saveLesson.mutationOptions(),
    onSuccess: async (_data, variables) => {
      if (selectedFile) {
        await queryClient.invalidateQueries({
          queryKey: trpc.lessons.getLesson.queryKey({ name: selectedFile }),
        });

        setOriginalContent(variables.content);

        const next = new Set(modifiedFiles);
        next.delete(selectedFile);
        setModifiedFiles(next);

        const result = await backgroundQuery.refetch();

        if (result.data?.url && !result.data?.isConfirmed) {
          setBackgroundUrl(`${apiBaseUrl}${result.data.url}`);
          setLessonBackgroundModalType("confirm");
          setShowLessonBackgroundModal(true);
        }

        showSuccess("Lesson saved successfully!");
      }
    },
  });

  const lessonsListQuery = useQuery(trpc.lessons.list.queryOptions());

  const lessonQuery = useQuery({
    ...trpc.lessons.getLesson.queryOptions({ name: selectedFile! }),
    enabled: !!selectedFile,
  });

  const createLessonMutation = useMutation({
    ...trpc.lessons.createLesson.mutationOptions(),
    onSuccess: async (data) => {
      await lessonsListQuery.refetch();

      setSelectedFileWithUrl(data.fileName);

      showSuccess("Lesson created successfully!");

      // Trigger AI lesson generation immediately after lesson creation
      if (onAIGeneratedLesson) {
        onAIGeneratedLesson(data.fileName.replace(".md", ""));
      }

      // Generate background in the background (non-blocking)
      generateBackgroundMutation.mutateAsync({
        fileName: data.fileName,
        fileContent: data.fileName,
      });
    },
    onError: (error) => {
      showError(error.message || "Failed to create lesson");
    },
  });

  const deleteLessonMutation = useMutation({
    ...trpc.lessons.deleteLesson.mutationOptions(),
    onSuccess: async (_data, variables) => {
      // Refresh file list
      const { data: fileList } = await lessonsListQuery.refetch();

      const newModified = new Set(modifiedFiles);
      newModified.delete(selectedFile!);
      setModifiedFiles(newModified);

      // Load the first file if available
      if (fileList && fileList.length > 0) {
        setSelectedFileWithUrl(fileList[0]);
      } else {
        setSelectedFileWithUrl(null);
        setContent("");
        setOriginalContent("");
      }

      await deleteBackgroundMutation.mutateAsync({ fileName: variables.name });

      // Close the modal
      setShowDeleteModal(false);

      showSuccess("Lesson deleted successfully!");
    },
    onError: (error) => {
      showError(error.message || "Failed to delete file");
      setShowDeleteModal(false);
    },
  });

  const renameLessonMutation = useMutation({
    ...trpc.lessons.renameLesson.mutationOptions(),
    onSuccess: async (data, variables) => {
      // Refresh file list

      await renameBackgroundMutation.mutateAsync({
        oldName: variables.oldName,
        newName: variables.newName,
      });

      await lessonsListQuery.refetch();

      if (modifiedFiles.has(selectedFile!)) {
        const newModified = new Set(modifiedFiles);
        newModified.delete(selectedFile!);
        newModified.add(data.fileName);
        setModifiedFiles(newModified);
      }

      // Load the renamed file
      setSelectedFileWithUrl(data.fileName);
      setIsEditingFileName(false);

      showSuccess("Lesson renamed successfully!");
    },
    onError: (error) => {
      showError(error.message || "Failed to rename file");
    },
  });

  return {
    createLessonMutation,
    saveLessonMutation,
    deleteLessonMutation,
    lessonsListQuery,
    renameLessonMutation,
    lessonQuery,
  };
};
