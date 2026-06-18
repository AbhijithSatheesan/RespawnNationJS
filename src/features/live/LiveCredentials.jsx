import React, { useState } from "react";

const LiveCredentials = ({ streamData, creating, resetting, onCreateChannel, onResetKey }) => {
  const [showKey, setShowKey] = useState(false);

  // ==========================================
  // STATE 1: No Channel Exists Yet
  // ==========================================
  if (!streamData) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/90 to-gray-900/90 backdrop-blur-xl p-8 rounded-2xl border border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.2)] text-center w-full">
        <h2 className="text-2xl font-bold mb-3 text-white drop-shadow-md">Creator Studio Setup</h2>
        <p className="text-purple-200 mb-6 text-sm">
          Activate your channel to generate your unique Stream Key or link an external platform.
        </p>
        <button
          onClick={onCreateChannel}
          disabled={creating}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
            creating
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 hover:shadow-purple-500/50"
          }`}
        >
          {creating ? "Initializing..." : "🚀 Activate Channel"}
        </button>
      </div>
    );
  }

  // ==========================================
  // STATE 2: Channel Exists
  // ==========================================
  return (
    <div className="bg-gray-900/80 backdrop-blur-xl p-6 rounded-2xl border border-purple-500/30 shadow-[0_0_20px_rgba(0,0,0,0.5)] w-full z-20 relative flex flex-col h-full">
      
      {/* Header & Status Badge */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-purple-400">📡</span> Stream Settings
        </h2>
        
        <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-black border shadow-inner ${
            streamData.is_live 
            ? "bg-red-600 text-white border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.6)] animate-pulse" 
            : "bg-gray-800 text-gray-500 border-gray-700"
        }`}>
            {streamData.is_live ? "🔴 Live Now" : "⚫ Offline"}
        </span>
      </div>

      {/* Conditional Rendering Based on Platform Type */}
      {streamData.stream_type === 'CLOUDFLARE' ? (
        <div className="flex-1">
          {/* Ingest URL */}
          <div className="mb-5">
            <label className="block text-purple-300 mb-2 text-xs font-bold uppercase tracking-wider">Server URL</label>
            <div className="flex rounded-xl border border-gray-700 overflow-hidden bg-black/50 hover:border-purple-500/50 transition-colors">
              <input
                readOnly
                value={streamData.ingest_url || "rtmps://live.cloudflare.com/live"}
                className="bg-transparent w-full p-3 outline-none text-gray-300 text-sm font-mono truncate"
              />
              <button
                onClick={() => navigator.clipboard.writeText(streamData.ingest_url || "rtmps://live.cloudflare.com/live")}
                className="bg-gray-800/80 text-purple-400 px-4 font-bold text-xs hover:bg-purple-600 hover:text-white transition-all border-l border-gray-700 shrink-0"
              >
                COPY
              </button>
            </div>
          </div>

          {/* Stream Key */}
          <div className="mb-6">
            <label className="block text-purple-300 mb-2 text-xs font-bold uppercase tracking-wider">Stream Key</label>
            <div className="flex rounded-xl border border-gray-700 overflow-hidden bg-black/50 hover:border-purple-500/50 transition-colors">
              <input
                type={showKey ? "text" : "password"}
                readOnly
                value={streamData.stream_key || "No key generated"}
                className="bg-transparent w-full p-3 outline-none text-gray-300 text-sm font-mono tracking-widest truncate"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="bg-gray-800/80 text-gray-400 px-3 font-bold text-xs hover:text-white transition-all border-l border-gray-700 shrink-0"
              >
                {showKey ? "HIDE" : "SHOW"}
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(streamData.stream_key)}
                className="bg-gray-800/80 text-purple-400 px-4 font-bold text-xs hover:bg-purple-600 hover:text-white transition-all border-l border-gray-700 shrink-0"
              >
                COPY
              </button>
            </div>
          </div>

          {/* Reset Key Button */}
          <div className="pt-2 text-center mt-auto">
            <button
              onClick={onResetKey}
              disabled={resetting}
              className="text-red-500/80 text-[10px] uppercase tracking-widest font-black hover:text-red-400 hover:underline transition-colors"
            >
              {resetting ? "Regenerating Key..." : "⚠️ Reset Stream Key"}
            </button>
          </div>
        </div>
      ) : (
        /* External Platform View (Twitch/YouTube) */
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
              <span className="text-xl">🔗</span>
            </div>
            <h3 className="text-purple-300 font-bold uppercase tracking-widest text-xs mb-2">
                Broadcasting via {streamData.stream_type}
            </h3>
            <p className="text-gray-400 text-sm bg-black/40 px-3 py-2 rounded-lg font-mono border border-gray-800 w-full truncate">
                {streamData.external_url}
            </p>
            <p className="text-gray-500 text-[10px] mt-4 uppercase tracking-widest">
                No RTMP key required for external feeds.
            </p>
        </div>
      )}
    </div>
  );
};

export default LiveCredentials;