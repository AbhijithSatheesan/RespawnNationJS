// pages/GoLive.jsx
import React, { useEffect, useState } from "react";
import streamService from "../../services/streamService"; 
import LiveCredentials from "./LiveCredentials"; 
import CreateLive from "./CreateLive"; 

const GoLive = () => {
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [creating, setCreating] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetchStream();
  }, []);

  const fetchStream = async () => {
    try {
      const data = await streamService.getMyStream();
      setStreamData(data);
    } catch (error) {
       if (error.response?.status === 404) setStreamData(null);
    } finally {
      setLoading(false);
    }
  };

  // --- RESTORED LOGIC HERE ---
  const handleCreateChannel = async () => {
    setCreating(true);
    try {
      const newData = await streamService.createStream();
      setStreamData(newData);
    } catch (error) {
      alert("Could not create channel.");
    } finally {
      setCreating(false);
    }
  };

  // --- RESTORED LOGIC HERE ---
  const handleResetKey = async () => {
    // 1. Confirmation check
    if(!window.confirm("Are you sure? This will disconnect any active stream.")) return;

    setResetting(true);
    try {
      // 2. Call Service
      const newData = await streamService.resetStreamKey();
      // 3. Update UI
      setStreamData(newData);
      alert("Stream Key reset successfully!");
    } catch (error) {
      console.error("Reset Error:", error);
      alert("Failed to reset key.");
    } finally {
      setResetting(false);
    }
  };

  const handleStreamStarted = (updatedStream) => {
    setStreamData(updatedStream); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEndStream = async () => {
      if(!window.confirm("End the stream on dashboard?")) return;
      try {
        const updated = await streamService.updateStream({ is_live: false });
        setStreamData(updated);
      } catch (error) {
        alert("Error stopping stream");
      }
  };

  if (loading) return <div className="text-white text-center mt-20 animate-pulse">Loading Studio...</div>;

  return (
    <div className="min-h-screen p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 pl-4 border-l-4 border-purple-500 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold drop-shadow-md">Creator Studio</h1>
            <p className="text-gray-300 mt-2 text-lg">
                {streamData?.is_live ? "🔴 Broadcasting Live" : "⚪ Offline Setup"}
            </p>
          </div>
          {streamData?.is_live && (
              <button 
                onClick={handleEndStream}
                className="bg-red-600/20 text-red-500 border border-red-500/50 px-6 py-2 rounded-lg font-bold hover:bg-red-600 hover:text-white transition-all"
              >
                  STOP STREAM
              </button>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* MAKE SURE ALL PROPS ARE PASSED HERE */}
            <LiveCredentials 
              streamData={streamData}
              creating={creating}
              resetting={resetting}
              onCreateChannel={handleCreateChannel}
              onResetKey={handleResetKey}
            />
            
            {streamData?.is_live && (
                <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl border border-cyan-500/30 h-40 flex flex-col justify-center items-center shadow-lg">
                    <h3 className="text-cyan-400 font-bold mb-2 text-xs uppercase">Bitrate</h3>
                    <div className="text-3xl font-mono font-bold text-white animate-pulse">4500 kbps</div>
                </div>
            )}
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            {streamData?.is_live ? (
                <>
                    <div className="relative group bg-black rounded-2xl border-2 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)] overflow-hidden aspect-video flex items-center justify-center">
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                             <h2 className="text-green-400 text-2xl font-bold">📡 Video Player Active</h2>
                        </div>
                    </div>
                    <div className="bg-gray-900/90 backdrop-blur-md h-96 rounded-2xl border border-purple-500/30 p-6 shadow-lg">
                        <h3 className="text-purple-400 font-bold mb-4">Live Chat</h3>
                    </div>
                </>
            ) : (
                <CreateLive streamData={streamData} onStreamStarted={handleStreamStarted} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoLive;