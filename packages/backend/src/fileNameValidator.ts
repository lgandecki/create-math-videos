import path from "path";

/**
 * Validates a filename to prevent security vulnerabilities like path traversal.
 * Returns true if the filename is safe, false otherwise.
 *
 * @param fileName - The filename to validate
 * @returns boolean indicating if the filename is valid
 */
export function isValidFileName(fileName: string): boolean {
  // Extract basename to remove any directory components
  const baseName = path.basename(fileName);
  // Remove .md extension if present
  const nameWithoutExt = baseName.replace(/\.md$/, "");

  // Check for empty name after processing
  if (!nameWithoutExt) return false;

  // Validate filename contains only allowed characters (including '%')
  const ALLOWED_FILENAME_PATTERN = /^[a-zA-Z0-9 _\-%]+$/;
  if (!ALLOWED_FILENAME_PATTERN.test(nameWithoutExt)) return false;

  // Check for suspicious patterns
  const SUSPICIOUS_PATTERNS = [
    /\.\./, // Parent directory traversal
    /^\./, // Hidden files
    /^-/, // Files starting with dash
    /__+/, // Multiple underscores
    /--+/, // Multiple dashes
  ];

  return !SUSPICIOUS_PATTERNS.some((pattern) => pattern.test(nameWithoutExt));
}

/**
 * Standard error message for invalid filenames
 */
export const INVALID_FILENAME_MESSAGE =
  "Invalid filename. Only alphanumeric characters, dashes, and underscores are allowed. No path traversal or suspicious patterns permitted.";
