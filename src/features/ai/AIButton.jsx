import React, { useRef } from "react";

const SIZE = 60;
const GAP = 18;

const AIButton = ({
  position,
  setPosition,
  onClick,
}) => {
  const dragRef = useRef(null);

  const clamp = (x, y) => ({
    x: Math.max(
      GAP,
      Math.min(
        x,
        window.innerWidth - SIZE - GAP
      )
    ),
    y: Math.max(
      GAP,
      Math.min(
        y,
        window.innerHeight - SIZE - GAP
      )
    ),
  });

  const handlePointerDown = (e) => {
    const rect =
      e.currentTarget.getBoundingClientRect();

    dragRef.current = {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      moved: false,
    };

    e.currentTarget.setPointerCapture(
      e.pointerId
    );
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current) return;

    const next = clamp(
      e.clientX -
        dragRef.current.offsetX,
      e.clientY -
        dragRef.current.offsetY
    );

    if (
      Math.abs(next.x - position.x) > 4 ||
      Math.abs(next.y - position.y) > 4
    ) {
      dragRef.current.moved = true;
    }

    setPosition(next);
  };

  const handlePointerUp = (e) => {
    if (!dragRef.current) return;

    const moved =
      dragRef.current.moved;

    dragRef.current = null;

    e.currentTarget.releasePointerCapture?.(
      e.pointerId
    );

    if (!moved) {
      onClick();
    }
  };

  return (
    <button
      type="button"
      aria-label="Open Respawn AI"
      title="Respawn AI"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        dragRef.current = null;
      }}
      className="
        fixed left-0 top-0 z-[60]
        w-[60px] h-[60px]
        rounded-2xl
        flex items-center justify-center
        overflow-hidden
        select-none touch-none
        cursor-grab

        bg-[#071114]
        border border-cyan-400/40

        text-cyan-300

        shadow-[0_0_25px_rgba(6,182,212,0.4)]

        hover:border-cyan-300/70
        hover:shadow-[0_0_35px_rgba(6,182,212,0.65)]
        hover:scale-105

        active:scale-95

        will-change-transform
        transition-[box-shadow,border-color,transform]
        duration-200
      "
      style={{
        transform: `translate3d(
          ${position.x}px,
          ${position.y}px,
          0
        )`,
      }}
    >
      <span className="
        absolute inset-0
        bg-cyan-400/10
        pointer-events-none
      " />

      <svg
        viewBox="0 0 24 24"
        className="
          relative z-10
          w-7 h-7
        "
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect
          x="4"
          y="7"
          width="16"
          height="13"
          rx="3"
        />

        <path d="M12 3v4" />

        <circle
          cx="12"
          cy="2.5"
          r="0.7"
          fill="currentColor"
        />

        <circle
          cx="9"
          cy="13"
          r="1"
          fill="currentColor"
        />

        <circle
          cx="15"
          cy="13"
          r="1"
          fill="currentColor"
        />

        <path d="M9 17h6" />
      </svg>

      <span className="
        absolute bottom-[5px]
        text-[7px]
        font-black
        tracking-[0.18em]
        text-cyan-200
      ">
        AI
      </span>

      <span className="
        absolute top-1.5 right-1.5
        w-2.5 h-2.5
        rounded-full
        bg-emerald-400
        border-2 border-[#071114]
        shadow-[0_0_8px_rgba(52,211,153,0.8)]
      " />
    </button>
  );
};

export default AIButton;