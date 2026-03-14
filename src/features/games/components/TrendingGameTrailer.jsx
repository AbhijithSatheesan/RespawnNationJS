import React from 'react';
import { useSelector } from 'react-redux';

const TrendingGameTrailer = () => {
  // 1. Get data from Redux safely
  const game = useSelector((store) => 
    store.trendingRandomGame?.trending_random_game?.trending_game
  );

  // 2. Early return if data isn't loaded yet
  if (!game) return null;

  const { name, description, trailer_1, cover_image } = game;

  // 3. Helper to extract YouTube Video ID from URL
  // Input: https://www.youtube.com/watch?v=pBM2xyco_Kg
  // Output: pBM2xyco_Kg
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(trailer_1);

  return (
    <div className="relative w-full aspect-video md:aspect-[21/9] lg:h-[85vh] overflow-hidden bg-black text-white">
      
      {/* --- A. BACKGROUND VIDEO LAYER --- */}
      <div className="absolute inset-0 w-full h-full">
        {videoId ? (
          <iframe
            className="w-full h-full object-cover scale-110 pointer-events-none" // scale-110 zooms in slightly to hide black bars
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&loop=1&playlist=${videoId}`}
            title="Main Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          // Fallback to image if no trailer exists
          <img 
            src={cover_image} 
            alt={name} 
            className="w-full h-full object-cover opacity-60" 
          />
        )}
      </div>

      {/* --- B. GRADIENT OVERLAY (Crucial for text readability) --- */}
      {/* 1. Left-to-Right Black Fade */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      {/* 2. Bottom-to-Top Fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />

      {/* --- C. CONTENT LAYER --- */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full pl-6 md:pl-16 lg:pl-24 max-w-2xl pt-20">
          
          {/* Trending Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-teal-500/50 rounded-full bg-teal-500/10 backdrop-blur-sm animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span className="text-xs font-bold tracking-widest text-teal-400 uppercase">
              Trending #1
            </span>
          </div>

          {/* Game Title - Cyberpunk Style */}
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4 drop-shadow-2xl">
            {name}
          </h1>

          {/* Description (Truncated) */}
          <p className="text-sm md:text-lg text-gray-300 mb-8 leading-relaxed line-clamp-3 md:line-clamp-4 drop-shadow-md">
            {description}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold text-lg rounded hover:bg-opacity-80 transition-all duration-300 hover:scale-105">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              Play Now
            </button>
            <button className="flex items-center gap-2 px-8 py-3 bg-gray-600/60 text-white font-bold text-lg rounded backdrop-blur-sm hover:bg-gray-600/80 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              More Info
            </button>
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default TrendingGameTrailer;