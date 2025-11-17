import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

import { cn } from "@/lib/utils";
import { useTutorialContext } from "@/hooks/useTutorialContext";
import { ChatMessage } from "./ChatMessage";
import { ChatLoadingIndicator } from "./ChatLoadingIndicator";
import { ChatActions } from "./ChatActions";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatContainerProps {
  className?: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ className }) => {
  const { conversationHistory, engineStatus, isStreamingComplete } = useTutorialContext();

  const scrollSentinelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isWaitingForAiResponse =
    conversationHistory.length > 0 && conversationHistory[conversationHistory.length - 1].role === "user";

  // Scroll to the bottom whenever conversation history changes or content streams in.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollToBottom = () => {
      if (scrollSentinelRef.current) {
        scrollSentinelRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    };

    const observer = new MutationObserver(scrollToBottom);

    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    scrollToBottom();

    return () => {
      observer.disconnect();
    };
  }, []);

  const shouldShowActions = engineStatus === "waiting_for_go_on" && !isWaitingForAiResponse && isStreamingComplete;

  return (
    <ScrollArea className={cn("h-full", className)}>
      <div ref={containerRef} className="px-4 py-6 space-y-4" style={{ scrollBehavior: "smooth" }}>
        {/* Display non-empty messages */}
        {conversationHistory
          .filter((message) => message.content.trim() !== "")
          .map((message) => (
            <ChatMessage key={`chat-${message.role}-${message.timestamp}`} message={message} />
          ))}

        {/* Show waiting indicator if the last message was from the user */}
        {isWaitingForAiResponse && <ChatLoadingIndicator />}

        {/* Show inline actions as a separate chat line when waiting for go on and streaming is complete */}
        <AnimatePresence>
          {shouldShowActions && (
            <div className="flex justify-end mb-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.5, ease: "easeInOut", delay: 0.2 },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                className="max-w-[80%]"
                style={{ transformOrigin: "right center" }}
              >
                <ChatActions />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Invisible sentinel element for smooth scrolling */}
        <div ref={scrollSentinelRef} className="h-0" aria-hidden="true" />
      </div>
    </ScrollArea>
  );
};
