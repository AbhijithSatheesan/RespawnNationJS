import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { sendAIMessage } from "./aiServices";
import {
  addMessage,
  setSummary,
} from "./aiChatSlice";

import AIChatHeader from "./components/AIChatHeader";
import AIMessage from "./components/AIMessage";
import AIInput from "./components/AIInput";
import MarkdownRenderer from "./components/MarkdownRenderer";

const CHAT_WIDTH = 560;
const CHAT_HEIGHT = 720;
const GAP = 16;
const EDGE = 12;

const getChatPosition = (button) => {
  const mobile = window.innerWidth < 768;

  const width = mobile
    ? window.innerWidth * 0.9
    : CHAT_WIDTH;

  const height = mobile
    ? window.innerHeight * 0.5
    : CHAT_HEIGHT;

  const buttonCenterX = button.x + 30;

  let x =
    buttonCenterX > window.innerWidth / 2
      ? button.x - width - GAP
      : button.x + 60 + GAP;

  let y =
    button.y + 30 - height / 2;

  x = Math.max(
    EDGE,
    Math.min(
      x,
      window.innerWidth - width - EDGE
    )
  );

  y = Math.max(
    EDGE,
    Math.min(
      y,
      window.innerHeight - height - EDGE
    )
  );

  return { x, y };
};

const AIChatWindow = ({
  buttonPosition,
  onClose,
}) => {
  const dispatch = useDispatch();

  const { messages, summary } = useSelector(
    (state) => state.aiChat
  );

  const [input, setInput] = useState("");
  const [typingReply, setTypingReply] =
    useState("");
  const [isLoading, setIsLoading] =
    useState(false);
  const [isTyping, setIsTyping] =
    useState(false);
  const [error, setError] = useState(null);

  const [position, setPosition] = useState(() =>
    getChatPosition(buttonPosition)
  );

  const dragRef = useRef(null);
  const windowRef = useRef(null);
  const messagesRef = useRef(null);
  const inputRef = useRef(null);
  const frameRef = useRef(null);

  // -----------------------------
  // Chat scrolling
  // -----------------------------

  useEffect(() => {
    const container = messagesRef.current;

    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }, [
    messages,
    typingReply,
    isLoading,
    isTyping,
  ]);

  // -----------------------------
  // Input focus
  // -----------------------------

  useEffect(() => {
    if (!isLoading && !isTyping) {
      inputRef.current?.focus();
    }
  }, [isLoading, isTyping]);

  // -----------------------------
  // Textarea resize
  // -----------------------------

  useEffect(() => {
    const textarea = inputRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";

    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      140
    )}px`;
  }, [input]);

  // -----------------------------
  // Dragging
  // -----------------------------

  const handleDragStart = (e) => {
    if (e.target.closest("button")) return;

    const rect =
      windowRef.current.getBoundingClientRect();

    dragRef.current = {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      x: position.x,
      y: position.y,
    };

    e.currentTarget.setPointerCapture(
      e.pointerId
    );
  };

  const handleDragMove = (e) => {
    if (!dragRef.current) return;

    const rect =
      windowRef.current.getBoundingClientRect();

    const x = Math.max(
      EDGE,
      Math.min(
        e.clientX -
          dragRef.current.offsetX,
        window.innerWidth -
          rect.width -
          EDGE
      )
    );

    const y = Math.max(
      EDGE,
      Math.min(
        e.clientY -
          dragRef.current.offsetY,
        window.innerHeight -
          rect.height -
          EDGE
      )
    );

    dragRef.current.x = x;
    dragRef.current.y = y;

    if (!frameRef.current) {
      frameRef.current =
        requestAnimationFrame(() => {
          windowRef.current.style.transform =
            `translate3d(
              ${dragRef.current.x}px,
              ${dragRef.current.y}px,
              0
            )`;

          frameRef.current = null;
        });
    }
  };

  const handleDragEnd = (e) => {
    if (!dragRef.current) return;

    const { x, y } = dragRef.current;

    dragRef.current = null;

    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    setPosition({ x, y });

    e.currentTarget.releasePointerCapture?.(
      e.pointerId
    );
  };

  // -----------------------------
  // Send message
  // -----------------------------

  const handleSend = async (e) => {
    e.preventDefault();

    const message = input.trim();

    if (
      !message ||
      isLoading ||
      isTyping
    ) {
      return;
    }

    setError(null);

    const previousMessages = messages;

    dispatch(
      addMessage({
        role: "user",
        content: message,
      })
    );

    setInput("");
    setIsLoading(true);

    try {
      const data = await sendAIMessage({
        message,
        history: previousMessages,
        summary,
      });

      const reply = data.reply || "";

      const actions = Array.isArray(
        data.actions
      )
        ? data.actions
        : [];

      if (
        data.summary !== undefined
      ) {
        dispatch(
          setSummary(data.summary)
        );
      }

      setIsLoading(false);
      setIsTyping(true);
      setTypingReply("");

      const step = 3;

      for (
        let i = 0;
        i < reply.length;
        i += step
      ) {
        await new Promise((resolve) =>
          setTimeout(resolve, 15)
        );

        setTypingReply(
          reply.slice(0, i + step)
        );
      }

      dispatch(
        addMessage({
          role: "assistant",
          content: reply,
          actions,
        })
      );

      setTypingReply("");
      setIsTyping(false);
    } catch (err) {
      console.error(
        "AI request failed:",
        err
      );

      setIsLoading(false);
      setIsTyping(false);
      setTypingReply("");

      setError(
        err.response?.data?.error ||
          "Unable to connect to Respawn AI."
      );
    }
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div
      ref={windowRef}
      className="
        fixed left-0 top-0 z-[60]
        w-[560px] h-[720px]
        max-w-[calc(100vw-24px)]
        max-h-[calc(100dvh-24px)]
        max-md:w-[90vw]
        max-md:h-[50dvh]
        overflow-hidden
        rounded-2xl
        border border-white/10
        bg-[#050505]/40
        backdrop-blur-xl
        shadow-[0_20px_80px_rgba(0,0,0,0.6)]
        will-change-transform
      "
      style={{
        transform: `translate3d(
          ${position.x}px,
          ${position.y}px,
          0
        )`,
      }}
    >
      <div className="h-full flex flex-col">

        <AIChatHeader
          onClose={onClose}
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
        />

        <div
          ref={messagesRef}
          className="
            flex-1
            overflow-y-auto
            px-5 py-5
            space-y-4
            max-md:px-4
            max-md:py-4
          "
        >
          {messages.map(
            (message, index) => (
              <AIMessage
                key={index}
                message={message}
                onClose={onClose}
              />
            )
          )}

          {isTyping && typingReply && (
            <div className="flex justify-start">
              <div className="
                max-w-[88%]
                rounded-xl
                px-4 py-3
                bg-black/40
                text-gray-200
                text-sm
                leading-7
              ">
                <MarkdownRenderer>
                  {typingReply}
                </MarkdownRenderer>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="
                px-4 py-3
                rounded-xl
                bg-black/40
                text-gray-500
                text-sm
              ">
                Thinking...
              </div>
            </div>
          )}

          {error && (
            <div className="
              text-red-400
              text-sm
              px-1
            ">
              {error}
            </div>
          )}
        </div>

        <AIInput
          input={input}
          setInput={setInput}
          onSend={handleSend}
          onKeyDown={handleKeyDown}
          inputRef={inputRef}
          disabled={isLoading || isTyping}
        />

      </div>
    </div>
  );
};

export default AIChatWindow;