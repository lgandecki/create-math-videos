import React, { useState, useRef, useEffect, memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { defaultSchema } from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import LaTeXEditor from "./LaTeXEditor";
import { formatSpecialCode } from "../utils/formatSpecialCode";

const USER_INTERACTION_TEMPLATE = `// Example - Choose one:
askForEstimation({ question: "TYPE_YOUR_QUESTION_HERE", expect: "TYPE_THE_EXPECTED_ANSWER" })
ask({ question: "TYPE_YOUR_QUESTION_HERE", expect: "TYPE_THE_EXPECTED_ANSWER" })`;
const ACTION_TEMPLATE = `// Example:
setDinoScale(1);`;

const MemoizedVideoComponent = memo(
  ({
    src,
    alt,
    ...props
  }: React.VideoHTMLAttributes<HTMLVideoElement> & {
    src: string;
    alt?: string;
  }) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleLoadStart = () => setLoading(true);
    const handleCanPlay = () => setLoading(false);
    const handleError = () => {
      setError(true);
      setLoading(false);
    };

    if (error) {
      return (
        <span
          style={{
            display: "inline-block",
            width: "100%",
            padding: "16px",
            backgroundColor: "#f8f9fa",
            borderRadius: "6px",
            textAlign: "center",
            color: "#6c757d",
            margin: "16px auto",
          }}
        >
          Unable to load video: {alt || "Unknown video"}
        </span>
      );
    }

    return (
      <>
        {loading && (
          <span
            style={{
              display: "inline-block",
              width: "100%",
              textAlign: "center",
              padding: "16px",
              backgroundColor: "#f8f9fa",
              borderRadius: "6px",
              color: "#6c757d",
              margin: "16px 0",
            }}
          >
            Loading video...
          </span>
        )}
        <video
          {...props}
          src={src}
          controls
          style={{
            maxWidth: "100%",
            width: "100%",
            height: "auto",
            display: "block",
            borderRadius: "6px",
            margin: "16px auto",
          }}
          preload="metadata"
          onLoadStart={handleLoadStart}
          onCanPlay={handleCanPlay}
          onError={handleError}
        >
          Your browser does not support the video tag.
        </video>
      </>
    );
  },
);

const MemoizedImageComponent = memo(
  ({
    node,
    src,
    alt,
    apiBaseUrl,
    readOnly,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    node: React.ReactNode;
    src: string;
    alt?: string;
    apiBaseUrl: string;
    readOnly: boolean;
  }) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleLoad = () => setLoading(false);
    const handleError = () => {
      setError(true);
      setLoading(false);
    };

    let mediaSrc = src;
    if (src && src.startsWith("../uploads/")) {
      mediaSrc = `${apiBaseUrl}/uploads/${src.replace("../uploads/", "")}`;
    }

    // Check if the file is a video based on its extension
    const videoExtensions = [
      ".mp4",
      ".webm",
      ".ogg",
      ".avi",
      ".mov",
      ".wmv",
      ".flv",
      ".mkv",
    ];
    const isVideo =
      src && videoExtensions.some((ext) => src.toLowerCase().endsWith(ext));

    if (isVideo) {
      // Skip videos in readOnly mode (PDF preview)
      if (readOnly) {
        return null;
      }
      return <MemoizedVideoComponent src={mediaSrc} alt={alt} />;
    }

    if (error) {
      return (
        <span
          style={{
            display: "inline-block",
            maxWidth: "500px",
            width: "100%",
            padding: "16px",
            backgroundColor: "#f8f9fa",
            borderRadius: "6px",
            textAlign: "center",
            color: "#6c757d",
            margin: "16px auto",
          }}
        >
          Unable to load image: {alt || "Unknown image"}
        </span>
      );
    }

    return (
      <>
        {loading && (
          <span
            style={{
              display: "inline-block",
              width: "100%",
              textAlign: "center",
              padding: "16px",
              backgroundColor: "#f8f9fa",
              borderRadius: "6px",
              color: "#6c757d",
              margin: "16px 0",
            }}
          >
            Loading image...
          </span>
        )}
        <img
          src={mediaSrc}
          alt={alt || "Image"}
          {...props}
          style={{
            maxWidth: "500px",
            width: "100%",
            height: "auto",
            display: "block",
            margin: "16px auto",
            borderRadius: "6px",
          }}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
        />
      </>
    );
  },
);

interface CodeBlockButtonsProps {
  index: number;
  createCodeBlock: (index: number, type: "action" | "userInteraction") => void;
}

const CodeBlockButtons: React.FC<CodeBlockButtonsProps> = memo(
  ({ index, createCodeBlock }) => {
    const buttonStyle: React.CSSProperties = {
      cursor: "pointer",
      background: "transparent",
      border: "none",
      padding: "4px",
      width: "24px",
      height: "24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
    };

    return (
      <div
        style={{
          position: "absolute",
          top: "4px",
          right: "4px",
          zIndex: 10,
          display: "flex",
          gap: "4px",
          background: "rgba(30, 30, 30, 0.8)",
          borderRadius: "4px",
          padding: "2px",
        }}
      >
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            createCodeBlock(index, "userInteraction");
          }}
          style={buttonStyle}
          title="Create User Interaction block"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
        {/* PINGWING I'm commenting out the next button, I think we should add it back in the future */}
        {/* <button
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            createCodeBlock(index, "action");
          }}
          style={buttonStyle}
          title="Create Action block"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        </button> */}
      </div>
    );
  },
);

