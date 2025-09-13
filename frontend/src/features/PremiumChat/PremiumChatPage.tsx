import React, { useEffect, useRef, useState } from "react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ChatInput } from "./components/ChatInput";
import { ChatMessage } from "./components/ChatMessage";
import { type Message, getExpertResponse } from "./mockChatService";

const PremiumChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
    const scrollViewport = scrollAreaRef.current?.querySelector("[data-radix-scroll-area-viewport]");
    if (scrollViewport) {
      scrollViewport.scrollTop = scrollViewport.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <Card className="flex h-[85vh] flex-col rounded-xl shadow-2xl">
        <CardHeader className="border-b">
          <CardTitle>Tư Vấn 1-1 Cùng Chuyên Gia</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            <div className="space-y-6 pr-4">
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
        </CardContent>

        <CardFooter className="p-0">
          <ChatInput value={input} onChange={(e) => setInput(e.target.value)} onSend={handleSend} disabled={isTyping} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default PremiumChatPage;
