"use client";

import { ScrollArea } from "@/components/scroll-area";
import { ChatHeader } from "@/components/chat-header";
import { ChatMessages } from "@/components/chat-messages";
import { ChatInput } from "@/components/chat-input";
import { useRef, useEffect, useState } from "react";
import { useSettingsPanel } from "@/components/settings-panel";

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    selectedModel,
    responseFormat,
    writingStyle,
    mode,
    temperature,
    maxTokens,
    topP,
  } = useSettingsPanel();

  // Reset chat history when any preset/config changes
  useEffect(() => {
    setMessages([]);
    setInput("");
  }, [
    selectedModel,
    responseFormat,
    writingStyle,
    mode,
    temperature,
    maxTokens,
    topP,
  ]);
  type Message = { role: "user" | "assistant"; content: string };
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    try {
      // Always use latest settings for system prompt
      const systemPrompt = `You are an AI assistant. Respond in a ${responseFormat} format, with a ${writingStyle} writing style, and behave as a ${mode}.`;
      console.log("🚀 ~ sendMessage ~ systemPrompt:", systemPrompt);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requestBody: Record<string, any> = {
        model: selectedModel,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          userMessage,
        ],
      };
      // Only add supported fields if they have valid values
      if (typeof temperature === "number")
        requestBody.temperature = temperature;
      if (typeof topP === "number") requestBody.top_p = topP;
      if (typeof maxTokens === "number") requestBody.max_length = maxTokens;
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        // Show error from API if available
        const errorMsg =
          data.error?.message || JSON.stringify(data) || "Unknown error.";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `API Error: ${errorMsg}` },
        ]);
        console.error("OpenRouter API error:", data);
      } else if (!data.choices || !data.choices[0]?.message?.content) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "This model may not be supported or did not return a response.",
          },
        ]);
        console.warn("OpenRouter response:", data);
      } else {
        const assistantReply = data.choices[0].message.content;
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: assistantReply },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: Could not get response." },
      ]);
      console.error("Network or code error:", err);
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <ScrollArea className="flex-1 [&>div>div]:h-full w-full shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl bg-background">
      <div className="h-full flex flex-col px-4 md:px-6 lg:px-8">
        <ChatHeader />
        <div className="relative grow">
          <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />
        </div>
        <div className="sticky bottom-0 pt-4 md:pt-8 z-50">
          <div className="max-w-3xl mx-auto bg-background rounded-[20px] pb-4 md:pb-8">
            <ChatInput
              input={input}
              setInput={setInput}
              loading={loading}
              onSend={sendMessage}
              selectedModel={selectedModel}
            />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
