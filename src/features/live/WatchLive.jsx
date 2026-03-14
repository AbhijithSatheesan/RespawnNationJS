import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Gets the ID from the URL
import { Stream } from "@cloudflare/stream-react"; // Official Player
import streamService from "../../services/streamService";

const WatchLive = () => {
  const { id } = useParams(); // Gets '7' from url /live/watch/7
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        setLoading(true);
        // This calls your Django API: GET /api/streams/7/
        const data = await streamService.getStreamById(id);
        setStream(data);
      } catch (err) {
        console.error("Failed to fetch stream:", err);
        setError("Stream not found or is currently offline.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStream();
  }, [id]);

  if (loading) return <div className="text-white text-center mt-20 text-xl animate-pulse">Connecting to live feed...</div>;
  
  if (error || !stream) return (
    <div className="text-red-500 text-center mt-20">
        <h2 className="text-2xl font-bold">Signal Lost</h2>
        <p>{error || "This channel is offline."}</p>
    </div>
  );

  return (
    <div className="bg-black min-h-screen flex flex-col">
      {/* 1. THE PLAYER AREA */}
      <div className="w-full h-[60vh] md:h-[80vh] bg-black relative flex items-center justify-center">
        {/* We use the 'playback_id' directly from your Django Serializer */}
        <Stream
          controls
          src={stream.playback_id} 
          autoplay={true}
          muted={true} // Required for autoplay to work in most browsers
          preload="auto"
          className="w-full h-full"
          responsive={false} // We handle sizing via the container div
        />
      </div>

      {/* 2. STREAM INFO AREA */}
      <div className="p-6 bg-[#121212] text-white flex-1 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-4">
            
            {/* Left: Title & Description */}
            <div>
                <h1 className="text-2xl md:text-4xl font-bold mb-2 text-white">
                    {stream.title}
                </h1>
                <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
                    {stream.description || "No description available for this stream."}
                </p>
            </div>
            
            {/* Right: Status Badges */}
            <div className="flex flex-col items-end">
                {stream.is_live ? (
                    <span className="bg-red-600 text-white px-4 py-1 rounded text-sm font-bold uppercase tracking-wider animate-pulse shadow-lg shadow-red-900/50">
                        LIVE NOW
                    </span>
                ) : (
                    <span className="bg-gray-600 text-gray-300 px-4 py-1 rounded text-sm font-bold uppercase">
                        OFFLINE
                    </span>
                )}
                {/* Optional: Show view count if you add it later */}
                {/* <span className="text-blue-400 text-sm mt-2 font-mono">1.2k Watching</span> */}
            </div>
        </div>
      </div>
    </div>
  );
};

export default WatchLive;