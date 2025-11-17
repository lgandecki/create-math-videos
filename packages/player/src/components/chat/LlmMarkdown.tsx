import React, { memo, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

/**
 * Parses LaTeX content from raw text to properly formatted markdown with math delimiters
 * @param rawText The raw text possibly containing LaTeX commands
 * @returns Properly formatted text with LaTeX delimiters
 */
const parseLatexContent = (rawText: string): string => {
  if (!rawText) return "";

  return (
    rawText
      // Replace escaped newlines first
      .replace(/\\n/g, "\n")
      // Convert block math delimiters - use double $$ for block math
      // Note: In JS regex replace, $$ means "single $", so we need $$$$ for "$$"
      .replace(/\\\[/g, "$$$$")
      .replace(/\\\]/g, "$$$$")
      // Convert inline math delimiters - use single $ for inline math
      // Note: In JS regex replace, $$ means "single $"
      .replace(/\\\(/g, "$$")
      .replace(/\\\)/g, "$$")
      // Handle double backslashes in LaTeX commands (keep this last)
      .replace(/\\\\/g, "\\")
      .trim()
  );
};

interface LlmMarkdownProps {
  content: string;
}

const MemoizedVideoComponent = memo(({ src, alt, ...props }: any) => {
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
      <div className="max-w-3/4 rounded-md my-2 mx-auto p-4 bg-gray-100 text-center text-gray-600">
        <p>Unable to load video: {alt || "Unknown video"}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto my-2 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
          <p className="text-gray-600">Loading video...</p>
        </div>
      )}
      <video
        {...props}
        src={src || `api/v1/upload?fileName=${encodeURIComponent(alt || "")}`}
        controls
        className="w-full rounded-md"
        preload="metadata"
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
});

const MemoizedImageComponent = memo(({ node, ...props }: any) => {
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const alt = props.alt || "";

  // const src = alt ? `api/v1/upload?fileName=${encodeURIComponent(alt)}` : "";
  const src = alt ? `${apiBaseUrl}/uploads/${alt}` : "";

  // Check if this is actually a video file based on the alt text or src
  const videoExtensions = [".mp4", ".webm", ".ogg", ".avi", ".mov", ".wmv", ".flv", ".mkv"];
  const isVideo = videoExtensions.some((ext) => alt.toLowerCase().endsWith(ext));

  if (isVideo) {
    return <MemoizedVideoComponent src={src} alt={alt} />;
  }

  return <img {...props} src={src} alt={alt || "Image"} className="max-w-3/4 rounded-md my-2 mx-auto" loading="lazy" />;
});

export const LlmMarkdown: React.FC<LlmMarkdownProps> = memo(({ content }) => {
  const parsedContent = useMemo(() => parseLatexContent(content), [content]);

  const components = useMemo(
    () => ({
      img: MemoizedImageComponent,
    }),
    []
  );

  return (
    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} components={components}>
      {parsedContent}
    </ReactMarkdown>
  );
});
