// Encode a user-friendly title to a filesystem-safe filename
export function encodeFileName(title: string): string {
  // Replace common problematic characters with URL-encoded equivalents
  return title
    .replace(/\//g, "%2F") // Forward slash
    .replace(/\\/g, "%5C") // Backslash
    .replace(/\?/g, "%3F") // Question mark
    .replace(/</g, "%3C") // Less than
    .replace(/>/g, "%3E") // Greater than
    .replace(/:/g, "%3A") // Colon
    .replace(/\*/g, "%2A") // Asterisk
    .replace(/\|/g, "%7C") // Pipe
    .replace(/"/g, "%22") // Double quote
    .replace(/\n/g, "%0A") // Newline
    .replace(/\r/g, "%0D") // Carriage return
    .replace(/\t/g, "%09"); // Tab
}

// Decode a filesystem-safe filename back to user-friendly title
export function decodeFileName(filename: string): string {
  // Remove .md extension if present
  const nameWithoutExt = filename.endsWith(".md")
    ? filename.slice(0, -3)
    : filename;

  // Decode URL-encoded characters back to original
  return nameWithoutExt
    .replace(/%2F/g, "/")
    .replace(/%5C/g, "\\")
    .replace(/%3F/g, "?")
    .replace(/%3C/g, "<")
    .replace(/%3E/g, ">")
    .replace(/%3A/g, ":")
    .replace(/%2A/g, "*")
    .replace(/%7C/g, "|")
    .replace(/%22/g, '"')
    .replace(/%0A/g, "\n")
    .replace(/%0D/g, "\r")
    .replace(/%09/g, "\t");
}
