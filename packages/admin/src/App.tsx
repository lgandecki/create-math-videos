import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { v4 as uuid } from "uuid";
import { useParams, useNavigate } from "react-router-dom";

import FileList from "./components/FileList";
import ObsidianStyleEditor from "./components/ObsidianStyleEditor";
import ChatPanel from "./components/ChatPanel";
import DiffPreview from "./components/DiffPreview";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import UnsavedChangesModal from "./components/UnsavedChangesModal";
import MarkdownPreviewModal from "./components/MarkdownPreviewModal";
import ResizeHandle from "./components/ResizeHandle";
import MobileFileSelector from "./components/MobileFileSelector";
import { ActionButtons } from "./components/ActionButtons";
import { FileTitle } from "./components/FileTitle";
import { useTRPCSubscription } from "./hooks/useTRPCSubscription";
import { useResizablePanels } from "./hooks/useResizablePanels";
import { useIsMobile, useIsTablet } from "./hooks/useMediaQuery";
import { decodeFileName } from "./utils/fileNameEncoder";
import { createSlug, findLessonBySlug } from "./utils/slugUtils";
import { useLessonBackgroundStore } from "./stores/LessonBackgroundStore";
import { trpc } from "./utils/trpc";
import { useBackgroundHandlers } from "./handlers/backgroundHandlers";
import { useLessonStore } from "./stores/LessonStore";
import { useLessonHandlers } from "./handlers/lessonHandlers";
import { LessonBackgroundModal } from "./components/LessonBackgroundModal/LessonBackgroundModal";
import { useToast } from "./hooks/useToast";
import { lessonTemplate } from "./shared/lessonTemplate";
import DraftGeneratingModal from "./components/DraftGeneratingModal";

const removeFirst2Lines = (input: string) => {
  const lines = input.split("\n");
  return lines.slice(2).join("\n");
};

// Simple Levenshtein distance implementation
function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + 1, // substitution
        );
      }
    }
  }
  return matrix[a.length][b.length];
}

// Returns similarity between 0 and 1
function similarity(a: string, b: string): number {
  if (!a.length && !b.length) return 1;
  const distance = levenshtein(a, b);
  return 1 - distance / Math.max(a.length, b.length);
}

