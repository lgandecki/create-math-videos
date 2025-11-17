import React from "react";

import { LlmMarkdown } from "./LlmMarkdown";
import { Message } from "@/context/TutorialContext";
import { StreamingMarkdown } from "./StreamingMarkdown";
import { GraduationCap } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex mb-4">
        <div className="max-w-[80%]">
          <div className="bg-slate-700/80 rounded-2xl rounded-tl-md px-4 py-3 border border-slate-600/50 backdrop-blur-sm flex flex-row gap-3 justify-center items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="text-white" size={16} />
            </div>
            <div className="text-slate-100 leading-relaxed prose">
              <LlmMarkdown content={message.content} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-slate-100 leading-relaxed whitespace-break-spaces">
      <StreamingMarkdown content={message.content} />
    </div>
  );
};
