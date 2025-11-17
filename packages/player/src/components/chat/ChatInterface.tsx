import React from "react";

import "katex/dist/katex.min.css";

import { cn } from "@/lib/utils";
import { ChatContainer } from "./ChatContainer";
import { ChatInput } from "./ChatInput";

interface ChatInterfaceProps {
  className?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "h-screen flex flex-col overflow-hidden z-10 bg-slate-900/50 border border-slate-600/50 backdrop-blur-sm",
        className
      )}
    >
      <div className="bg-slate-800/60 px-6 py-4 border-b border-slate-600/50">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          <h1 className="text-slate-100 font-semibold text-lg">AI Chat Assistant</h1>
        </div>
      </div>
      <ChatContainer className="flex-1 overflow-hidden bg-transparent" />
      <ChatInput className="border-t border-slate-600/50 bg-slate-800/30" />
    </div>
  );
};
