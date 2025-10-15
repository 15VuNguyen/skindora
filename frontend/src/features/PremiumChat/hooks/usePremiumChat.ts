import { useCallback, useEffect, useRef, useState } from "react";

import type { Message } from "../types";
import { aiService } from "@/services/aiServicce";
import { logger } from "@/utils/logger";
import { toast } from "sonner";

interface ChatHistoryItem {
  role: string;
  content: string;
}

interface UsePremiumChatReturn {
  messages: Message[];
  input: string;
  isTyping: boolean;
  currentMessage: string;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  setInput: (value: string) => void;
  handleSend: () => Promise<void>;
  handleRateFeedback: (messageId: string, rating: number, comment?: string) => Promise<void>;
}

export const usePremiumChat = (): UsePremiumChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const viewportRef = useRef<HTMLDivElement>(null);
  const pendingAssistantMessageRef = useRef<string>("");
  const [hasProvidedFeedback, setHasProvidedFeedback] = useState(false);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    logger.info("🚀 Starting to send message:", input);

    const userMessage: Message = { id: Date.now().toString(), text: input, isUser: true };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);
    setCurrentMessage("");
    pendingAssistantMessageRef.current = "";

    const history: ChatHistoryItem[] = updatedMessages.slice(0, -1).map((msg) => ({
      role: msg.isUser ? "user" : "assistant",
      content: msg.text || "",
    }));

    logger.debug("📤 Prepared request:", {
      message: userMessage.text,
      historyLength: history.length,
      history,
    });

    try {
      logger.info("🌐 Requesting chat stream via aiService");
      const response = await aiService.startChatStream({
        message: userMessage.text ?? "",
        history,
      });

      logger.info("📡 Response received:", {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      logger.debug("📖 Reader created:", !!reader);

      if (reader) {
        let buffer = "";
        let eventCount = 0;

        while (true) {
          logger.debug("🔄 Reading next chunk...");
          const { done, value } = await reader.read();
          if (done) {
            logger.info("🏁 Stream reading complete");
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          logger.debug("📦 Received chunk:", chunk.length, "characters");

          buffer += chunk;
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          logger.debug("📝 Processing lines:", lines.length);

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              eventCount++;
              const data = line.slice(6);
              logger.debug(`📨 Event ${eventCount}:`, data);

              try {
                const event = JSON.parse(data);
                logger.debug("🔍 Parsed event:", event);

                if (event.type === "text") {
                  logger.debug("✍️ Adding text content:", event.content);
                  setCurrentMessage((prev) => {
                    const next = prev + event.content;
                    pendingAssistantMessageRef.current = next;
                    return next;
                  });
                } else if (event.type === "end") {
                  logger.info("🏁 Stream ended, finalizing message");
                  const finalMessage = pendingAssistantMessageRef.current;
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: Date.now().toString(),
                      text: finalMessage,
                      isUser: false,
                      hasSubmittedFeedback: hasProvidedFeedback,
                    },
                  ]);
                  setCurrentMessage("");
                  pendingAssistantMessageRef.current = "";
                  setIsTyping(false);
                } else if (event.type === "tool_call") {
                  logger.info("🔧 Tool call received:", event);
                } else if (event.type === "error") {
                  logger.error("❌ Error event received:", event);
                }
              } catch (parseError) {
                logger.error("❌ Failed to parse SSE data:", data, parseError);
              }
            }
          }
        }
        logger.info("📊 Total events processed:", eventCount);
      } else {
        logger.error("❌ No reader available");
      }
    } catch (error) {
      logger.error("❌ Error sending message:", error);
      setIsTyping(false);
    }
  }, [input, messages, hasProvidedFeedback]);

  const handleRateFeedback = useCallback(async (messageId: string, rating: number, comment?: string) => {
    if (hasProvidedFeedback) {
      toast.success("Bạn đã gửi đánh giá cho phiên tư vấn này rồi.");
      return;
    }

    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, isFeedbackSubmitting: true } : msg))
    );

    try {
      await aiService.submitFeedback({
        feature: "expert_chat",
        rating,
        comment,
        interactionId: messageId,
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, isFeedbackSubmitting: false, hasSubmittedFeedback: true, rating, feedbackComment: comment }
            : msg
        )
      );
      setHasProvidedFeedback(true);
      toast.success("Cảm ơn bạn đã đánh giá tư vấn của chuyên gia ảo!");
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, isFeedbackSubmitting: false } : msg))
      );
      const errorMessage =
        error instanceof Error ? error.message : "Không thể gửi đánh giá lúc này. Vui lòng thử lại.";
      toast.error(errorMessage);
    }
  }, [hasProvidedFeedback]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, isTyping, currentMessage]);

  return {
    messages,
    input,
    isTyping,
    currentMessage,
    viewportRef,
    setInput,
    handleSend,
    handleRateFeedback,
  };
};
