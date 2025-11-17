import { useMutation, useQuery } from "@tanstack/react-query";
import { trpc } from "../utils/trpc";
import { useLessonBackgroundStore } from "../stores/LessonBackgroundStore";
import { useLessonStore } from "../stores/LessonStore";
import { useToast } from "../hooks/useToast";

export const useBackgroundHandlers = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const { selectedFile } = useLessonStore();
  const { showError, showSuccess } = useToast();

  const {
    setIsGenerating,
    setShowLessonBackgroundModal,
    setBackgroundUrl,
    setLessonBackgroundModalType,
  } = useLessonBackgroundStore();

  const generateBackgroundMutation = useMutation({
    ...trpc.lessonBackgrounds.generateBackground.mutationOptions(),
    onSuccess: async (_data) => {
      try {
        const result = await backgroundQuery.refetch();

        if (result.data) {
          setBackgroundUrl(`${apiBaseUrl}${result.data.url}`);
          setLessonBackgroundModalType("confirm");
        }

        showSuccess("Background generated successfully!");
      } catch (error) {
        // No proposed image found, continue normally
      }
    },
    onMutate: () => {
      setBackgroundUrl(null);
      setIsGenerating(true);
    },
    onError: (error) => {
      showError(error.message || "Failed to create lesson background file");
    },
    onSettled: () => {
      setIsGenerating(false);
    },
  });

  const renameBackgroundMutation = useMutation({
    ...trpc.lessonBackgrounds.renameBackground.mutationOptions(),
    onSuccess: () => {},
  });

  const deleteBackgroundMutation = useMutation({
    ...trpc.lessonBackgrounds.deleteBackground.mutationOptions(),
    onSuccess: () => {
      showSuccess("Background deleted successfully!");
    },
    onError: (error) => {
      showError(error.message || "Failed to delete lesson background.");
    },
  });

  const confirmBackgroundMutation = useMutation({
    ...trpc.lessonBackgrounds.confirmBackground.mutationOptions(),
    onSuccess: async () => {
      await backgroundQuery.refetch();
      setShowLessonBackgroundModal(false);
      showSuccess("Background confirmed successfully!");
    },
    onError: () => {
      showError("Failed to confirm background image");
    },
  });

  const backgroundQuery = useQuery({
    ...trpc.lessonBackgrounds.getBackground.queryOptions({
      fileName: selectedFile || "",
    }),
    enabled: !!selectedFile,
  });

  return {
    generateBackgroundMutation,
    deleteBackgroundMutation,
    confirmBackgroundMutation,
    backgroundQuery,
    renameBackgroundMutation,
  };
};
