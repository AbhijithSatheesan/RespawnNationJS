import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sendAIMessage } from "./aiServices";

const AIChatWindow = ({ onClose }) => {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey! I'm Respawn AI. How can I help you?",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  // Used to scroll to the newest message
  const messagesEndRef = useRef(null);

  // Automatically scroll to the newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();

    const trimmedMessage = input.trim();

    if (!trimmedMessage || isLoading || isTyping) {
      return;
    }

    setError(null);

    // Add user's message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: trimmedMessage,
      },
    ]);

    setInput("");
    setIsLoading(true);

    try {
      // Send message to backend
      const data = await sendAIMessage(trimmedMessage);

      const reply = data.reply || "";

      // Add an empty assistant message first
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
        },
      ]);

      // Stop "Thinking..."
      setIsLoading(false);

      // Start typewriter effect
      setIsTyping(true);

      for (let i = 0; i < reply.length; i++) {
        await new Promise((resolve) =>
          setTimeout(resolve, 10)
        );

        setMessages((prev) => {
          const updatedMessages = [...prev];

          updatedMessages[updatedMessages.length - 1] = {
            role: "assistant",
            content: reply.slice(0, i + 1),
          };

          return updatedMessages;
        });
      }

      setIsTyping(false);

    } catch (error) {
      console.error("AI request failed:", error);

      setIsLoading(false);
      setIsTyping(false);

      setError(
        error.response?.data?.error ||
          "Unable to connect to Respawn AI."
      );
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[60] w-[380px] h-[520px] bg-[#0a0a0c] border border-gray-800 rounded-lg shadow-2xl">

      <div className="h-full flex flex-col">

        {/* HEADER */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-gray-800">

          <div>
            <h2 className="text-sm font-black text-white">
              RESPAWN AI
            </h2>

            <p className="text-[10px] text-gray-500">
              Gaming assistant
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close Respawn AI"
          >
            ✕
          </button>

        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-900 text-gray-300"
                }`}
              >

                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{

                    table: ({ children }) => (
                      <div className="overflow-x-auto my-2">
                        <table className="w-full border-collapse text-xs">
                          {children}
                        </table>
                      </div>
                    ),

                    thead: ({ children }) => (
                      <thead className="bg-gray-800 text-gray-200">
                        {children}
                      </thead>
                    ),

                    tbody: ({ children }) => (
                      <tbody>
                        {children}
                      </tbody>
                    ),

                    tr: ({ children }) => (
                      <tr className="border-b border-gray-800">
                        {children}
                      </tr>
                    ),

                    th: ({ children }) => (
                      <th className="px-3 py-2 text-left font-bold border border-gray-700 whitespace-nowrap">
                        {children}
                      </th>
                    ),

                    td: ({ children }) => (
                      <td className="px-3 py-2 border border-gray-800 text-gray-300 whitespace-nowrap">
                        {children}
                      </td>
                    ),

                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">
                        {children}
                      </p>
                    ),

                    strong: ({ children }) => (
                      <strong className="font-bold text-white">
                        {children}
                      </strong>
                    ),

                    ul: ({ children }) => (
                      <ul className="list-disc ml-5 mb-2 space-y-1">
                        {children}
                      </ul>
                    ),

                    ol: ({ children }) => (
                      <ol className="list-decimal ml-5 mb-2 space-y-1">
                        {children}
                      </ol>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>

              </div>

            </div>
          ))}

          {/* THINKING INDICATOR */}
          {isLoading && !isTyping && (
            <div className="flex justify-start">

              <div className="bg-gray-900 text-gray-400 rounded-lg px-3 py-2 text-sm">
                Thinking...
              </div>

            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="text-red-400 text-xs">
              {error}
            </div>
          )}

          {/* Scroll target */}
          <div ref={messagesEndRef} />

        </div>

        {/* INPUT */}
        <form
          onSubmit={handleSend}
          className="p-3 border-t border-gray-800"
        >

          <div className="flex gap-2">

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              disabled={isLoading || isTyping}
              className="flex-1 bg-[#050505] border border-gray-800 rounded px-3 py-2 text-sm text-white outline-none focus:border-cyan-500 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={
                isLoading ||
                isTyping ||
                !input.trim()
              }
              className="px-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white rounded transition-colors"
            >
              ➤
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AIChatWindow;