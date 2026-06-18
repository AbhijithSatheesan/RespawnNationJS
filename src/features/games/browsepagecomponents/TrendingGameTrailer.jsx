import React from 'react';
import { useSelector } from 'react-redux';

const TrendingGameTrailer = () => {
  const game = useSelector((store) => 
    store.trendingRandomGame?.trending_random_game?.trending_game
  );

  // Fallback safety catch
  if (!game) return null;

  const { name, description, trailer_1, cover_image } = game;

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(trailer_1);

  return (
    <div className="relative w-full h-[65vh] md:h-[80vh] lg:h-[90vh] overflow-hidden bg-[#121212] text-white">
      
      {/* Background Video/Image */}
      <div className="absolute inset-0 w-full h-full">
        {videoId ? (
          <iframe
            className="w-full h-full object-cover scale-[1.3] md:scale-110 pointer-events-none" 
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&loop=1&playlist=${videoId}`}
            title="Main Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <img 
            src={cover_image} 
            alt={name} 
            className="w-full h-full object-cover opacity-60" 
          />
        )}
      </div>

      {/* Gradients for Text Readability & Blending */}
      {/* Horizontal fade - subtle on mobile, stronger on desktop */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/60 to-transparent w-[90%] md:w-[70%]" />
      
      {/* Vertical fade - Much stronger at the bottom on mobile to support bottom-aligned text */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/80 md:via-[#121212]/20 to-transparent" />

      {/* Content Layer */}
      {/* FIX: flex-col and justify-end pushes content to the bottom on mobile! */}
      <div className="absolute inset-0 flex flex-col justify-end md:justify-center pb-6 sm:pb-8 md:pb-0 pt-20">
        <div className="w-full px-4 sm:px-6 md:pl-16 lg:pl-24 max-w-3xl">
          
          <div className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 mb-3 md:mb-4 border border-cyan-500/50 rounded-full bg-cyan-500/10 backdrop-blur-sm w-max">
            <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-cyan-500"></span>
            </span>
            <span className="text-[9px] md:text-xs font-bold tracking-widest text-cyan-400 uppercase">
              Trending #1
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black italic tracking-tighter uppercase mb-2 md:mb-4 drop-shadow-2xl line-clamp-2 leading-none">
            {name}
          </h1>

          <p className="text-[11px] sm:text-xs md:text-lg text-gray-300 mb-4 md:mb-8 leading-snug md:leading-relaxed line-clamp-2 md:line-clamp-4 drop-shadow-md max-w-xl">
            {description}
          </p>

          <div className="flex flex-wrap gap-2.5 md:gap-4">
            <button className="flex items-center gap-1.5 md:gap-2 px-4 sm:px-5 md:px-8 py-2 md:py-3 bg-white text-black font-black uppercase tracking-wider text-xs md:text-base rounded hover:bg-cyan-400 transition-all duration-300 hover:scale-105">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-6 md:h-6 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              Play Now
            </button>
            <button className="flex items-center gap-1.5 md:gap-2 px-4 sm:px-5 md:px-8 py-2 md:py-3 bg-gray-600/60 text-white font-bold tracking-wider uppercase text-xs md:text-base rounded backdrop-blur-sm hover:bg-gray-600/80 transition-all duration-300 border border-gray-500/30">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              More Info
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default TrendingGameTrailer;