function App() {
  const { widths, updateFilePanel, updateChatPanel } = useResizablePanels();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const sessionId = uuid();
  const { lessonName } = useParams<{ lessonName: string }>();
  const navigate = useNavigate();

  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const [proposedDiff, setProposedDiff] = useState<string | null>(null);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [pendingFileToLoad, setPendingFileToLoad] = useState<string | null>(
    null,
  );
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);

  const chatPanelRef = useRef<any>(null);
  const processingFileRef = useRef<string | null>(null);

  const {
    selectedFile,
    content,
    originalContent,
    modifiedFiles,
    showDeleteModal,
    isEditingFileName,
    editedFileName,
    isDraftGenerating,
    setSelectedFile,
    setContent,
    setOriginalContent,
    setModifiedFiles,
    setShowDeleteModal,
    setIsEditingFileName,
    setEditedFileName,
    setIsDraftGenerating,
  } = useLessonStore();

  const contentRef = useRef(content);

  const {
    setLessonBackgroundModalType,
    setShowLessonBackgroundModal,
    showLessonBackgroundModal,
    setBackgroundUrl,
  } = useLessonBackgroundStore();

  const { showError, showSuccess } = useToast();

  const updateUrl = (lesson: string | null) => {
    if (lesson) {
      const lessonNameWithoutExt = lesson.endsWith(".md")
        ? lesson.slice(0, -3)
        : lesson;
      const slug = createSlug(lessonNameWithoutExt);
      const newPath = `/lessons/${slug}`;

      console.log("Navigating to:", newPath);
      navigate(newPath, { replace: false }); // Use replace: false to add to history
    } else {
      console.log("Navigating to home");
      navigate("/", { replace: false });
    }
  };

  // Function to handle lesson creation and trigger AI generation
  const handleAIGeneratedLesson = (lessonTitle: string) => {
    const lessonFileName = lessonTitle + ".md";

    setContent(lessonTemplate);

    const prompt = `Please create a comprehensive lesson for the title: "${lessonTitle}". 

Generate complete lesson content including:
- Clear introduction explaining learning objectives
- Well-structured main content sections 
- Practical examples and explanations
- Interactive elements using "User Interaction:" and "Action:" blocks
- Use LaTeX for any mathematical formulas: $$formula$$
- Summary or conclusion

Make it engaging and educational. Replace the current content entirely with the new lesson.`;

    // Call handleAIEdit directly with the NEW file name and initial content
    handleAIEdit(prompt, lessonFileName, lessonTemplate);
    setIsDraftGenerating(true);
  };

  const {
    saveLessonMutation,
    renameLessonMutation,
    lessonsListQuery,
    lessonQuery,
  } = useLessonHandlers(updateUrl, handleAIGeneratedLesson);

  const { backgroundQuery } = useBackgroundHandlers();

  const handleFilePanelResize = (deltaX: number) => {
    const containerWidth = window.innerWidth;
    const deltaPercentage = (deltaX / containerWidth) * 100;
    updateFilePanel(widths.filePanel + deltaPercentage);
  };

  const handleChatPanelResize = (deltaX: number) => {
    const containerWidth = window.innerWidth;
    const deltaPercentage = (deltaX / containerWidth) * 100;
    updateChatPanel(widths.chatPanel - deltaPercentage); // negative because we're resizing from the left
  };

  const loadFile = async (file: string) => {
    // Do nothing if clicking on the currently selected file
    if (selectedFile === file) {
      return;
    }

    if (
      selectedFile &&
      originalContent !== content &&
      !modifiedFiles.has(selectedFile)
    ) {
      const newModified = new Set(modifiedFiles);
      newModified.add(selectedFile);
      setModifiedFiles(newModified);
    }

    // If current file has unsaved changes, show modal
    if (selectedFile && modifiedFiles.has(selectedFile)) {
      setPendingFileToLoad(file);
      setShowUnsavedChangesModal(true);
      return;
    }

    setSelectedFile(file);

    console.log("PINGWING resetting chat panel messages");
    chatPanelRef.current?.resetMessages();

    updateUrl(file);
  };

  // auto-select lesson from URL or first lesson
  useEffect(() => {
    if (
      lessonsListQuery.data &&
      Array.isArray(lessonsListQuery.data) &&
      lessonsListQuery.data.length &&
      !selectedFile
    ) {
      const lessonFromUrl = lessonName
        ? findLessonBySlug(lessonName, lessonsListQuery.data)
        : null;
      const lessonToSelect = lessonFromUrl || lessonsListQuery.data[0];

      setSelectedFile(lessonToSelect);

      // Update URL if we selected a lesson that wasn't in the URL
      if (lessonToSelect !== lessonFromUrl) {
        updateUrl(lessonToSelect);
      }
    }
  }, [lessonsListQuery.data, selectedFile, lessonName, navigate]);

  // react to new content
  useEffect(() => {
    if (lessonQuery.data) {
      setContent(lessonQuery.data.content);
      setOriginalContent(lessonQuery.data.content);
      setProposedDiff(null);
    }
  }, [lessonQuery.data?.content]);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  const saveFile = async () => {
    if (!selectedFile) return;

    await saveLessonMutation.mutateAsync({
      name: selectedFile,
      content,
    });
  };

  const renameFile = () => {
    if (!selectedFile || !editedFileName.trim()) return;
    renameLessonMutation.mutate({
      oldName: selectedFile,
      newName: editedFileName.trim(),
    });
  };

  const handleContentChange = (newContent: string, fileNameToSave?: string) => {
    setContent(newContent);

    const fileToSave = fileNameToSave || selectedFile;

    if (fileToSave) {
      saveLessonMutation.mutateAsync({
        name: fileToSave,
        content: newContent,
      });

      const isModified = newContent !== originalContent;
      const newModified = new Set(modifiedFiles);

      if (isModified) {
        newModified.add(fileToSave);
      } else {
        newModified.delete(fileToSave);
      }
      // setModifiedFiles(newModified);
    }
  };

  const closeModalAndReset = () => {
    setShowUnsavedChangesModal(false);
    setPendingFileToLoad(null);
  };

  const handleUnsavedChangesSave = async () => {
    if (selectedFile) {
      await saveFile();
    }
    if (pendingFileToLoad) {
      setSelectedFile(pendingFileToLoad);
      updateUrl(pendingFileToLoad);
    }
    closeModalAndReset();
  };

  const handleUnsavedChangesDiscard = async () => {
    if (selectedFile) {
      const newModified = new Set(modifiedFiles);
      newModified.delete(selectedFile);
      setModifiedFiles(newModified);
    }
    if (pendingFileToLoad) {
      setSelectedFile(pendingFileToLoad);
      updateUrl(pendingFileToLoad);
    }
    closeModalAndReset();
  };

  const handleUnsavedChangesCancel = () => {
    closeModalAndReset();
  };

  // State for buffering streams until we know the response type
  const [bufferedReasoning, setBufferedReasoning] = useState<string>("");
  const [bufferedAnswerChunks, setBufferedAnswerChunks] = useState<string[]>(
    [],
  );
  // Use ref to avoid closure issues with responseType
  const responseTypeRef = useRef<"answer" | "edit" | null>(null);
  // Use ref for cleanup function to avoid stale closure
  const cleanupRef = useRef<(() => void) | null>(null);

  // TRPC subscription setup
  const { sendAIEdit, cleanup } = useTRPCSubscription({
    onReasoning: (reasoning) => {
      console.log(
        "onReasoning received",
        reasoning.slice(0, 10),
        "responseTypeRef:",
        responseTypeRef.current,
      );
      if (responseTypeRef.current === "edit") {
        // Show reasoning immediately for edits
        console.log("onReasoning inside edit", reasoning.slice(0, 10));
        chatPanelRef.current?.showReasoning(reasoning);
      } else if (responseTypeRef.current === null) {
        console.log("onReasoning inside null", reasoning.slice(0, 10));
        // Buffer reasoning until we know the type
        setBufferedReasoning(reasoning);
      }
    },
    onAnswerChunk: (chunk) => {
      console.log(
        "onAnswerChunk",
        chunk,
        "responseTypeRef:",
        responseTypeRef.current,
        "chatPanelRef:",
        chatPanelRef.current,
      );
      if (responseTypeRef.current === "answer") {
        // Append chunk to existing message
        if (chatPanelRef.current) {
          chatPanelRef.current.appendToLastAssistantMessage(chunk);
        } else {
          console.error("chatPanelRef.current is null!");
        }
      } else if (responseTypeRef.current === null) {
        // Buffer chunks until we know the type
        setBufferedAnswerChunks((prev) => [...prev, chunk]);
      }
    },
    onResponseType: (type) => {
      console.log("onResponseType", type);
      responseTypeRef.current = type;

      if (type === "answer") {
        console.log("onResponseType inside answer", type, bufferedAnswerChunks);
        // It's a question - hide reasoning and show buffered answer chunks
        chatPanelRef.current?.hideReasoning();
        // Append all buffered chunks
        bufferedAnswerChunks.forEach((chunk) => {
          chatPanelRef.current?.appendToLastAssistantMessage(chunk);
        });
      } else if (type === "edit") {
        console.log("onResponseType inside edit", type);
        // It's an edit - show the last buffered reasoning
        if (bufferedReasoning) {
          console.log("onResponseType inside edit buffered", bufferedReasoning);
          chatPanelRef.current?.showReasoning(bufferedReasoning);
        } else {
          console.log("onResponseType inside edit no buffered");
        }
      }

      // Clear buffers
      setBufferedReasoning("");
      setBufferedAnswerChunks([]);
    },
    onResponseComplete: (modifiedContent) => {
      console.log("onResponseComplete", modifiedContent);

      // Get the file name from the ref, NOT from state
      const fileNameProcessed = processingFileRef.current;

      // Add a guard in case the ref is empty
      if (!fileNameProcessed) {
        showError("Error: Could not determine which file to save.");
        setIsDraftGenerating(false);
        return;
      }

      setIsDraftGenerating(false);
      chatPanelRef.current?.hideReasoning();

      const currentContentIsInitialDraft =
        similarity(lessonTemplate, removeFirst2Lines(contentRef.current)) >
        0.95;

      if (currentContentIsInitialDraft) {
        // Pass the correct file name from the ref to the handler
        handleContentChange(modifiedContent, fileNameProcessed);
      } else {
        setProposedDiff(modifiedContent);
      }

      if (currentContentIsInitialDraft) {
        chatPanelRef.current?.addAssistantMessage("Your draft is ready!");
      } else {
        chatPanelRef.current?.addAssistantMessage(
          "Changes proposed. Review the diff preview.",
        );
      }

      responseTypeRef.current = null;
      processingFileRef.current = null;
    },
    onAnswerComplete: (fullAnswer) => {
      console.log("onAnswerComplete", fullAnswer);
      // Answer is already shown via chunks - just reset state
      responseTypeRef.current = null;
    },
    onResponseDelta: (delta) => {
      // Optional: show streaming progress
    },
    onError: (error) => {
      console.log("onError", error);
      chatPanelRef.current?.hideReasoning();
      chatPanelRef.current?.addAssistantMessage(`Error: ${error}`);
      responseTypeRef.current = null;
      setIsDraftGenerating(false);
      setBufferedReasoning("");
      setBufferedAnswerChunks([]);
    },
  });

  // Store cleanup in ref to keep it current
  cleanupRef.current = cleanup;

  const handleAIEdit = async (
    prompt: string,
    fileName: string,
    fileContent: string,
    attachedFile?: File,
  ) => {
    if (!fileName) return;

    processingFileRef.current = fileName;

    sendAIEdit({
      sessionId,
      prompt,
      fileContent,
      fileName,
      attachedFile,
    });
  };

  const applyDiff = () => {
    if (proposedDiff) {
      handleContentChange(proposedDiff);
    }
    setProposedDiff(null);
  };

  // ToDo: Open on local dev environment localhost preview on port 5174
  const openPreview = async () => {
    if (!selectedFile) return;

    // Auto-save if there are unsaved changes
    if (modifiedFiles.has(selectedFile)) {
      try {
        await saveLessonMutation.mutateAsync({
          name: selectedFile,
          content,
        });
      } catch (error) {
        showError("Failed to save lesson before opening preview");
        return;
      }
    }

    const decodedName = decodeFileName(selectedFile);
    const slug = createSlug(decodedName);
    const isLocalhost = window.location.hostname === "localhost";
    const previewUrl = isLocalhost
      ? `http://${slug}.localhost:5174/`
      : `https://${slug}.lessonplayer.org/`;

    window.open(previewUrl, "_blank");
  };

  const uploadImageMutation = useMutation({
    ...trpc.uploads.uploadImage.mutationOptions(),
    onSuccess: () => {
      showSuccess("Image uploaded successfully!");
    },
    onError: (error) => {
      if (error.message.includes("exceeds 10MB")) {
        showError("The image cannot be uploaded because it is too large!");
      } else {
        showError(error.message || "Upload failed");
      }
    },
  });

  const uploadVideoMutation = useMutation({
    ...trpc.uploads.uploadVideo.mutationOptions(),
    onSuccess: () => {
      showSuccess("Video uploaded successfully!");
    },
    onError: (error) => {
      if (error.message.includes("exceeds 100MB")) {
        showError("The video cannot be uploaded because it is too large!");
      } else {
        showError(error.message || "Upload failed");
      }
    },
  });

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const result = await uploadImageMutation.mutateAsync(formData);

    // Construct full URL with base URL
    return `${apiBaseUrl}${result.url}`;
  };

  const uploadVideo = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("video", file);

    const result = await uploadVideoMutation.mutateAsync(formData);

    // Construct full URL with base URL
    return `${apiBaseUrl}${result.url}`;
  };

  // Add beforeunload warning for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (modifiedFiles.size > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      cleanupRef.current?.(); // Clean up TRPC subscription using ref
    };
  }, [modifiedFiles]);

  const handleBackgroundModal = () => {
    const response = backgroundQuery.data;

    if (!response) return;

    if (response.url && response.isConfirmed) {
      setLessonBackgroundModalType("preview");
      setBackgroundUrl(`${apiBaseUrl}${response.url}`);
    } else if (response.url && !response.isConfirmed) {
      setLessonBackgroundModalType("confirm");
      setBackgroundUrl(`${apiBaseUrl}${response.url}`);
    } else {
      setLessonBackgroundModalType("generate");
    }

    setShowLessonBackgroundModal(true);
  };

  const openMarkdownPreview = () => {
    setShowMarkdownPreview(true);
  };

  const closeMarkdownPreview = () => {
    setShowMarkdownPreview(false);
  };

  const handleChatSend = (prompt: string, file?: File) => {
    if (!selectedFile) return;
    handleAIEdit(prompt, selectedFile, content, file);
  };

  return (
    <div
      className={`app-container ${isMobile ? "mobile" : isTablet ? "tablet" : "desktop"}`}
    >
      {proposedDiff ? (
        <DiffPreview
          original={content}
          modified={proposedDiff}
          onApply={applyDiff}
          onCancel={() => setProposedDiff(null)}
        />
      ) : isMobile ? (
        <>
          <div className="mobile-header">
            <div className="mobile-file-selector-container">
              <MobileFileSelector
                files={lessonsListQuery.data || []}
                onSelect={loadFile}
                onAIGeneratedLesson={handleAIGeneratedLesson}
                updateUrl={updateUrl}
              />
            </div>

            <div className="mobile-actions">
              <ActionButtons
                variant="mobile"
                onDelete={() => setShowDeleteModal(true)}
                onPreview={openPreview}
                onGenerateBackground={handleBackgroundModal}
                onChatToggle={() => setIsChatVisible(!isChatVisible)}
                isChatVisible={isChatVisible}
                onMarkdownPreview={openMarkdownPreview}
              />
            </div>
          </div>

          <div className="mobile-content">
            <FileTitle
              isEditingFileName={isEditingFileName}
              editedFileName={editedFileName}
              variant="mobile"
              onEditStart={() => {
                if (!selectedFile) return;

                setIsEditingFileName(true);
                setEditedFileName(decodeFileName(selectedFile));
              }}
              onEditChange={setEditedFileName}
              onEditComplete={renameFile}
              onEditCancel={() => {
                if (!selectedFile) return;

                setIsEditingFileName(false);
                setEditedFileName(decodeFileName(selectedFile));
              }}
              decodeFileName={decodeFileName}
            />

            {lessonQuery.isLoading ? (
              <div className="spinner-container">
                <div className="spinner" />
              </div>
            ) : (
              <ObsidianStyleEditor
                key={selectedFile}
                value={content}
                onChange={handleContentChange}
                onSave={saveFile}
                uploadImage={uploadImage}
                uploadVideo={uploadVideo}
              />
            )}
          </div>

          {isChatVisible && (
            <>
              <div className="mobile-chat-overlay">
                <button
                  className="close-chat-button"
                  onClick={() => setIsChatVisible(false)}
                >
                  ✕
                </button>
                <ChatPanel
                  ref={chatPanelRef}
                  onSend={handleChatSend}
                  className="mobile-chat-panel"
                />
              </div>
              <div
                className="mobile-chat-backdrop"
                onClick={() => setIsChatVisible(false)}
              />
            </>
          )}
        </>
      ) : isTablet ? (
        <>
          <div className="tablet-header">
            <MobileFileSelector
              files={lessonsListQuery.data || []}
              onSelect={loadFile}
              onAIGeneratedLesson={handleAIGeneratedLesson}
              updateUrl={updateUrl}
            />
            <div className="tablet-actions">
              <ActionButtons
                variant="tablet"
                onDelete={() => setShowDeleteModal(true)}
                onPreview={openPreview}
                onGenerateBackground={handleBackgroundModal}
                onMarkdownPreview={openMarkdownPreview}
              />
            </div>
          </div>

          <div className="tablet-content">
            <FileTitle
              isEditingFileName={isEditingFileName}
              editedFileName={editedFileName}
              variant="tablet"
              onEditStart={() => {
                if (!selectedFile) return;

                setIsEditingFileName(true);
                setEditedFileName(decodeFileName(selectedFile));
              }}
              onEditChange={setEditedFileName}
              onEditComplete={renameFile}
              onEditCancel={() => {
                if (!selectedFile) return;

                setIsEditingFileName(false);
                setEditedFileName(decodeFileName(selectedFile));
              }}
              decodeFileName={decodeFileName}
            />

            <div className="tablet-editor-chat-layout">
              <div className="tablet-editor-panel">
                {lessonQuery.isLoading ? (
                  <div className="spinner-container">
                    <div className="spinner" />
                  </div>
                ) : (
                  <ObsidianStyleEditor
                    key={selectedFile}
                    value={content}
                    onChange={handleContentChange}
                    onSave={saveFile}
                    uploadImage={uploadImage}
                    uploadVideo={uploadVideo}
                  />
                )}
              </div>
              <ResizeHandle onResize={handleChatPanelResize} />

              <ChatPanel
                className="tablet-chat-panel"
                ref={chatPanelRef}
                onSend={handleChatSend}
                style={{ width: `${widths.chatPanel}%` }}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <FileList
            files={lessonsListQuery.data || []}
            onSelect={loadFile}
            onAIGeneratedLesson={handleAIGeneratedLesson}
            updateUrl={updateUrl}
            style={{ width: `${widths.filePanel}%` }}
          />
          <ResizeHandle onResize={handleFilePanelResize} />
          <div className="editor-panel">
            <>
              {selectedFile && (
                <div className="editor-header">
                  <FileTitle
                    isEditingFileName={isEditingFileName}
                    editedFileName={editedFileName}
                    variant="desktop"
                    onEditStart={() => {
                      if (!selectedFile) return;

                      setIsEditingFileName(true);
                      setEditedFileName(decodeFileName(selectedFile));
                    }}
                    onEditChange={setEditedFileName}
                    onEditComplete={renameFile}
                    onEditCancel={() => {
                      if (!selectedFile) return;

                      setIsEditingFileName(false);
                      setEditedFileName(decodeFileName(selectedFile));
                    }}
                    decodeFileName={decodeFileName}
                  />
                  <div className="editor-actions">
                    <ActionButtons
                      variant="desktop"
                      onDelete={() => setShowDeleteModal(true)}
                      onPreview={openPreview}
                      onGenerateBackground={handleBackgroundModal}
                      onMarkdownPreview={openMarkdownPreview}
                    />
                  </div>
                </div>
              )}
              {lessonQuery.isLoading ? (
                <div className="spinner-container">
                  <div className="spinner" />
                </div>
              ) : (
                <ObsidianStyleEditor
                  key={selectedFile}
                  value={content}
                  onChange={handleContentChange}
                  onSave={saveFile}
                  uploadImage={uploadImage}
                  uploadVideo={uploadVideo}
                />
              )}
            </>
          </div>
          <ResizeHandle onResize={handleChatPanelResize} />
          <ChatPanel
            ref={chatPanelRef}
            onSend={handleChatSend}
            style={{ width: `${widths.chatPanel}%` }}
          />
        </>
      )}
      {selectedFile && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          fileName={decodeFileName(selectedFile)}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
      {selectedFile && (
        <UnsavedChangesModal
          isOpen={showUnsavedChangesModal}
          fileName={decodeFileName(selectedFile)}
          onSave={handleUnsavedChangesSave}
          onDiscard={handleUnsavedChangesDiscard}
          onCancel={handleUnsavedChangesCancel}
        />
      )}
      {selectedFile && showLessonBackgroundModal && <LessonBackgroundModal />}
      {selectedFile && (
        <MarkdownPreviewModal
          isOpen={showMarkdownPreview}
          content={content}
          fileName={decodeFileName(selectedFile)}
          onClose={closeMarkdownPreview}
        />
      )}
      {isDraftGenerating && <DraftGeneratingModal isOpen={isDraftGenerating} />}
    </div>
  );
}

export default App;
