import { RiShining2Line } from "@remixicon/react";
import { ChatMessage } from "@/custom-components/chat-message";
import React from "react";

type Message = { role: "user" | "assistant"; content: string };

type ChatMessagesProps = {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
};

export function ChatMessages({ messages, messagesEndRef }: ChatMessagesProps) {
  return (
    <div className="max-w-3xl mx-auto mt-6 space-y-6">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
          <RiShining2Line size={32} className="mb-4" />
          <h2 className="text-lg font-semibold mb-2">Start a conversation</h2>
          <p className="text-sm">
            Select a model and ask anything to begin chatting with AI.
          </p>
        </div>
      ) : (
        <>
          <div className="text-center my-8">
            <div className="inline-flex items-center bg-white rounded-full border border-black/[0.08] shadow-xs text-xs font-medium py-1 px-3 text-foreground/80">
              <RiShining2Line
                className="me-1.5 text-muted-foreground/70 -ms-1"
                size={14}
                aria-hidden="true"
              />
              Today
            </div>
          </div>
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} isUser={msg.role === "user"}>
              <p>{msg.content}</p>
            </ChatMessage>
          ))}
          <div ref={messagesEndRef} aria-hidden="true" />
        </>
      )}
    </div>
  );
}
