import React, { useEffect, useRef, useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ChatInput } from "./components/ChatInput";
import { ChatMessage } from "./components/ChatMessage";
import { type Message, getExpertResponse } from "./mockChatService";

interface PremiumChatWidgetProps {
  children: React.ReactNode;
}

export const PremiumChatWidget: React.FC<PremiumChatWidgetProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, isUser: true };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    const userMessageCount = updatedMessages.filter((m) => m.isUser).length;
    const expertResponses = await getExpertResponse(userMessageCount);
    setMessages((prev) => [...prev, ...expertResponses]);
    setIsTyping(false);
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    // The JSX structure remains the same as the last version
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-[90vh] flex-col p-0 sm:max-w-2xl">
        <DialogHeader className="flex-shrink-0 border-b p-6 pb-4">
          <DialogTitle>Tư Vấn 1-1 Cùng Chuyên Gia</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <ScrollArea className="h-full" ref={viewportRef}>
            <div className="space-y-6 p-6">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isTyping && (
                <div className="flex items-end justify-start gap-2">
                  <div className="max-w-[80%] rounded-xl rounded-bl-none border bg-white px-4 py-3 text-gray-800 shadow-md">
                    <div className="dot-typing"></div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <div className="flex-shrink-0">
          <ChatInput value={input} onChange={(e) => setInput(e.target.value)} onSend={handleSend} disabled={isTyping} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
