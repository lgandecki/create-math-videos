import express, { Router } from "express";
import path from "path";
import fs from "fs/promises";

export const imageUploadRouter: Router = express.Router();
const UPLOADS_DIR = path.join(process.cwd(), "uploads");

// Serve uploaded files statically
imageUploadRouter.use("/uploads", express.static(UPLOADS_DIR));

// NOTE: Upload endpoints have been migrated to TRPC
