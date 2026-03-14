import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import streamService from "../../services/streamService";

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
              onClick={() => navigate(`/live/watch/${stream.id}`)} // Navigate to dynamic route
              className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 border border-gray-700 hover:border-blue-500"
            >
              {/* Thumbnail Placeholder (Since Cloudflare thumbnails are tricky, we use a gradient or the game cover) */}
              <div className="h-48 bg-gray-900 flex items-center justify-center relative">
                 <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">LIVE</div>
                 <span className="text-gray-600 text-4xl">▶</span> 
              </div>

              <div className="p-4">
                <h3 className="text-white font-bold text-lg truncate">{stream.title}</h3>
                <p className="text-gray-400 text-sm mt-1 truncate">{stream.description || "No description"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveFeed;