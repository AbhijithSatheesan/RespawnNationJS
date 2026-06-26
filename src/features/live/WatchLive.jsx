import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import { Stream } from "@cloudflare/stream-react"; 
import streamService from "../../services/streamService";

const WatchLive = () => {
  const { id } = useParams(); 
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        setLoading(true);
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

  // --- HELPER: Extract YouTube ID ---
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // --- HELPER: Extract Twitch Channel ---
  const getTwitchChannel = (url) => {
    if (!url) return null;
    const match = url.match(/twitch\.tv\/([a-zA-Z0-9_]+)/);
    return match ? match[1] : null;
  };

  // --- RENDER CORRECT PLAYER ---
  const renderPlayer = () => {
    if (!stream) return null;

    if (stream.stream_type === 'CLOUDFLARE' && stream.playback_id) {
      return (
        <Stream
          controls
          src={stream.playback_id} 
          autoplay={true}
          muted={false} 
          preload="auto"
          className="w-full h-full"
          responsive={false} 
        />
      );
    } 
    
    if (stream.stream_type === 'YOUTUBE' && stream.external_url) {
      const videoId = getYouTubeId(stream.external_url);
      if (!videoId) return <div className="text-white">Invalid YouTube Link</div>;
      
      return (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    }

    if (stream.stream_type === 'TWITCH' && stream.external_url) {
      const channel = getTwitchChannel(stream.external_url);
      if (!channel) return <div className="text-white">Invalid Twitch Link</div>;
      
      // Twitch requires the 'parent' domain to embed. 
      // window.location.hostname handles 'localhost' in dev and your real domain in prod!
      const domain = window.location.hostname;
      
      return (
        <iframe
          className="w-full h-full"
          src={`https://player.twitch.tv/?channel=${channel}&parent=${domain}&autoplay=true`}
          frameBorder="0"
          allowFullScreen
          scrolling="no"
        ></iframe>
      );
    }

    // Fallback if data is corrupted
    return <div className="text-red-500 font-bold">Player Error: Unknown Stream Format</div>;
  };

  if (loading) return <div className="text-white text-center mt-20 text-xl animate-pulse">Connecting to live feed...</div>;
  
  if (error || !stream) return (
    <div className="text-red-500 text-center mt-20">
        <h2 className="text-2xl font-bold">Signal Lost</h2>
        <p>{error || "This channel is offline."}</p>
    </div>
  );

  return (
    <div className="bg-[#050505] min-h-screen flex flex-col pb-20">
      
      {/* 1. THE PLAYER AREA (Dynamic based on platform) */}
      <div className="w-full h-[35vh] sm:h-[50vh] md:h-[70vh] lg:h-[80vh] bg-black relative flex items-center justify-center border-b border-gray-800">
        {renderPlayer()}
      </div>

      {/* 2. STREAM INFO AREA */}
      <div className="p-6 bg-[#0a0a0c] text-white flex-1">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-6">
            
            {/* Left: Title, Game & Description */}
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white">
                        {stream.title}
                    </h1>
                </div>
                
                {/* Meta Info row (Streamer & Game) */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center font-bold uppercase">
                            {stream.streamer_name?.charAt(0) || "U"}
                        </div>
                        <span className="font-bold text-gray-300">
                            {stream.streamer_name}
                        </span>
                    </div>
                    
                    {stream.game_name && (
                        <>
                            <span className="text-gray-600">•</span>
                            <span className="text-cyan-400 font-bold text-sm tracking-wider uppercase bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                                {stream.game_name}
                            </span>
                        </>
                    )}
                </div>

                <p className="text-gray-400 text-sm md:text-base max-w-3xl leading-relaxed bg-black/40 p-4 rounded-xl border border-gray-800/50">
                    {stream.description || "No description provided."}
                </p>
            </div>
            
            {/* Right: Status Badges & Platform Info */}
            <div className="flex flex-col items-end gap-3 min-w-[150px]">
                {stream.is_live ? (
                    <div className="flex items-center gap-2 bg-red-600/10 border border-red-500/30 px-4 py-2 rounded-lg">
                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping absolute"></span>
                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full relative"></span>
                        <span className="text-red-500 font-black text-sm uppercase tracking-widest">
                            Live Now
                        </span>
                    </div>
                ) : (
                    <span className="bg-gray-800 text-gray-400 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-widest border border-gray-700">
                        Offline
                    </span>
                )}
                
                {/* Display which platform is powering the video */}
                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                    Source: {stream.stream_type}
                </span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WatchLive;















// the chat is done directly by supabase db, no heavy lifting there and i am not doing redis or docker now, if i will, then it will be locally to show recruiters,


// last few days i was just wasting time doing some leetcode, and not making much progress, i feel fully confused