import React from "react";

const AIChatHeader = ({
  onClose,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}) => {
  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      className="
        shrink-0 h-16 px-5
        flex items-center justify-between
        border-b border-white/10
        bg-black/20
        cursor-grab
        touch-none
        select-none
      "
    >
      <div className="flex items-center gap-3">
        <div
          className="
            w-9 h-9
            rounded-xl
            flex items-center justify-center
            bg-cyan-500/10
            border border-cyan-400/20
            text-cyan-300
          "
        >
          ✦
        </div>

        <div>
          <h2 className="text-sm font-black tracking-wide text-white">
            RESPAWN AI
          </h2>

          <p className="text-[11px] text-gray-500">
            Gaming assistant
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="
          w-9 h-9
          rounded-lg
          flex items-center justify-center
          text-gray-400
          hover:text-white
          hover:bg-white/10
          transition
        "
        aria-label="Close Respawn AI"
      >
        ✕
      </button>
    </div>
  );
};

export default AIChatHeader;