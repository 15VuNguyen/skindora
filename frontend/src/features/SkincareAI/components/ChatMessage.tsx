import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { AIFeedbackPrompt } from "@/components/ai/AIFeedbackPrompt";

import type { Message, RoutineDetailsForSaving } from "../types";
import RecommendationDisplay from "./RecommendationDisplay";
interface ChatMessageProps {
  message: Message;
  onApplyRoutine: (routineData: RoutineDetailsForSaving) => void;
  isAuthenticated: boolean;
  onRateFeedback: (messageId: string, rating: number, comment?: string) => void | Promise<void>;
}

const ChatMessage = ({ message, onApplyRoutine, isAuthenticated, onRateFeedback }: ChatMessageProps) => {
  const { text, recommendation, isUser } = message;
  const navigate = useNavigate(); 

  const handleFeedbackSubmit = (value: number, comment?: string) => {
    if (!message.id) return;
    onRateFeedback(message.id, value, comment);
  };

  const shouldRenderFeedbackPrompt = !isUser && message.id && (!message.hasSubmittedFeedback || message.rating);

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`animate-fade-in w-full max-w-[95%] rounded-xl px-4 py-3 shadow-md ${
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

      {!isUser && message.recommendation?.routineDetailsForSaving && (
        <div className="animate-fade-in mt-4 max-w rounded-lg bg-emerald-50 p-4 text-center w-full">
          <p className="mb-2 font-semibold text-emerald-800">AI has suggested a detailed weekly routine for you!</p>
          {isAuthenticated ? (
            <Button
              onClick={() => {
                if (message.recommendation?.routineDetailsForSaving) {
                  onApplyRoutine(message.recommendation.routineDetailsForSaving);
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Apply Your Routine Now!
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => navigate("/auth/login")}
              className="border-emerald-600 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
            >
              Login to Apply Routine
            </Button>
          )}
        </div>
      )}
      {shouldRenderFeedbackPrompt && (
        <AIFeedbackPrompt
          hasSubmitted={Boolean(message.hasSubmittedFeedback)}
          currentRating={message.rating}
          currentComment={message.feedbackComment}
          isSubmitting={Boolean(message.isFeedbackSubmitting)}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
};

export default ChatMessage;
