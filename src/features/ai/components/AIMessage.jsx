import React from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import AIActions from "./AIActions";

const AIMessage = ({ message, onClose }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`
          max-w-[88%]
          rounded-xl
          px-4 py-3
          text-sm
          leading-7
          max-md:max-w-[92%]
          ${
            isUser
              ? "bg-cyan-600/70 text-white"
              : "bg-black/40 text-gray-200"
          }
        `}
      >
        <MarkdownRenderer>
          {message.content}
        </MarkdownRenderer>

        {!isUser && (
          <AIActions
            actions={message.actions}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default AIMessage;