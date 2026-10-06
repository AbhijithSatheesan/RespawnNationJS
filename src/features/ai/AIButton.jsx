import React from "react";

const AIButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open Respawn AI"
      className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(8,145,178,0.5)] transition-all duration-300"
    >
      🤖
    </button>
  );
};

export default AIButton;