const parseStatements = (codeBlock: string): string[] => {
  const statements: string[] = [];
  let buffer = "";
  let braceLevel = 0;

  const lines = codeBlock.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    buffer += line + (i < lines.length - 1 ? "\n" : "");

    // Simplified brace counting
    for (const char of line) {
      if (char === "{" || char === "(" || char === "[") braceLevel++;
      else if (char === "}" || char === ")" || char === "]") braceLevel--;
    }

    if (braceLevel === 0 && buffer.trim()) {
      statements.push(buffer);
      buffer = "";
    }
  }

  if (buffer.trim()) {
    statements.push(buffer);
  }

  return statements.filter((s) => s.trim()).map((s) => s.trim());
};

const isUnorderedListItem = (line: string) => /^\s*(-|\*|\+)\s/.test(line);
const isOrderedListItem = (line: string) => /^\s*\d+\.\s/.test(line);
const isListItem = (line: string) =>
  isUnorderedListItem(line) || isOrderedListItem(line);

const getCodeBlockContentForEditing = (content: string): string => {
  if (content.trim().startsWith("```")) {
    const lines = content.split("\n");
    if (lines.length >= 2) {
      // Return content between the code fences
      return lines.slice(1, lines.length - 1).join("\n");
    }
    // Handle incomplete code blocks
    return "";
  }
  return content;
};

// Parse markdown into logical blocks instead of just lines
const parseMarkdownBlocks = (content: string) => {
  const lines = content.split("\n");
  const blocks: {
    content: string;
    startLine: number;
    endLine: number;
    type?: string;
  }[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Check for LaTeX blocks ($$...$$)
    if (line.trim().startsWith("$$")) {
      const startLine = i;
      let endLine = i;
      i++; // Move past opening $$

      // Find closing $$
      while (i < lines.length && !lines[i].trim().startsWith("$$")) {
        i++;
      }

      if (i < lines.length) {
        endLine = i; // Include closing $$
        i++; // Move past closing $$
      }

      const blockContent = lines.slice(startLine, endLine + 1).join("\n");
      blocks.push({ content: blockContent, startLine, endLine, type: "latex" });
      continue;
    }

    // Check for code blocks
    if (line.trim().startsWith("```")) {
      const startLine = i;
      let endLine = i;
      const language = line.trim().slice(3).trim(); // Extract language after ```
      i++; // Move past opening ```

      // Find closing ```
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        i++;
      }

      if (i < lines.length) {
        endLine = i; // Include closing ```
        i++; // Move past closing ```
      } else {
        // No closing tag found, goes to end of doc
        endLine = lines.length - 1;
      }

      const blockContent = lines.slice(startLine, endLine + 1).join("\n");
      const blockType = language === "katex" ? "katex" : "code";
      blocks.push({
        content: blockContent,
        startLine,
        endLine,
        type: blockType,
      });
      continue;
    }

    // Check for lists
    if (isListItem(line)) {
      const startLine = i;
      let endLine = i;
      i++; // Move to the next line to check it

      // Consume subsequent lines that are part of the list
      while (i < lines.length && isListItem(lines[i])) {
        endLine = i;
        i++;
      }

      const blockContent = lines.slice(startLine, endLine + 1).join("\n");
      blocks.push({ content: blockContent, startLine, endLine });
      continue;
    }

    // Treat other lines as individual blocks
    blocks.push({ content: line, startLine: i, endLine: i });
    i++;
  }

  return blocks;
};

interface ObsidianStyleEditorProps {
  value: string;
  onChange?: (value: string) => void;
  onSave?: () => void;
  uploadImage?: (file: File) => Promise<string>;
  uploadVideo?: (file: File) => Promise<string>;
  readOnly?: boolean;
}

