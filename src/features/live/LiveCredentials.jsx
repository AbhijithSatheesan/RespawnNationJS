// components/dashboard/LiveCredentials.jsx
import React, { useState } from "react";

const LiveCredentials = ({ streamData, creating, resetting, onCreateChannel, onResetKey }) => {
  const [showKey, setShowKey] = useState(false);

  // --- STATE 1: No channel (Bright Call-to-Action Card) ---
  if (!streamData) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/90 to-gray-900/90 backdrop-blur-xl p-8 rounded-2xl border border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)] text-center w-full">
        <h2 className="text-2xl font-bold mb-3 text-white drop-shadow-md">Start Streaming</h2>
        <p className="text-blue-100 mb-6 text-sm">
          Activate your creator studio to get your unique Stream Key.
        </p>
        <button
          onClick={onCreateChannel}
          disabled={creating}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
            creating
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-500 hover:scale-105 hover:shadow-blue-500/50"
          }`}
        >
          {creating ? "Setting up..." : "🚀 Generate Stream Key"}
        </button>
      </div>
    );
  }

  // --- STATE 2: Channel Exists (The "Pro" Dashboard Card) ---
  return (
    <div className="bg-gray-900/80 backdrop-blur-xl p-6 rounded-2xl border border-blue-500/30 shadow-[0_0_20px_rgba(0,0,0,0.5)] w-full z-20 relative">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-blue-400">📡</span> Stream Settings
        </h2>
        
        {/* Live Status Badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-inner ${
            streamData.is_live 
            ? "bg-red-600 text-white border-red-400 shadow-red-500/50 animate-pulse" 
            : "bg-gray-800 text-gray-400 border-gray-600"
        }`}>
            {streamData.is_live ? "🔴 LIVE NOW" : "⚫ OFFLINE"}
        </span>
      </div>

      {/* 1. Ingest URL */}
      <div className="mb-5">
        <label className="block text-blue-300 mb-2 text-xs font-bold uppercase tracking-wider">Server URL</label>
        <div className="flex rounded-xl border border-gray-600 overflow-hidden bg-black/50 hover:border-blue-400/50 transition-colors">
          <input
            readOnly
            value={streamData.ingest_url || "rtmps://live.cloudflare.com/live"}
            className="bg-transparent w-full p-3 outline-none text-gray-200 text-sm font-mono"
          />
          <button
            onClick={() => navigator.clipboard.writeText(streamData.ingest_url)}
            className="bg-gray-800/50 text-blue-400 px-4 font-bold text-xs hover:bg-blue-600 hover:text-white transition-all border-l border-gray-600"
          >
            COPY
          </button>
        </div>
      </div>

      {/* 2. Stream Key */}
      <div className="mb-6">
        <label className="block text-blue-300 mb-2 text-xs font-bold uppercase tracking-wider">Stream Key</label>
        <div className="flex rounded-xl border border-gray-600 overflow-hidden bg-black/50 hover:border-blue-400/50 transition-colors">
          <input
            type={showKey ? "text" : "password"}
            readOnly
            value={streamData.stream_key}
            className="bg-transparent w-full p-3 outline-none text-gray-200 text-sm font-mono tracking-widest"
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="bg-gray-800/50 text-gray-400 px-3 font-bold text-xs hover:text-white transition-all border-l border-gray-600"
          >
            {showKey ? "HIDE" : "SHOW"}
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(streamData.stream_key)}
            className="bg-gray-800/50 text-blue-400 px-4 font-bold text-xs hover:bg-blue-600 hover:text-white transition-all border-l border-gray-600"
          >
            COPY
          </button>
        </div>
      </div>

      {/* Reset Key */}
      <div className="pt-2 text-center">
        <button
          onClick={onResetKey}
          disabled={resetting}
          className="text-red-400 text-xs font-semibold hover:text-red-300 hover:underline transition-colors opacity-80 hover:opacity-100"
        >
          {resetting ? "Regenerating Key..." : "⚠️ Reset Stream Key"}
        </button>
      </div>
    </div>
  );
};

export default LiveCredentials;