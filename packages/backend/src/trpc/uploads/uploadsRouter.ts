import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { publicProcedure } from "../trpcRouter";
import { router } from "../trpcRouter";
import type { TRPCRouterRecord } from "@trpc/server";
import { MANIM_DIR } from "../../tools/video_consts";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

const uploadImageProcedure = publicProcedure
  .input(z.instanceof(FormData))
  .mutation(async ({ input, ctx }) => {
    const formData = input;
    const file = formData.get("image") as File;

    if (!file) {
      throw new Error("No file uploaded");
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File size exceeds 10MB limit");
    }

    // Create uploads directory if it doesn't exist
    await fs.mkdir(UPLOADS_DIR, { recursive: true });

    // Use original filename (like the multer config)
    const uniqueName = path.basename(file.name);
    const filePath = path.join(UPLOADS_DIR, uniqueName);

    // Convert File to Buffer and save
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Generate URL
    // Note: In production, you'd want to get the actual host from the request
    const url = `/uploads/${uniqueName}`;

    return { url };
  });

const uploadVideoEditImageProcedure = publicProcedure
  .input(z.instanceof(FormData))
  .mutation(async ({ input, ctx }) => {
    const formData = input;
    const file = formData.get("image") as File;

    if (!file) {
      throw new Error("No file uploaded");
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File size exceeds 10MB limit");
    }

    // Create uploads directory if it doesn't exist
    // await fs.mkdir(UPLOADS_DIR, { recursive: true });

    // Use original filename (like the multer config)
    const uniqueName = path.basename(file.name);
    const filePath = path.join(MANIM_DIR, uniqueName);
    console.log(`filePath`, filePath);

    // Convert File to Buffer and save
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Generate URL
    // Note: In production, you'd want to get the actual host from the request
    const url = `${uniqueName}`;

    return { url };
  });

const uploadVideoProcedure = publicProcedure
  .input(z.instanceof(FormData))
  .mutation(async ({ input, ctx }) => {
    const formData = input;
    const file = formData.get("video") as File;

    if (!file) {
      throw new Error("No file uploaded");
    }

    // Validate file type
    if (!file.type.startsWith("video/")) {
      throw new Error("Only video files are allowed");
    }

    // Validate file size (100MB limit for videos)
    if (file.size > 100 * 1024 * 1024) {
      throw new Error("File size exceeds 100MB limit");
    }

    // Create uploads directory if it doesn't exist
    await fs.mkdir(UPLOADS_DIR, { recursive: true });

    // Use original filename (like the multer config)
    const uniqueName = path.basename(file.name);
    const filePath = path.join(UPLOADS_DIR, uniqueName);

    // Convert File to Buffer and save
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Generate URL
    // Note: In production, you'd want to get the actual host from the request
    const url = `/uploads/${uniqueName}`;

    return { url };
  });

export const uploadsRouter = router({
  uploadImage: uploadImageProcedure,
  uploadVideo: uploadVideoProcedure,
  uploadVideoEditImage: uploadVideoEditImageProcedure,
});
