import pdf from "pdf-parse";
import path from "path";

// Function to convert PDF to Markdown
export async function convertPdfToMarkdown(
  base64Content: string,
  fileName: string,
): Promise<string> {
  try {
    // Remove data URL prefix if present (data:application/pdf;base64,)
    const base64Data = base64Content.replace(
      /^data:application\/pdf;base64,/,
      "",
    );

    // Convert base64 to buffer
    const pdfBuffer = Buffer.from(base64Data, "base64");

    // Parse PDF using pdf-parse
    const data = await pdf(pdfBuffer);

    // Extract text content
    const extractedText = data.text;

    // Basic Markdown formatting
    let markdown = `# ${path.parse(fileName).name}\n\n`;

    // Clean up the text and add basic formatting
    const lines = extractedText.split("\n");
    let formattedLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines
      if (!line) {
        if (
          formattedLines.length > 0 &&
          formattedLines[formattedLines.length - 1] !== ""
        ) {
          formattedLines.push("");
        }
        continue;
      }

      // Try to detect headings (lines that are all caps or start with numbers/bullets)
      const isNumericList = /^\d+\.?\s/.test(line);
      const isBulletList = /^[•*-]\s/.test(line);
      const isAllCapitals = line === line.toUpperCase() && line.includes(" ");
      const isHeading = isAllCapitals && line.length < 100;

      if (isNumericList || isBulletList) {
        formattedLines.push(line);
      } else if (isHeading) {
        formattedLines.push(`## ${line}`);
      } else {
        formattedLines.push(line);
      }
    }

    markdown += formattedLines.join("\n");

    return markdown;
  } catch (error) {
    console.error("Error converting PDF to markdown:", error);
    throw new Error(
      `Failed to convert PDF to markdown: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
