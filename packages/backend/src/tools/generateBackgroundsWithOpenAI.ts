import OpenAI from "openai";
import { ImageGenerateParamsBase } from "openai/resources/images.mjs";

const initialPrompt = `# Task
Your task is to generate a background image for the lesson. It shouldn't be very detailed, but should match the vibe or topic of the lesson.
For example if the lesson is about why is it colder in the mountains even though they are closer to the sun, make beautiful landscape with mountains.

## CRITICAL REQUIREMENTS - MUST FOLLOW
- NO TEXT whatsoever - no words, letters, numbers, signs, labels, or any written content
- NO CHARACTERS or people in the image - this is distracting to readers
- Pure background/landscape/abstract image only
- Clean, minimal composition without textual elements

## Style Guidelines
- Simple, atmospheric background
- Soft, muted colors that won't compete with text overlay
- Abstract or natural elements only
- No logos, watermarks, or typography

## Lesson Content

<LessonContent>
{{LESSON_MARKDOWN}}
</LessonContent>

Remember: Create a clean background image with absolutely NO text or characters.`;

export const generateBackgroundsWithOpenAI = async (
  lessonMarkdown: string,
  attempt = 1,
  quality = "low" as ImageGenerateParamsBase["quality"],
  size = "1536x1024" as ImageGenerateParamsBase["size"],
): Promise<Buffer<ArrayBufferLike>> => {
  const openAi = new OpenAI();

  let result: OpenAI.Images.ImagesResponse & { _request_id?: string | null };

  const prompt = initialPrompt.replace("{{LESSON_MARKDOWN}}", lessonMarkdown);

  try {
    result = await openAi.images.generate({
      model: "gpt-image-1",
      prompt,
      quality,
      size,
      background: "opaque",
    });
  } catch (error) {
    if (attempt < 3) {
      console.log(`Failed to generate image after ${attempt} attempts!`);
      console.log(`Retrying...`);
      return await generateBackgroundsWithOpenAI(
        lessonMarkdown,
        attempt + 1,
        quality,
        size,
      );
    } else {
      console.error(`Failed to generate image after 3 attempts!`);
      throw new Error(`Failed to generate image after 3 attempts!`);
    }
  }

  const image_base64 = result.data?.[0]?.b64_json;
  if (!image_base64) {
    throw new Error("No image base64 found");
  }
  return Buffer.from(image_base64, "base64");
};
