import React, { useState, useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import type { editor, Position } from "monaco-editor";

interface Props {
  value: string;
  onChange: (val: string) => void;
  onSave: () => void;
  uploadImage: (file: File) => Promise<string>;
}
export default function MarkdownEditor({
  value,
  onChange,
  onSave,
  uploadImage,
}: Props) {
  const monaco = useMonaco();
  const [ready, setReady] = useState(false);
  const [editor, setEditor] = useState<editor.IStandaloneCodeEditor | null>(
    null,
  );

  useEffect(() => {
    if (monaco) {
      const modifyMarkdown = async () => {
        const languages = monaco.languages.getLanguages();
        const mdLang = languages.find((l) => l.id === "markdown");
        if (mdLang) {
          // @ts-ignore
          const { language } = await mdLang.loader();
          const root = language.tokenizer.root;
          for (let i = 0; i < root.length; i++) {
            const rule = root[i];
            if (rule?.[0]?.source === "^\\s*```\\s*$") {
              root[i][1].next = "@codeblockgh";
              root[i][1].nextEmbedded = "javascript";
            }
          }
          monaco.languages.setMonarchTokensProvider("markdown", language);

          monaco.languages.registerHoverProvider("markdown", {
            provideHover: (model, position) => {
              const line = model.getLineContent(position.lineNumber);
              const imageRegex = /!\[([^\]]*)\]\((.+?)\)/g;
              let match;

              while ((match = imageRegex.exec(line)) !== null) {
                const startColumn = match.index + 1;
                const endColumn = startColumn + match[0].length;

                if (
                  position.column >= startColumn &&
                  position.column <= endColumn
                ) {
                  let altText = match[1] || "Image";
                  let imageUrl = match[2];

                  // Check if API URL is defined, provide fallback
                  let apiBaseUrl = import.meta.env.VITE_API_URL;
                  if (!apiBaseUrl) {
                    console.warn(
                      "VITE_API_URL is not defined, using fallback URL",
                    );
                    apiBaseUrl = "http://localhost:3001";
                  }

                  // Enhanced URL validation for security
                  const isSecureUrl = (url: string) => {
                    try {
                      const parsed = new URL(url, window.location.origin);

                      // Only allow safe protocols
                      if (!["http:", "https:"].includes(parsed.protocol)) {
                        return false;
                      }

                      // For upload paths, ensure they match expected patterns
                      if (parsed.pathname.includes("/uploads/")) {
                        const uploadPath = parsed.pathname.substring(
                          parsed.pathname.indexOf("/uploads/"),
                        );
                        // Only allow basic filename patterns, no directory traversal
                        return /^\/uploads\/[a-zA-Z0-9._-]+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(
                          uploadPath,
                        );
                      }

                      return true;
                    } catch {
                      return false;
                    }
                  };

                  // Comprehensive URL normalization
                  if (imageUrl.startsWith("../uploads/")) {
                    // Handle relative paths from parent directory
                    const fileName = imageUrl.replace("../uploads/", "");
                    imageUrl = `${apiBaseUrl}/uploads/${fileName}`;
                  } else if (imageUrl.startsWith("./uploads/")) {
                    // Handle relative paths from current directory
                    const fileName = imageUrl.replace("./uploads/", "");
                    imageUrl = `${apiBaseUrl}/uploads/${fileName}`;
                  } else if (imageUrl.startsWith("/uploads/")) {
                    // Handle absolute paths
                    imageUrl = `${apiBaseUrl}${imageUrl}`;
                  } else if (imageUrl.startsWith("uploads/")) {
                    // Handle paths without leading slash
                    imageUrl = `${apiBaseUrl}/${imageUrl}`;
                  } else if (
                    !imageUrl.startsWith("http://") &&
                    !imageUrl.startsWith("https://")
                  ) {
                    // Treat as filename in uploads directory
                    imageUrl = `${apiBaseUrl}/uploads/${imageUrl}`;
                  }

                  // Security validation
                  if (!isSecureUrl(imageUrl)) {
                    console.warn(
                      "Potentially unsafe image URL blocked:",
                      imageUrl,
                    );
                    return null;
                  }

                  return {
                    range: new monaco.Range(
                      position.lineNumber,
                      startColumn,
                      position.lineNumber,
                      endColumn,
                    ),
                    contents: [
                      {
                        value: `**${altText}**`,
                      },
                      {
                        value: `![${altText}](${imageUrl})`,
                        supportThemeIcons: true,
                      },
                    ],
                  };
                }
              }

              return null;
            },
          });

          setReady(true);
        }
      };
      modifyMarkdown();
    }
  }, [monaco]);

  useEffect(() => {
    if (editor && ready) {
      const domNode = editor.getDomNode();
      if (domNode) {
        domNode.addEventListener("dragover", (e: DragEvent) =>
          e.preventDefault(),
        );
        domNode.addEventListener("drop", handleDrop);
        domNode.addEventListener("paste", handlePaste);
      }
      return () => {
        if (domNode) {
          domNode.removeEventListener("dragover", (e: DragEvent) =>
            e.preventDefault(),
          );
          domNode.removeEventListener("drop", handleDrop);
          domNode.removeEventListener("paste", handlePaste);
        }
      };
    }
  }, [editor, ready]);

  const getDropPosition = (e: DragEvent) => {
    if (!editor) return null;
    const target = editor.getTargetAtClientPoint(e.clientX, e.clientY);
    return target && target.position ? target.position : editor.getPosition();
  };

  const handleDrop = async (e: DragEvent) => {
    const files = e.dataTransfer?.files ?? [];
    let hasImage = false;
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        hasImage = true;
      }
    }
    if (!hasImage || files.length === 0) {
      return;
    }
    e.preventDefault();
    const position = getDropPosition(e);
    if (!position) return;

    for (const file of files) {
      if (file.type.startsWith("image/")) {
        await handleImage(file, position);
      }
    }
  };

  const handlePaste = async (e: ClipboardEvent) => {
    const files = e.clipboardData?.files ?? [];
    if (files.length === 0) return;

    let hasImage = false;
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        hasImage = true;
      }
    }
    if (!hasImage) return;

    e.preventDefault();

    const position = editor?.getPosition();
    if (!position) return;

    for (const file of files) {
      if (file.type.startsWith("image/")) {
        await handleImage(file, position);
      }
    }
  };

  const handleImage = async (file: File, position: Position) => {
    if (!editor) return;

    const model = editor.getModel();
    if (!model) return;

    // Check if uploadImage function exists
    if (!uploadImage) {
      console.error("uploadImage function not provided");
      return;
    }

    const placeholderText = `![${file.name}](../uploads/${file.name})\n`;

    const insertRange = new monaco!.Range(
      position.lineNumber,
      position.column,
      position.lineNumber,
      position.column,
    );

    try {
      console.log("Uploading image:", file.name);
      await uploadImage(file);
      console.log("Upload successful for:", file.name);

      // Insert placeholder immediately
      editor.executeEdits("insert-image-placeholder", [
        { range: insertRange, text: placeholderText },
      ]);

      // Image is already in the correct format, no need to replace
    } catch (error) {
      console.error("Upload failed:", error);

      // Replace with error message
      //TODO THIS WAS GIVING TYPE ERRORS, BUT TO BE HONEST, NO IDEA WHAT IS ALL THIS TRUE FALSE FALSE NULL FALSE MADNESS.
      const matches = model.findMatches(
        placeholderText.trim(),
        true,
        false,
        false,
        null,
        false,
      );

      if (matches.length > 0) {
        const matchRange = matches[0].range;
        const errorText = `Failed to upload ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}\n`;
        editor.executeEdits("replace-image-error", [
          { range: matchRange, text: errorText },
        ]);
      }
    }
  };

  if (!ready) {
    return <div style={{ flex: 1 }}>Loading editor...</div>;
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Editor
        height="100%"
        defaultLanguage="markdown"
        value={value}
        onChange={(val) => onChange(val || "")}
        onMount={(editorInstance) => setEditor(editorInstance)}
        options={{
          occurrencesHighlight: "off",
          selectionHighlight: false, // also turn off selection‐based highlights if you like
          unicodeHighlight: {
            nonBasicASCII: false,
            ambiguousCharacters: false,
            invisibleCharacters: false,
            includeComments: false,
            includeStrings: false,
          },
          lineNumbers: "off",
          wordWrap: "on",
          minimap: { enabled: false },
          fontSize: 14,
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
}
