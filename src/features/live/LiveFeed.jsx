import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import streamService from "../../services/streamService";

// Import your default fallback image
import defaultCover from "./images/streamcover.png";

const LiveFeed = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiveStreams = async () => {
      try {
        const data = await streamService.getLiveStreams();
        setStreams(data);
      } catch (error) {
        console.error("Error fetching live streams:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveStreams();
  }, []);

  if (loading) return <div className="text-white text-center p-10">Searching for live signals...</div>;

  return (
    <div className="bg-[#121212] min-h-screen p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Live Now</h1>

      {streams.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
            <h2 className="text-xl">No one is streaming right now.</h2>
            <p>Why not be the first?</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {streams.map((stream) => (
            <div 
              key={stream.id} 
              onClick={() => navigate(`/live/watch/${stream.id}`)}
              className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 border border-gray-700 hover:border-blue-500 flex flex-col"
            >
              {/* Thumbnail Section */}
              <div className="h-48 bg-gray-900 relative">
                 <img 
                   src={stream.display_thumbnail || defaultCover} 
                   alt={`${stream.title} cover`}
                   className="w-full h-full object-cover"
                   onError={(e) => { e.currentTarget.src = defaultCover; }}
                 />
                 
                 {/* Live Badge Overlay */}
                 <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse shadow-md">
                   LIVE
                 </div>
              </div>

              {/* Text Section */}
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg truncate">{stream.title}</h3>
                  <p className="text-gray-400 text-sm mt-1 truncate">{stream.description || "No description"}</p>
                </div>

                {/* NEW: Streamer Name & Game Info Added Here! */}
                <div className="mt-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-gray-300 font-semibold truncate">
                    {/* Fake Avatar showing first letter of Streamer Name */}
                    <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                      {stream.streamer_name ? stream.streamer_name.charAt(0).toUpperCase() : "?"}
                    </span>
                    <span className="truncate">{stream.streamer_name}</span>
                  </div>
                  
                  {/* Show Game Name if it exists */}
                  {stream.game_name && (
                    <span className="bg-purple-900/50 text-purple-300 border border-purple-700/50 px-2 py-1 rounded shrink-0 max-w-[50%] truncate">
                      {stream.game_name}
                    </span>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveFeed;