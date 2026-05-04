import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';

const TabStreams = ({ gameId, gameImage }) => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        // Hit the new streams endpoint
        const response = await api.get(`streams/game/${gameId}/`);
        setStreams(response.data);
      } catch (error) {
        console.error("Failed to fetch streams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, [gameId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (streams.length === 0) {
    return (
      <div className="bg-[#0a0a0c] border border-gray-800 rounded-lg p-12 text-center animate-fadeIn">
        <span className="inline-block w-3 h-3 bg-gray-600 rounded-full mb-4"></span>
        <p className="text-gray-500 font-bold uppercase tracking-widest">
          No live broadcasts for this game right now.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
      {streams.map((stream) => (
        <div 
          key={stream.id}
          onClick={() => navigate(`/streams/${stream.id}`)}
          className="bg-[#0a0a0c] border border-gray-800 rounded-lg overflow-hidden cursor-pointer hover:border-red-500/50 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all duration-300 group"
        >
          {/* Thumbnail Area */}
          <div className="aspect-video bg-black relative overflow-hidden border-b border-gray-800">
            {/* Fallback to game image since we don't have stream thumbnails yet */}
            {gameImage ? (
              <img 
                src={gameImage} 
                alt="Stream Thumbnail" 
                className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-300" 
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-red-900/20 to-black"></div>
            )}
            
            {/* LIVE Badge */}
            <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded flex items-center gap-1.5 shadow-[0_0_10px_rgba(239,68,68,0.8)]">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              LIVE
            </div>
            
            {/* Play Button Overlay (Shows on Hover) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 bg-red-600/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-white ml-1 font-black text-xl">▶</span>
              </div>
            </div>
          </div>

          {/* Info Area */}
          <div className="p-4 flex gap-3 items-start">
            {/* Streamer Avatar Placeholder */}
            <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0">
               <span className="text-gray-400 font-bold uppercase text-sm">
                 {stream.streamer_name ? stream.streamer_name.charAt(0) : '?'}
               </span>
            </div>
            
            <div className="overflow-hidden">
              <h3 className="text-white font-bold text-sm truncate mb-1 group-hover:text-red-400 transition-colors">
                {stream.title}
              </h3>
              <p className="text-gray-400 text-xs font-medium truncate">
                {stream.streamer_name}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TabStreams;