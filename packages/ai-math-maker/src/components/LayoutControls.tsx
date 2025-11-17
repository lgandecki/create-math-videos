import { Button } from "@/components/ui/button";
import { Monitor, LayoutGrid, FileText } from "lucide-react";
import { LayoutMode } from "@/types";

interface LayoutControlsProps {
  layoutMode: LayoutMode;
  onLayoutChange: (mode: LayoutMode) => void;
}

export function LayoutControls({
  layoutMode,
  onLayoutChange,
}: LayoutControlsProps) {
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      <Button
        variant={layoutMode === "video-only" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLayoutChange("video-only")}
        className="gap-2"
      >
        <Monitor className="h-4 w-4" />
        Video
      </Button>

      <Button
        variant={layoutMode === "split" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLayoutChange("split")}
        className="gap-2"
      >
        <LayoutGrid className="h-4 w-4" />
        Split
      </Button>

      <Button
        variant={layoutMode === "script-only" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLayoutChange("script-only")}
        className="gap-2"
      >
        <FileText className="h-4 w-4" />
        Script
      </Button>
    </div>
  );
}
