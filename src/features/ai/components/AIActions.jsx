import React from "react";
import { useNavigate } from "react-router-dom";

const AIActions = ({ actions = [], onClose }) => {
  const navigate = useNavigate();

  if (!actions.length) return null;

  const handleAction = (action) => {
    if (action.type === "WATCH_STREAM" && action.stream_id) {
      navigate(`/live/watch/${action.stream_id}`);
      onClose();
    }
  };

  return (
    <div className="mt-3 space-y-2">
      {actions.map((action) => {
        if (!action?.type) return null;

        return (
          <button
            key={`${action.type}-${action.stream_id}`}
            type="button"
            onClick={() => handleAction(action)}
            className="
              w-full flex items-center gap-3
              px-4 py-3 rounded-xl
              bg-cyan-500/10
              hover:bg-cyan-500/20
              border border-cyan-400/20
              hover:border-cyan-400/40
              text-white text-left
              transition
            "
          >
            <span className="text-cyan-300">
              ▶
            </span>

            <span className="text-sm font-semibold">
              {action.label || "Open"}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default AIActions;