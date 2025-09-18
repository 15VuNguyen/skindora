import React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import type { Message } from "../mockChatService";
import { ProductRecommendationCard } from "./ProductRecommendationCard";
import { RoutineCard } from "./RoutineCard";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { text, product, routine, isUser } = message;

  return (
    <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>MA</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`max-w-[80%] rounded-xl px-4 py-3 shadow-md ${
          isUser ? "bg-primary rounded-br-none text-white" : "rounded-bl-none border bg-white text-gray-800"
        }`}
      >
        {text && <p className="text-sm">{text}</p>}
        {product && <ProductRecommendationCard product={product} />}
        {routine && <RoutineCard routine={routine} />}
      </div>
    </div>
  );
};
