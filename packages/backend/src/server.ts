import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
// import {
//   callGeminiWithThoughtsForEditing,
//   callGeminiWithThoughtsGeneric,
// } from "./callGemini";
import {
  returnSystemPromptForFileEditing,
  returnSystemPromptForAnsweringQuestions,
} from "./returnSystemPrompt";
import { originalCallAI, originalCallAIWithStreaming } from "./originalCallAI";
import { callWithJsonStreaming } from "./differentJsonStreaming";
import { convertPdfToMarkdown } from "./convertPdfToMarkdown";
import { convertDocxToMarkdown } from "./convertDocxToMarkdown";
import { imageUploadRouter } from "./routes/imageUpload";
import { lessonBackgroundsRouter } from "./routes/lessonBackgrounds";
import { lessonsRouter } from "./routes/lessons";
import { createTRPCMiddleware } from "./trpc/actualRouter";
import { createVideo } from "./tools/createVideo";
import { updateVideo } from "./tools/updateVideo";

const GEMINI_DEBUG = process.env.GEMINI_DEBUG === "true";

console.log("GEMINI_DEBUG", GEMINI_DEBUG);
// Enable better error traces
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  console.error("Stack:", error.stack);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  if (reason instanceof Error) {
    console.error("Stack:", reason.stack);
  }
});

const app = express();
const PORT = 3001; // Separate from frontend

const httpServer = createServer(app);
const io = new Server(httpServer, {
  path: "/ws",
  cors: {
    origin: /^http:\/\/localhost:\d+$/,
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: /^http:\/\/localhost:\d+$/,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// IMPORTANT: Do not use bodyParser.json() before TRPC middleware
// TRPC needs to handle body parsing itself for non-JSON content types like FormData

// Apply JSON body parser only to specific routes that need it
app.use("/api", bodyParser.json());

// Add SSE-specific headers for TRPC subscriptions
app.use("/trpc", (req, res, next) => {
  // Set headers for SSE to prevent buffering
  if (req.method === "GET" && req.url?.includes("subscription")) {
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // Disable Nginx buffering
  }
  next();
});

// TRPC middleware must come before any body parsing middleware
app.use("/trpc", createTRPCMiddleware());

// Other routers after TRPC
app.use(imageUploadRouter);
app.use(lessonBackgroundsRouter);
app.use(lessonsRouter);
const histories: Record<string, any[]> = {}; // Session history

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("error", (err) => {
    if (err && (err as { code?: string }).code === "ECONNRESET") {
      console.warn(
        `Connection was forcibly closed by client ${socket.id}. This is often normal.`,
      );
    } else {
      console.error(
        `An unexpected error occurred on socket ${socket.id}:`,
        err,
      );
    }
  });

  socket.on("ai-answer-question", async (data) => {
    const { answer, conversationHistory, sessionId } = data;
    await callWithJsonStreaming(
      answer,
      conversationHistory,
      (delta) => {
        console.log("question-response-delta", delta);
        socket.emit("question-response-delta", { response: delta });
      },
      () => {
        console.log("question-response-complete");
        socket.emit("question-response-complete");
      },
      (isTrue) => {
        console.log("answer evaluated isTrue", isTrue);
        socket.emit("answer-evaluated", { isTrue });
      },
    );
  });
  socket.on("ai-call", async (data) => {
    const { question, conversationHistory, jsonSchema } = data;
    await originalCallAIWithStreaming(
      question,
      conversationHistory,
      (response) => {
        socket.emit("question-response-delta", { response });
      },
      () => {
        socket.emit("question-response-complete");
      },
    );
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });

  socket.on("create-video", async (data) => {
    const { prompt, sectionIndex, sectionTitle } = data;
    console.log("create-video", { prompt, sectionIndex, sectionTitle });
    await createVideo(
      prompt,
      (delta) => {
        socket.emit("video-response-delta", {
          response: delta,
          sectionIndex,
        });
      },
      (videoPath, sessionId, thumbnailPath) => {
        if (videoPath) {
          socket.emit("video-path", {
            path: videoPath,
            thumbnailPath: thumbnailPath,
            sectionIndex,
          });
        }
        socket.emit("video-response-complete", {
          sectionIndex,
          sessionId,
        });
      },
      sectionTitle,
    );
  });

  socket.on("update-video", async (data) => {
    const { prompt, sectionIndex, sectionTitle, sessionId } = data;
    console.log("update-video", {
      prompt,
      sectionIndex,
      sectionTitle,
      sessionId,
    });
    await updateVideo(
      prompt,
      sessionId,
      (delta) => {
        socket.emit("video-response-delta", {
          response: delta,
          sectionIndex,
        });
      },
      (videoPath, sessionId, thumbnailPath) => {
        if (videoPath) {
          socket.emit("video-path", {
            path: videoPath,
            thumbnailPath: thumbnailPath,
            sectionIndex,
          });
        }
        socket.emit("video-response-complete", {
          sectionIndex,
          sessionId,
        });
      },
      sectionTitle,
    );
  });
});

// THIS IS NEEDED IN THE PLAYER, WAIT BEFORE MOVING TO TRPC
app.post("/api/callAI", async (req, res) => {
  const { prompt, conversationHistory, jsonSchema } = req.body;
  console.log("prompt", prompt);
  const response = await originalCallAI(
    prompt,
    conversationHistory,
    jsonSchema,
  );
  res.json({ response });
});

httpServer.listen(PORT, () =>
  console.log(`Backend on http://localhost:${PORT}`),
);
