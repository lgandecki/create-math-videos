import path from "path";
import mammoth from "mammoth";
import TurndownService from "turndown";

export async function convertDocxToMarkdown(
  base64Content: string,
  fileName: string,
): Promise<string> {
  try {
    const base64Data = base64Content.replace(
      /^data:application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document;base64,/,
      "",
    );

    // Convert base64 to buffer
    const docxBuffer = Buffer.from(base64Data, "base64");

    // Basic Markdown formatting
    const title = `# ${path.parse(fileName).name}\n\n`;

    const turndownService = new TurndownService();

    // Use async/await pattern for mammoth.convertToHtml
    const result = await mammoth.convertToHtml({ buffer: docxBuffer });
    const html = result.value; // The generated HTML
    const markdownContent = turndownService.turndown(html);

    const markdown = title + markdownContent;

    return markdown;
  } catch (error) {
    console.error("Error converting DOCX to markdown:", error);
    throw new Error(
      `Failed to convert DOCX to markdown: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
