export interface VideoClip {
  id: string;
  src: string;
  name: string;
  duration: number;
  thumbnail?: string;
  script?: string;
  sessionId?: string;
  sectionIndex?: number;
  sectionTitle?: string;
  isRegenerating?: boolean;
  isGenerating?: boolean;
}

export type LayoutMode = "video-only" | "split" | "script-only";

export interface GenerationState {
  isGenerating: boolean;
  progress: number;
  stage: "script" | "video" | "complete";
  isPaused?: boolean;
  completedClips?: number;
  totalClips?: number;
}

export type AppState =
  | "onboarding"
  | "script-generation"
  | "editor"
  | "initial-video-generation";
