import React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import type { Message } from "../mockChatService";
import { ProductRecommendationCard } from "./ProductRecommendationCard";
import { RoutineCard } from "./RoutineCard";

interface ChatMessageProps {
  message: Message;
}

const renderBoldSegments = (segment: string) =>
  segment.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`bold-${index}`}>{part.slice(2, -2)}</strong>;
    }

    return <span key={`text-${index}`}>{part}</span>;
  });

const renderMessageText = (content: string) => {
  const normalized = content.replace(/([^\n])\* \*\*/g, "$1\n* **");
  const lines = normalized
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length === 0) return;
    blocks.push(
      <ul className="ml-4 list-disc space-y-1" key={`list-${blocks.length}`}>
        {listBuffer.map((item, idx) => (
          <li key={`list-item-${idx}`}>{renderBoldSegments(item)}</li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  lines.forEach((line) => {
    if (line.startsWith("* ")) {
      listBuffer.push(line.slice(2));
    } else {
      flushList();
      blocks.push(
        <p className="leading-relaxed" key={`paragraph-${blocks.length}`}>
          {renderBoldSegments(line)}
        </p>
      );
    }
  });

  flushList();

  return blocks;
};

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
        {text && <div className="space-y-2 text-sm">{renderMessageText(text)}</div>}
        {product && <ProductRecommendationCard product={product} />}
        {routine && <RoutineCard routine={routine} />}
      </div>
    </div>
  );
};
