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

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isTyping]);

  // Automatically focus input when ready
  useEffect(() => {
    if (!isLoading && !isTyping) {
      inputRef.current?.focus();
    }
  }, [isLoading, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();

    const trimmedMessage = input.trim();

    if (!trimmedMessage || isLoading || isTyping) return;

    setError(null);

    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmedMessage },
    ]);

    setInput("");
    setIsLoading(true);

    try {
      const data = await sendAIMessage(trimmedMessage);
      const reply = data.reply || "";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "" },
      ]);

      setIsLoading(false);
      setIsTyping(true);

      for (let i = 0; i < reply.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 10));

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
        error.response?.data?.error || "Unable to connect to Respawn AI."
      );
    }
  };

  return (
    <div className="fixed z-[60] bottom-6 right-6 w-[560px] h-[720px] max-w-[calc(100vw-48px)] max-h-[calc(100dvh-48px)] max-md:bottom-5 max-md:right-[5vw] max-md:w-[90vw] max-md:h-[50dvh] max-md:max-h-[50dvh] bg-[#050505]/30 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
      <div className="h-full flex flex-col">

        {/* Header */}
        <div className="shrink-0 h-16 px-5 flex items-center justify-between border-b border-white/10 bg-black/15">
          <div>
            <h2 className="text-base font-black text-white">RESPAWN AI</h2>
            <p className="text-xs text-gray-400 mt-0.5">Gaming assistant</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close Respawn AI"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 max-md:px-4 max-md:py-4 max-md:space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[88%] rounded-xl px-4 py-3 text-[15px] leading-7 max-md:max-w-[92%] max-md:text-sm max-md:leading-6 ${
                  message.role === "user"
                    ? "bg-cyan-600/75 text-white"
                    : "bg-black/45 text-gray-200"
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-3">
                        <table className="w-full border-collapse text-sm">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-black/30 text-gray-100">
                        {children}
                      </thead>
                    ),
                    tbody: ({ children }) => <tbody>{children}</tbody>,
                    tr: ({ children }) => (
                      <tr className="border-b border-white/10">{children}</tr>
                    ),
                    th: ({ children }) => (
                      <th className="px-3 py-2 text-left font-bold border border-white/10 whitespace-nowrap">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-3 py-2 border border-white/10 text-gray-200 whitespace-nowrap">
                        {children}
                      </td>
                    ),
                    p: ({ children }) => (
                      <p className="mb-3 last:mb-0">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold text-white">{children}</strong>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc ml-6 mb-3 space-y-1">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal ml-6 mb-3 space-y-1">{children}</ol>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-xl font-bold text-white mb-3">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-lg font-bold text-white mb-3">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-base font-bold text-white mb-2">{children}</h3>
                    ),
                    code: ({ children }) => (
                      <code className="bg-black/50 rounded px-1.5 py-0.5 text-sm text-cyan-300">
                        {children}
                      </code>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {/* Thinking indicator */}
          {isLoading && !isTyping && (
            <div className="flex justify-start">
              <div className="bg-black/45 text-gray-400 rounded-xl px-4 py-3 text-sm">
                Thinking...
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-red-400 text-sm px-1">{error}</div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="shrink-0 p-4 max-md:p-3 border-t border-white/10 bg-black/15"
        >
          <div className="flex gap-3 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              disabled={isLoading || isTyping}
              autoComplete="off"
              className="flex-1 h-12 max-md:h-11 bg-black/35 border border-white/10 rounded-xl px-4 text-[15px] max-md:text-sm text-white placeholder:text-gray-500 outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/40 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={isLoading || isTyping || !input.trim()}
              className="shrink-0 h-12 w-12 max-md:h-11 max-md:w-11 bg-cyan-600/80 hover:bg-cyan-500 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-40"
              aria-label="Send message"
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