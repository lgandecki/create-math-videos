import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTutorialContext } from "@/hooks/useTutorialContext";

interface ChatInputProps {
  placeholder?: string;
  className?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ placeholder, className }) => {
  const { sendUserMessage, engineStatus, isStreamingComplete } = useTutorialContext();

  const [value, setValue] = useState("");
  const [hasTyped, setHasTyped] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Determine placeholder based on engine status
  const defaultPlaceholder =
    engineStatus === "waiting_for_estimation" || engineStatus === "waiting_for_answer"
      ? "Answer the question..."
      : "Ask a question...";

  const shouldGlow =
    isStreamingComplete &&
    (engineStatus === "waiting_for_estimation" || engineStatus === "waiting_for_answer") &&
    !hasTyped;

  useEffect(() => {
    if (engineStatus === "waiting_for_estimation" || engineStatus === "waiting_for_answer") {
      setHasTyped(false);
      inputRef.current?.focus();
    }
  }, [engineStatus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (!hasTyped && newValue.length > 0) {
      setHasTyped(true);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    const trimmedValue = value.trim();
    if (trimmedValue) {
      // Call the function from the context to send the message.
      sendUserMessage(trimmedValue);
      setValue("");
      setHasTyped(false);
    }
  };

  return (
    <div className={cn("p-4", className)}>
      <form onSubmit={handleSubmit} className="w-full">
        <div
          className={cn(
            "flex items-center gap-3 bg-slate-800/50 rounded-xl p-3 border border-slate-600/70 hover:border-slate-500/90 transition-colors backdrop-blur-md",
            shouldGlow && "animate-pulse-button-weak-glow"
          )}
        >
          <input
            ref={inputRef}
            id="chatInput"
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder || defaultPlaceholder}
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-400 outline-none text-sm"
            disabled={false}
            autoComplete="off"
          />
          <motion.button
            type="submit"
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              value.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                : "bg-slate-600 text-slate-400 cursor-not-allowed"
            )}
            whileTap={value.trim() ? { scale: 0.95 } : {}}
            disabled={!value.trim()}
          >
            <Send size={16} />
          </motion.button>
        </div>
      </form>
    </div>
  );
};
