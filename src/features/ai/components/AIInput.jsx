import React from "react";

const AIInput = ({
  input,
  setInput,
  onSend,
  onKeyDown,
  inputRef,
  disabled,
}) => {
  return (
    <form
      onSubmit={onSend}
      className="
        shrink-0 p-4 max-md:p-3
        border-t border-white/10
        bg-black/20
      "
    >
      <div className="flex gap-3 items-end">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask something..."
          disabled={disabled}
          rows={1}
          autoComplete="off"
          className="
            flex-1
            min-h-12
            max-h-[140px]
            resize-none
            overflow-y-auto
            bg-black/30
            border border-white/10
            rounded-xl
            px-4 py-3
            text-sm
            text-white
            placeholder:text-gray-500
            outline-none
            focus:border-cyan-500/50
            focus:ring-1
            focus:ring-cyan-500/20
            disabled:opacity-50
          "
        />

        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="
            shrink-0
            h-12 w-12
            rounded-xl
            flex items-center justify-center
            bg-cyan-600/80
            hover:bg-cyan-500
            text-white
            transition
            disabled:opacity-30
          "
          aria-label="Send message"
        >
          ➤
        </button>
      </div>

      <p className="text-[10px] text-gray-600 mt-2 px-1">
        Enter to send · Shift + Enter for a new line
      </p>
    </form>
  );
};

export default AIInput;