export const ObsidianStyleEditor: React.FC<ObsidianStyleEditorProps> = ({
  value,
  onChange,
  onSave,
  uploadImage,
  uploadVideo,
  readOnly = false,
}) => {
  const [editingBlockIndex, setEditingBlockIndex] = useState<number | null>(
    null,
  );
  const [editingContent, setEditingContent] = useState<string>("");
  const [cursorPlacement, setCursorPlacement] = useState<"start" | "end">(
    "end",
  );
  const [interactionMode, setInteractionMode] = useState<"mouse" | "keyboard">(
    "mouse",
  );
  const [hoveredBlockIndex, setHoveredBlockIndex] = useState<number | null>(
    null,
  );
  const [dragOverBlockIndex, setDragOverBlockIndex] = useState<number | null>(
    null,
  );
  const isHandlingEnter = useRef(false);
  const [isSelectAllTriggered, setSelectAllTriggered] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const apiBaseUrl = import.meta.env.VITE_API_URL || "";

  // Undo/Redo state
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isInternalChange = useRef(false);
  const hasInitialized = useRef(value !== "");

  // Update history when value changes externally
  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    // When content is first loaded, reset history to prevent undoing to a blank slate
    if (!hasInitialized.current && value) {
      setHistory([value]);
      setHistoryIndex(0);
      hasInitialized.current = true;
      return;
    }

    if (value !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(value);
      // Limit history to 50 entries
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [value]);

  // This effect synchronizes the textarea's content when an undo/redo action
  // changes the main `value` prop while a block is being edited.
  useEffect(() => {
    if (editingBlockIndex !== null) {
      if (isHandlingEnter.current) {
        isHandlingEnter.current = false;
        return;
      }
      const blocks = parseMarkdownBlocks(value);
      const currentBlockContent = blocks[editingBlockIndex]?.content;

      if (
        currentBlockContent !== undefined &&
        currentBlockContent !== editingContent
      ) {
        setEditingContent(getCodeBlockContentForEditing(currentBlockContent));
      }
    }
  }, [value]);

  useEffect(() => {
    if (isSelectAllTriggered) {
      if (editorRef.current) {
        editorRef.current.focus({ preventScroll: true });
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setSelectAllTriggered(false);
    }
  }, [isSelectAllTriggered]);

  const handleCopy = (e: React.ClipboardEvent) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editorRef.current) {
      return;
    }

    // Let the browser handle copying from inside the textarea
    if ((e.target as HTMLElement).closest("textarea")) {
      return;
    }

    const range = selection.getRangeAt(0);

    // A reliable way to check if the selection spans the entire editor content.
    // This is true when `Cmd+A` is used because we use `range.selectNodeContents`.
    const isEntireEditorSelected =
      range.startContainer === editorRef.current &&
      range.startOffset === 0 &&
      range.endContainer === editorRef.current &&
      range.endOffset === editorRef.current.childNodes.length;

    if (isEntireEditorSelected) {
      e.preventDefault();
      e.clipboardData.setData("text/plain", value);
      return;
    }

    const startBlockInfo = findBlockInfo(range.startContainer);
    const endBlockInfo = findBlockInfo(range.endContainer);

    if (startBlockInfo && endBlockInfo) {
      e.preventDefault();
      const startIndex = Math.min(startBlockInfo.index, endBlockInfo.index);
      const endIndex = Math.max(startBlockInfo.index, endBlockInfo.index);

      let textToCopy;

      if (startIndex === endIndex) {
        textToCopy = blocks[startIndex].content;
      } else {
        const selectedBlocks = blocks.slice(startIndex, endIndex + 1);
        textToCopy = selectedBlocks.map((b) => b.content).join("\n");
      }

      e.clipboardData.setData("text/plain", textToCopy);
    }
  };

  // Helper to find the parent 'obsidian-line' and its index
  const findBlockInfo = (
    node: Node,
  ): { element: HTMLElement; index: number } | null => {
    let current: Node | null = node;
    while (current && current !== editorRef.current) {
      if (
        current instanceof HTMLElement &&
        current.classList.contains("obsidian-line")
      ) {
        const indexAttr = current.getAttribute("data-block-index");
        if (indexAttr) {
          return { element: current, index: parseInt(indexAttr, 10) };
        }
      }
      current = current.parentNode;
    }
    return null;
  };

  const handleMediaFiles = async (
    files: FileList,
    insertionBlockIndex: number,
  ) => {
    if (readOnly || !onChange) return;

    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );
    const videoFiles = Array.from(files).filter((file) =>
      file.type.startsWith("video/"),
    );

    if (imageFiles.length === 0 && videoFiles.length === 0) {
      return;
    }

    const currentBlocks = parseMarkdownBlocks(value);

    let insertAfterLine: number;
    if (insertionBlockIndex >= 0 && currentBlocks[insertionBlockIndex]) {
      insertAfterLine = currentBlocks[insertionBlockIndex].endLine;
    } else if (currentBlocks.length > 0) {
      insertAfterLine = currentBlocks[currentBlocks.length - 1].endLine;
    } else {
      insertAfterLine = -1; // Will insert at the beginning
    }

    const lines = value.split("\n");
    let insertedCount = 0;

    // Add empty line above if needed
    const shouldAddEmptyLineAbove =
      insertAfterLine >= 0 && lines[insertAfterLine]?.trim() !== "";
    if (shouldAddEmptyLineAbove) {
      lines.splice(insertAfterLine + 1 + insertedCount, 0, "");
      insertedCount++;
    }

    // Handle image files
    if (uploadImage) {
      for (const file of imageFiles) {
        try {
          await uploadImage(file);
          const imageMarkdown = `![${file.name}](../uploads/${file.name})`;
          lines.splice(insertAfterLine + 1 + insertedCount, 0, imageMarkdown);
          insertedCount++;
        } catch (error) {
          console.error(`Failed to upload image ${file.name}:`, error);
          // TODO: Show toast notification to user
        }
      }
    }

    // Handle video files
    if (uploadVideo) {
      for (const file of videoFiles) {
        try {
          await uploadVideo(file);
          const videoMarkdown = `![${file.name}](../uploads/${file.name})`;
          lines.splice(insertAfterLine + 1 + insertedCount, 0, videoMarkdown);
          insertedCount++;
        } catch (error) {
          console.error(`Failed to upload video ${file.name}:`, error);
          // TODO: Show toast notification to user
        }
      }
    }

    // Add empty line below if needed
    const shouldAddEmptyLineBelow =
      insertAfterLine + 1 + insertedCount < lines.length &&
      lines[insertAfterLine + 1 + insertedCount]?.trim() !== "";
    if (shouldAddEmptyLineBelow) {
      lines.splice(insertAfterLine + 1 + insertedCount, 0, "");
      insertedCount++;
    }

    if (insertedCount > 0) {
      onChange(lines.join("\n"));
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const files = e.clipboardData?.files;
    if (
      files &&
      files.length > 0 &&
      Array.from(files).some(
        (f) => f.type.startsWith("image/") || f.type.startsWith("video/"),
      )
    ) {
      e.preventDefault();
      // Prioritize the block being edited, otherwise use the last block.
      const targetBlock = editingBlockIndex ?? blocks.length - 1;
      handleMediaFiles(files, targetBlock);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverBlockIndex(null);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const targetBlockInfo = findBlockInfo(e.target as Node);
      const targetBlock = targetBlockInfo?.index ?? blocks.length - 1;
      handleMediaFiles(files, targetBlock);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();

    // Only show drag feedback for files that contain images or videos
    const hasMediaFiles =
      e.dataTransfer?.items &&
      Array.from(e.dataTransfer.items).some(
        (item) =>
          item.type.startsWith("image/") || item.type.startsWith("video/"),
      );

    if (hasMediaFiles) {
      const targetBlockInfo = findBlockInfo(e.target as Node);
      const targetBlock = targetBlockInfo?.index ?? blocks.length - 1;
      if (dragOverBlockIndex !== targetBlock) {
        setDragOverBlockIndex(targetBlock);
      }
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      isInternalChange.current = true;
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onChange?.(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      isInternalChange.current = true;
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onChange?.(history[newIndex]);
    }
  };

  const createCodeBlock = (
    index: number,
    type: "action" | "userInteraction",
  ) => {
    if (!onChange) return;

    const blockToReplace = blocks[index];
    if (!blockToReplace) return;

    const contentToEdit =
      type === "userInteraction" ? USER_INTERACTION_TEMPLATE : ACTION_TEMPLATE;

    const codeBlockContent = `\`\`\`\n${contentToEdit}\n\`\`\``;

    const lines = value.split("\n");
    lines.splice(
      blockToReplace.startLine,
      blockToReplace.endLine - blockToReplace.startLine + 1,
      ...codeBlockContent.split("\n"),
    );
    const newValue = lines.join("\n");
    onChange(newValue);

    setTimeout(() => {
      const newBlocks = parseMarkdownBlocks(newValue);
      const newCodeBlockIndex = newBlocks.findIndex(
        (b) => b.startLine === blockToReplace.startLine && b.type === "code",
      );

      if (newCodeBlockIndex !== -1) {
        setEditingBlockIndex(newCodeBlockIndex);
        setEditingContent(contentToEdit);
        setCursorPlacement("end");
      }
    }, 0);
  };

  const blocks = parseMarkdownBlocks(value);

  useEffect(() => {
    if (editingBlockIndex !== null && textareaRef.current) {
      textareaRef.current.focus();

      if (cursorPlacement === "end") {
        const length = textareaRef.current.value.length;
        textareaRef.current.setSelectionRange(length, length);
      } else {
        textareaRef.current.setSelectionRange(0, 0);
      }

      // Use requestAnimationFrame to ensure DOM is ready for height calculation
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          adjustTextareaHeight(textareaRef.current);
        }
      });
    }
  }, [editingBlockIndex]);

  // This effect is responsible for adjusting textarea height dynamically
  useEffect(() => {
    if (editingBlockIndex !== null && textareaRef.current) {
      adjustTextareaHeight(textareaRef.current);
    }
  }, [editingContent]);

  // Handle resize events for better responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (editingBlockIndex !== null && textareaRef.current) {
        // Small delay to allow for layout changes
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            adjustTextareaHeight(textareaRef.current);
          }
        });
      }
    };

    // Handle window resize
    window.addEventListener("resize", handleResize);

    // Handle container resize using ResizeObserver
    let resizeObserver: ResizeObserver | null = null;
    if (editorRef.current && "ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(editorRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [editingBlockIndex]);

  const handleBlockClick = (
    blockIndex: number,
    cursor: "start" | "end" = "end",
  ) => {
    if (editingBlockIndex === blockIndex) return; // Already editing this block

    // Save current edit if any
    if (editingBlockIndex !== null) {
      saveCurrentEdit();
    }

    setHoveredBlockIndex(null);
    setEditingBlockIndex(blockIndex);

    const contentToEdit = getCodeBlockContentForEditing(
      blocks[blockIndex]?.content || "",
    );
    setEditingContent(contentToEdit);
    setCursorPlacement(cursor);
  };

  // Function to determine the CSS class for the textarea based on content
  const getStyleClassForEditing = (
    block: (typeof blocks)[0],
    editingContent: string,
  ) => {
    switch (block.type) {
      case "code":
      case "katex":
        return "code-block";
      case "latex":
        return "latex-block";
      default: {
        const trimmed = editingContent.trim();
        if (trimmed.startsWith("# ")) return "h1-style";
        if (trimmed.startsWith("## ")) return "h2-style";
        if (trimmed.startsWith("### ")) return "h3-style";
        if (trimmed.startsWith("#### ")) return "h4-style";
        if (trimmed.startsWith("##### ")) return "h5-style";
        if (trimmed.startsWith("###### ")) return "h6-style";
        return "";
      }
    }
  };

  const getFinalBlockContent = (
    block: (typeof blocks)[0],
    editingContent: string,
  ): string => {
    if (block.content.trim().startsWith("```")) {
      const originalLines = block.content.split("\n");
      const lang = originalLines[0].substring(3);

      const linesOfContent = editingContent.split("\n");
      const linesWithoutExample = linesOfContent.filter(
        (line) => !line.trim().startsWith("// Example"),
      );
      const newEditingContent = linesWithoutExample.join("\n");

      return "```" + lang + "\n" + newEditingContent + "\n" + "```";
    }
    return editingContent;
  };

  const saveCurrentEdit = () => {
    if (editingBlockIndex === null) return;

    const block = blocks[editingBlockIndex];
    if (!block) {
      setEditingBlockIndex(null);
      setEditingContent("");
      return;
    }

    const newContentForBlock = getFinalBlockContent(block, editingContent);

    if (newContentForBlock !== block.content) {
      const lines = value.split("\n");
      const newLines = [...lines];
      const editedLines = newContentForBlock.split("\n");
      newLines.splice(
        block.startLine,
        block.endLine - block.startLine + 1,
        ...editedLines,
      );
      const newValue = newLines.join("\n");
      onChange?.(newValue);
    }

    setEditingBlockIndex(null);
    setEditingContent("");
  };

  const cancelEdit = () => {
    setEditingBlockIndex(null);
    setEditingContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "ArrowUp") {
      const textarea = e.currentTarget;
      const textUpToCursor = textarea.value.substring(
        0,
        textarea.selectionStart,
      );
      if (!textUpToCursor.includes("\n")) {
        if (editingBlockIndex !== null && editingBlockIndex > 0) {
          e.preventDefault();
          setInteractionMode("keyboard");
          handleBlockClick(editingBlockIndex - 1, "end");
        }
      }
    } else if (e.key === "ArrowDown") {
      const textarea = e.currentTarget;
      const textAfterCursor = textarea.value.substring(textarea.selectionStart);
      if (!textAfterCursor.includes("\n")) {
        if (
          editingBlockIndex !== null &&
          editingBlockIndex < blocks.length - 1
        ) {
          e.preventDefault();
          setInteractionMode("keyboard");
          handleBlockClick(editingBlockIndex + 1, "start");
        } else if (
          editingBlockIndex !== null &&
          editingBlockIndex === blocks.length - 1 &&
          editingContent.trim() !== ""
        ) {
          e.preventDefault();

          // Save the current block's content and add a new empty block below it
          const block = blocks[editingBlockIndex];
          const newContentForBlock = getFinalBlockContent(
            block,
            editingContent,
          );

          const lines = value.split("\n");
          const newLines = [...lines];
          const editedLines = newContentForBlock.split("\n");
          newLines.splice(
            block.startLine,
            block.endLine - block.startLine + 1,
            ...editedLines,
          );

          newLines.push(""); // Add a new line for the new block

          const newValue = newLines.join("\n");
          onChange?.(newValue);

          // Manually set the next state to edit the new (last) line
          const newBlockIndex = parseMarkdownBlocks(newValue).length - 1;
          setEditingBlockIndex(newBlockIndex);
          setEditingContent("");
          setCursorPlacement("start");
        }
      }
    } else if (e.key === "Enter" && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
      const textarea = e.currentTarget;
      const { selectionStart, selectionEnd } = textarea;

      // Check for trigger phrases that should create code blocks
      const textBeforeCursor = editingContent.slice(0, selectionStart);
      const currentLine = textBeforeCursor.split("\n").pop()!;

      // Define trigger phrases for code blocks
      const codeBlockTriggers = ["User Interaction:", "Action:"];
      const triggerMatch = codeBlockTriggers.find(
        (trigger) => currentLine.trim().toLowerCase() === trigger.toLowerCase(),
      );

      if (triggerMatch) {
        e.preventDefault();

        const type =
          triggerMatch.toLowerCase() === "user interaction:"
            ? "userInteraction"
            : "action";
        if (editingBlockIndex !== null) {
          createCodeBlock(editingBlockIndex!, type);
        }
        return;
      }

      // For list items, we have special handling

      // Check if we're editing a code block using block type
      const currentBlock = blocks[editingBlockIndex!];
      if (currentBlock?.type === "code") {
        // For code blocks, always allow adding new lines within the block
        // Only exit edit mode if we're explicitly trying to exit (handled elsewhere)
        e.preventDefault();
        isHandlingEnter.current = true;

        const newContent =
          editingContent.slice(0, selectionStart) +
          "\n" +
          editingContent.slice(selectionEnd);

        setEditingContent(newContent);

        const originalLines = currentBlock.content.split("\n");
        const lang = originalLines[0].substring(3);
        const newContentForValue =
          "```" + lang + "\n" + newContent + "\n" + "```";

        const lines = value.split("\n");
        const newLines = [...lines];
        const editedLines = newContentForValue.split("\n");
        newLines.splice(
          currentBlock.startLine,
          currentBlock.endLine - currentBlock.startLine + 1,
          ...editedLines,
        );
        const newValue = newLines.join("\n");
        onChange?.(newValue);

        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart =
              textareaRef.current.selectionEnd = selectionStart + 1;
            adjustTextareaHeight(textareaRef.current);
          }
        });
        return;
      }

      if (isListItem(currentLine)) {
        e.preventDefault();

        const listMarkerMatch = currentLine.match(/^\s*(-|\*|\+)\s/);
        const orderedListMatch = currentLine.match(/^\s*(\d+)\.\s/);
        const contentOfLine = currentLine.replace(
          /^\s*(-|\*|\+)\s|^\s*\d+\.\s/,
          "",
        );

        let newContent: string;
        let cursorOffset: number;

        if (contentOfLine.trim() === "") {
          // Empty list item, so un-indent
          const lineStartPos = textBeforeCursor.length - currentLine.length;
          newContent =
            textBeforeCursor.slice(0, lineStartPos) +
            editingContent.slice(selectionStart);
          cursorOffset = lineStartPos;
        } else {
          // Create new list item
          let nextMarker: string;
          if (listMarkerMatch) {
            nextMarker = currentLine.match(/^\s*(-|\*|\+)\s/)![0];
          } else if (orderedListMatch) {
            const num = parseInt(orderedListMatch[1], 10);
            const indent = currentLine.match(/^\s*/)?.[0] || "";
            nextMarker = `${indent}${num + 1}. `;
          } else {
            nextMarker = "- "; // Should not happen
          }

          newContent =
            textBeforeCursor +
            "\n" +
            nextMarker +
            editingContent.slice(selectionEnd);
          cursorOffset = selectionStart + 1 + nextMarker.length;
        }

        setEditingContent(newContent);

        // Update the main value from the new editingContent
        const block = blocks[editingBlockIndex!];
        const lines = value.split("\n");
        lines.splice(
          block.startLine,
          block.endLine - block.startLine + 1,
          ...newContent.split("\n"),
        );
        onChange?.(lines.join("\n"));

        // Set cursor after render
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = cursorOffset;
        });

        return;
      }

      // Fallback to original block splitting logic if not in a list
      // Don't hijack enter for code blocks or LaTeX blocks, let it add newlines.
      if (currentBlock?.type === "katex" || currentBlock?.type === "latex")
        return;

      e.preventDefault();

      const textAfterCursor = editingContent.slice(selectionStart);

      // Reconstruct the full content
      const block = blocks[editingBlockIndex!];
      const lines = value.split("\n");
      const newLines = [...lines];
      newLines.splice(
        block.startLine,
        block.endLine - block.startLine + 1,
        textBeforeCursor,
        textAfterCursor,
      );
      const newValue = newLines.join("\n");
      onChange?.(newValue);

      // Manually set the next state to edit the new line
      const newEditingIndex = editingBlockIndex! + 1;
      setEditingBlockIndex(newEditingIndex);
      setEditingContent(textAfterCursor);
      setCursorPlacement("start");
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    } else if (e.key === "Backspace" && editingContent.trim() === "") {
      // Delete empty line with backspace
      e.preventDefault();
      deleteLine();
    } else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "z") {
      // Cmd/Ctrl + Shift + Z for redo
      e.preventDefault();
      redo();
    } else if ((e.metaKey || e.ctrlKey) && e.key === "z") {
      // Cmd/Ctrl + Z for undo
      e.preventDefault();
      undo();
    } else if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      // Cmd/Ctrl + Enter saves and exits
      e.preventDefault();
      saveCurrentEdit();
    }
    // Regular Enter key now creates new lines normally
  };

  const handleGlobalKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle Cmd/Ctrl + A for select all
    if ((e.metaKey || e.ctrlKey) && e.key === "a") {
      e.preventDefault();

      if (editingBlockIndex !== null) {
        saveCurrentEdit();
      }

      setSelectAllTriggered(true);
      return;
    }

    // Handle Backspace/Delete when the whole editor is selected
    if (e.key === "Backspace" || e.key === "Delete") {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || !editorRef.current) {
        return;
      }

      const range = selection.getRangeAt(0);

      const editorRange = document.createRange();
      editorRange.selectNodeContents(editorRef.current);

      const isEntireEditorSelected =
        range.compareBoundaryPoints(Range.START_TO_START, editorRange) === 0 &&
        range.compareBoundaryPoints(Range.END_TO_END, editorRange) === 0;

      if (isEntireEditorSelected) {
        e.preventDefault();
        if (onChange) {
          onChange("");
          handleBlockClick(0, "end");
        }
      }
    }
  };

  const deleteLine = () => {
    if (editingBlockIndex === null) return;

    const block = blocks[editingBlockIndex];
    if (!block) return;

    const lines = value.split("\n");
    const newLines = [...lines];

    newLines.splice(block.startLine, block.endLine - block.startLine + 1);

    const newValue = newLines.join("\n");
    onChange?.(newValue);

    if (editingBlockIndex > 0) {
      const newEditingIndex = editingBlockIndex - 1;
      // We have to re-parse the blocks with the new value to get correct content
      const newBlocks = parseMarkdownBlocks(newValue);
      const prevBlock = newBlocks[newEditingIndex];

      if (prevBlock) {
        setEditingBlockIndex(newEditingIndex);

        setEditingContent(getCodeBlockContentForEditing(prevBlock.content));
        setCursorPlacement("end");
      } else {
        setEditingBlockIndex(null);
        setEditingContent("");
      }
    } else {
      setEditingBlockIndex(null);
      setEditingContent("");
    }
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    if (!textarea) return;

    // Store current styles
    const originalOverflow = textarea.style.overflow;

    // Temporarily reset to get accurate measurements
    textarea.style.height = "1px";
    textarea.style.overflow = "hidden";

    // Get computed styles for accurate calculations
    const computedStyle = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(computedStyle.lineHeight) || 21;
    const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
    const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
    const borderTop = parseFloat(computedStyle.borderTopWidth) || 0;
    const borderBottom = parseFloat(computedStyle.borderBottomWidth) || 0;

    // Get the actual content height needed
    const scrollHeight = textarea.scrollHeight;

    // Calculate the minimum height for a single line to match .obsidian-line
    const singleLineHeight = Math.max(
      lineHeight + paddingTop + paddingBottom + borderTop + borderBottom,
      21,
    );

    // Check if content is empty or single short line
    const content = textarea.value;
    const isEmpty = !content || content.trim() === "";
    const isSingleShortLine = !content.includes("\n") && content.length < 80;

    let finalHeight: number;

    if (isEmpty) {
      // For completely empty content, use exact single line height
      finalHeight = singleLineHeight;
    } else if (isSingleShortLine && scrollHeight <= singleLineHeight + 2) {
      // For single short lines, use single line height
      finalHeight = singleLineHeight;
    } else {
      // For multi-line or long content, use scroll height but ensure minimum
      finalHeight = Math.max(scrollHeight, singleLineHeight);
    }

    // Set the calculated height
    textarea.style.height = `${finalHeight}px`;

    // Restore overflow
    textarea.style.overflow = originalOverflow || "hidden";
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newUnwrappedContent = e.target.value;
    setEditingContent(newUnwrappedContent);
  };

  // Memoize the components object at the component level to avoid hook violations
  const markdownComponents = useMemo(
    () => ({
      pre({ node, children, ...props }: any) {
        let codeContent = "";
        let language = "javascript";

        React.Children.forEach(children, (child: any) => {
          if (child?.props?.children) {
            codeContent = String(child.props.children);
            if (child.props.className) {
              const match = /language-(\w+)/.exec(child.props.className);
              if (match) language = match[1];
            }
          }
        });

        const statements = parseStatements(codeContent);
        const hasCustomFormatting = statements.some((stmt) =>
          formatSpecialCode(stmt),
        );

        if (hasCustomFormatting) {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: ".5em",
                gap: "1em",
              }}
            >
              {statements.map((stmt, index) => {
                const formatted = formatSpecialCode(stmt);
                return (
                  <div key={index}>
                    {formatted ? (
                      formatted
                    ) : (
                      <pre style={{ margin: 0 }}>{stmt}</pre>
                    )}
                  </div>
                );
              })}
            </div>
          );
        }

        if (codeContent.length > 10 || codeContent.includes("\n")) {
          return (
            <SyntaxHighlighter
              style={atomDark}
              language={language}
              PreTag="div"
              className="code-block-container"
              customStyle={{
                margin: "16px 0",
                borderRadius: "6px",
                fontSize: "14px",
                fontFamily: '"IBM Plex Mono", monospace',
              }}
            >
              {codeContent.replace(/\n$/, "")}
            </SyntaxHighlighter>
          );
        }

        return <pre {...props}>{children}</pre>;
      },
      code({ node, className, children, ...props }: any) {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
      img: (props: any) => (
        <MemoizedImageComponent
          {...props}
          apiBaseUrl={apiBaseUrl}
          readOnly={readOnly}
        />
      ),
      p({ children }: any) {
        // Handle inline LaTeX in paragraphs
        if (typeof children === "string") {
          const parts = children.split(/(\$[^$]+\$)/g);
          return (
            <span>
              {parts.map((part, i) => {
                if (part.match(/^\$[^$]+\$$/)) {
                  const latexContent = part.slice(1, -1);
                  return (
                    <LaTeXEditor
                      key={i}
                      content={latexContent}
                      onChange={(newContent) => {
                        console.log("Inline LaTeX changed:", newContent);
                      }}
                      onSave={() => {}}
                      onCancel={() => {}}
                      isInline={true}
                    />
                  );
                }
                return part;
              })}
            </span>
          );
        }

        // In readOnly mode, skip paragraphs that contain only videos (which render null) or are empty
        if (readOnly) {
          const childrenArray = React.Children.toArray(children);

          // Filter out null, undefined, and empty string children
          const nonEmptyChildren = childrenArray.filter(
            (child) =>
              child !== null &&
              child !== undefined &&
              (typeof child !== "string" || child.trim() !== ""),
          );

          // If no non-empty children remain, don't render the paragraph
          if (nonEmptyChildren.length === 0) {
            return null;
          }
        }

        return <p style={{ margin: 0, lineHeight: "1.5" }}>{children}</p>;
      },
      h1({ children }: any) {
        return <h1 style={{ margin: 0, lineHeight: "1.25" }}>{children}</h1>;
      },
      h2({ children }: any) {
        return <h2 style={{ margin: 0, lineHeight: "1.25" }}>{children}</h2>;
      },
      h3({ children }: any) {
        return <h3 style={{ margin: 0, lineHeight: "1.25" }}>{children}</h3>;
      },
      h4({ children }: any) {
        return <h4 style={{ margin: 0, lineHeight: "1.25" }}>{children}</h4>;
      },
      h5({ children }: any) {
        return <h5 style={{ margin: 0, lineHeight: "1.25" }}>{children}</h5>;
      },
      h6({ children }: any) {
        return <h6 style={{ margin: 0, lineHeight: "1.25" }}>{children}</h6>;
      },
    }),
    [apiBaseUrl, readOnly],
  );

  const renderMarkdownLine = (content: string, blockType?: string) => {
    if (!content.trim()) {
      return <div style={{ minHeight: "21px", lineHeight: "1.5" }}>&nbsp;</div>;
    }

    // Handle LaTeX blocks
    if (blockType === "latex" || content.trim().startsWith("$$")) {
      const latexContent = content
        .replace(/^\$\$\s*/, "")
        .replace(/\s*\$\$$/, "");
      return (
        <LaTeXEditor
          content={latexContent}
          onChange={(newContent) => {
            const newValue = content.replace(
              /^\$\$\s*.*\s*\$\$$/,
              `$$${newContent}$$`,
            );
            // This would need to be handled by the parent component
            console.log("LaTeX content changed:", newContent);
          }}
          onSave={() => {}}
          onCancel={() => {}}
          isInline={false}
        />
      );
    }

    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          [
            rehypeSanitize,
            {
              ...defaultSchema,
              attributes: {
                ...defaultSchema.attributes,
                code: [...(defaultSchema.attributes?.code || []), "className"],
                img: [...(defaultSchema.attributes?.img || []), "src", "alt"],
              },
            },
          ],
        ]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div
      ref={editorRef}
      className={`obsidian-editor ${
        interactionMode === "keyboard" ? "keyboard-nav" : ""
      } ${readOnly ? "read-only" : ""}`}
      onMouseMove={() => setInteractionMode("mouse")}
      onCopy={handleCopy}
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={(e) => {
        // Only clear if we're leaving the editor entirely
        if (!editorRef.current?.contains(e.relatedTarget as Node)) {
          setDragOverBlockIndex(null);
        }
      }}
      onMouseLeave={() => setHoveredBlockIndex(null)}
      onKeyDown={handleGlobalKeyDown}
      tabIndex={-1}
    >
      {blocks.map((block, index) => {
        return (
          <div key={block.startLine}>
            {editingBlockIndex === index && !readOnly ? (
              <div
                className="obsidian-line obsidian-line-editing"
                style={{ position: "relative" }}
              >
                {block.type !== "code" && (
                  <CodeBlockButtons
                    index={index}
                    createCodeBlock={createCodeBlock}
                  />
                )}
                <textarea
                  ref={textareaRef}
                  className={`obsidian-textarea ${getStyleClassForEditing(
                    block,
                    editingContent,
                  )}`}
                  value={editingContent}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  onBlur={saveCurrentEdit}
                />
              </div>
            ) : (
              <div
                className={`obsidian-line ${
                  dragOverBlockIndex === index ? "drag-over" : ""
                }`}
                data-block-index={index}
                style={{ position: "relative" }}
                onMouseEnter={() =>
                  !readOnly &&
                  editingBlockIndex === null &&
                  setHoveredBlockIndex(index)
                }
                onMouseLeave={() =>
                  !readOnly &&
                  editingBlockIndex === null &&
                  setHoveredBlockIndex(null)
                }
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent textarea from losing focus, so onBlur doesn't fire immediately
                  if (readOnly) return;
                  handleBlockClick(index, "end");
                }}
              >
                {hoveredBlockIndex === index &&
                  !readOnly &&
                  block.type !== "code" && (
                    <CodeBlockButtons
                      index={index}
                      createCodeBlock={createCodeBlock}
                    />
                  )}
                {renderMarkdownLine(block.content, block.type)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ObsidianStyleEditor;
