import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles } from "lucide-react";

interface OnboardingChatProps {
  onGenerate: (prompt: string) => void;
}

export function OnboardingChat({ onGenerate }: OnboardingChatProps) {
  const [prompt, setPrompt] = useState("");

  const handleSend = () => {
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Create Your Math Video</h1>
        <p className="text-lg text-muted-foreground">
          Describe what you want to teach and we'll create an educational video
          for you
        </p>
      </div>

      <div className="space-y-4">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe your math lesson... (e.g., 'Explain the quadratic formula with examples')"
          className="min-h-[120px] text-lg"
        />

        <div className="flex gap-2">
          <Button
            onClick={handleSend}
            disabled={!prompt.trim()}
            className="flex-1 gap-2"
            size="lg"
          >
            <Send className="h-4 w-4" />
            Chat
          </Button>

          <Button
            onClick={handleSend}
            disabled={!prompt.trim()}
            variant="default"
            className="gap-2"
            size="lg"
          >
            <Sparkles className="h-4 w-4" />
            Generate
          </Button>
        </div>
      </div>
    </div>
  );
}
