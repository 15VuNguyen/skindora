import { Sparkles, Star, UserCheck } from "lucide-react";
import React, { useCallback } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { ChatInput } from "./components/ChatInput";
import { ChatMessage } from "./components/ChatMessage";
import { usePremiumChat } from "./hooks/usePremiumChat";

interface PremiumChatWidgetProps {
  children: React.ReactNode;
}

export const PremiumChatWidget: React.FC<PremiumChatWidgetProps> = ({ children }) => {
  const { messages, input, isTyping, currentMessage, viewportRef, setInput, handleSend } = usePremiumChat();

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setInput(suggestion);
    },
    [setInput]
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-[92vh] flex-col overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-white to-slate-50 p-0 shadow-2xl sm:max-w-3xl">
        <DialogHeader className="relative flex-shrink-0 border-b border-slate-200/80 bg-white/90 px-6 py-5">
          <div className="flex items-center gap-4">
            <Avatar className="border-primary/40 h-12 w-12 border-2 shadow-sm">
              <AvatarImage src="https://i.imgur.com/3q0pL2K.png" alt="Chuyên gia Skindora" />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">SK</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <DialogTitle className="text-left text-lg font-semibold text-slate-900">
                Tư Vấn 1-1 Cùng Chuyên Gia
              </DialogTitle>
              <p className="text-sm text-slate-500">Skincare Specialist • 8+ năm kinh nghiệm lâm sàng</p>
            </div>
          </div>
          <Separator className="via-primary/10 absolute right-0 bottom-0 left-0 bg-gradient-to-r from-transparent to-transparent" />
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-500 sm:text-sm">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-2">
              <Star className="h-4 w-4 text-amber-400" />
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
              <Sparkles className="h-4 w-4 text-pink-500" />
              <div>
                <p className="font-semibold text-slate-700">Ưu tiên</p>
                <p>Phản hồi trong 5 phút</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 flex-col overflow-hidden">
          <ScrollArea className="flex-1 max-h-[60vh]" ref={viewportRef}>
            <div className="space-y-6 px-6 py-8">
              {messages.length === 0 && !isTyping && (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center text-slate-500">
                  <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-700">Bắt đầu cuộc trò chuyện</h3>
                  <p className="text-sm">
                    Hãy chia sẻ về tình trạng da, routine hiện tại hoặc mục tiêu làm đẹp của bạn để chuyên gia hỗ trợ
                    tốt nhất.
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleSuggestionClick("Da mình đang...")}
                  >
                    Gợi ý câu hỏi
                  </Button>
                </div>
              )}

              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isTyping && (
                <div className="flex items-end justify-start gap-2">
                  <div className="max-w-[80%] rounded-2xl rounded-bl-none border border-slate-100 bg-white px-4 py-3 text-gray-800 shadow">
                    {currentMessage || <div className="dot-typing"></div>}
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
                  className="hover:bg-primary/10 text-primary/80 border-primary/20 rounded-full border px-3 py-1 transition"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <ChatInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onSend={handleSend}
              disabled={isTyping}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
