import type { Message } from "../types";
import RecommendationDisplay from "./RecommendationDisplay";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const { text, recommendation, isUser } = message;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in mb-4`}>
      <div
        className={`max-w-[95%] rounded-xl px-4 py-3 shadow-md ${
          isUser
            ? "bg-primary rounded-br-none text-white"
            : "rounded-bl-none border border-gray-200 bg-gray-50 text-gray-800"
        }`}
      >
        {isUser ? (
          <p className="text-sm">{text}</p>
        ) : recommendation ? (
          <RecommendationDisplay recommendation={recommendation} />
        ) : (
          <p className="text-sm">{text}</p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
