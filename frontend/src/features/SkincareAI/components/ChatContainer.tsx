import { useEffect, useRef, useState } from "react";
import { ResizableBox } from "react-resizable";
import type { ResizableBoxProps } from "react-resizable";

import type { Message } from "../types";
import ChatMessage from "./ChatMessage";

interface ChatContainerProps {
  messages: Message[];
  isAnalyzing: boolean;
}

const ChatContainer = ({ messages, isAnalyzing }: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContentRef = useRef<HTMLDivElement>(null);

  const [chatHeight, setChatHeight] = useState(680);
  const [chatWidth, setChatWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setChatWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const onResize: ResizableBoxProps["onResize"] = (_event, { size }) => {
    setChatHeight(size.height);
  };

  return (
    <div ref={containerRef} className="animate-fade-in w-full">
      {chatWidth > 0 && (
        <ResizableBox
          width={chatWidth}
          height={chatHeight}
          onResize={onResize}
          axis="y"
          resizeHandles={["s"]}
          minConstraints={[chatWidth > 300 ? 300 : chatWidth, 300]}
          maxConstraints={[chatWidth, 1280]}
          className="react-resizable flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl"
        >
          <div className="bg-primary sticky top-0 flex-shrink-0 p-4 text-white">
            <h3 className="text-center text-lg font-medium">Personalized Skin Recommendations</h3>
          </div>

          <div ref={chatContentRef} className="flex-grow space-y-4 overflow-y-auto bg-gray-50 p-4 md:p-6">
            {messages.length > 0 ? (
              <>
                {messages.map((msg, index) => (
                  <ChatMessage key={msg.id || index} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center space-y-4 text-center text-gray-400">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-300/30">
                  <span className="text-skin-blue text-4xl">🧴</span>
                </div>
                <p className="text-xl font-medium text-gray-600">Ready for your skin glow-up?</p>
                <p className="text-md max-w-sm text-gray-500">
                  Upload a photo of your face, or use the Demo Mode, to receive your personalized skincare product
                  recommendations.
                </p>
              </div>
            )}

            {isAnalyzing && (
              <div className="mb-4 flex justify-start">
                <div className="rounded-xl rounded-bl-none bg-gray-200 px-4 py-3 text-gray-700 shadow-md">
                  <div className="flex items-center space-x-2">
                    <div className="dot-typing"></div>
                    <span className="text-sm">Analyzing your skin...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ResizableBox>
      )}
    </div>
  );
};

export default ChatContainer;
