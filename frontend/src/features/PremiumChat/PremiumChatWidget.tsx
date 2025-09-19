import React, { useEffect, useRef, useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Star, Sparkles, UserCheck } from "lucide-react";

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
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-[92vh] flex-col overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-white to-slate-50 p-0 shadow-2xl sm:max-w-3xl">
        <DialogHeader className="relative flex-shrink-0 border-b border-slate-200/80 bg-white/90 px-6 py-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-primary/40 shadow-sm">
              <AvatarImage src="https://i.imgur.com/3q0pL2K.png" alt="Chuyên gia Skindora" />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">SK</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <DialogTitle className="text-left text-lg font-semibold text-slate-900">
                Tư Vấn 1-1 Cùng Chuyên Gia
              </DialogTitle>
              <p className="text-sm text-slate-500">
                Skincare Specialist • 8+ năm kinh nghiệm lâm sàng
              </p>
            </div>
          </div>
          <Separator className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-500 sm:text-sm">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-2">
              <Star className="text-amber-400 h-4 w-4" />
              <div>
                <p className="font-semibold text-slate-700">4.9/5</p>
                <p>Đánh giá hài lòng</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-2">
              <UserCheck className="text-primary h-4 w-4" />
              <div>
                <p className="font-semibold text-slate-700">1200+</p>
                <p>Khách hàng tư vấn</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-2">
              <Sparkles className="text-pink-500 h-4 w-4" />
              <div>
                <p className="font-semibold text-slate-700">Ưu tiên</p>
                <p>Phản hồi trong 5 phút</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 flex-col overflow-hidden">
          <ScrollArea className="flex-1" ref={viewportRef}>
            <div className="space-y-6 px-6 py-8">
              {messages.length === 0 && !isTyping && (
                <div className="bg-slate-50/80 text-slate-500 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 px-6 py-10 text-center">
                  <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-700">Bắt đầu cuộc trò chuyện</h3>
                  <p className="text-sm">
                    Hãy chia sẻ về tình trạng da, routine hiện tại hoặc mục tiêu làm đẹp của bạn để chuyên gia hỗ trợ tốt nhất.
                  </p>
                  <Button variant="ghost" size="sm" className="mt-2" onClick={() => setInput("Da mình đang...")}>Gợi ý câu hỏi</Button>
                </div>
              )}

              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isTyping && (
                <div className="flex items-end justify-start gap-2">
                  <div className="max-w-[80%] rounded-2xl rounded-bl-none border border-slate-100 bg-white px-4 py-3 text-gray-800 shadow">
                    <div className="dot-typing"></div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-slate-200 bg-white/80 px-6 py-4 backdrop-blur">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-600">Gợi ý nhanh:</span>
              {[
                "Da mình đang khô ráp ở vùng má",
                "Routine hiện tại có phù hợp không?",
                "Nên ưu tiên sản phẩm nào buổi tối?",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  className="hover:bg-primary/10 text-primary/80 rounded-full border border-primary/20 px-3 py-1 transition"
                  onClick={() => setInput(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <ChatInput value={input} onChange={(e) => setInput(e.target.value)} onSend={handleSend} disabled={isTyping} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
