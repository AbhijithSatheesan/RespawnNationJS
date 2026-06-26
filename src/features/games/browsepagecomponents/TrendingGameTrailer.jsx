import React from 'react';
import { useSelector } from 'react-redux';

const TrendingGameTrailer = () => {
  const game = useSelector((store) => 
    store.trendingRandomGame?.trending_random_game?.trending_game
  );

  // Fallback safety catch
  if (!game) return null;

  const { name, trailer_1, cover_image } = game;

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
            className="w-full h-full object-cover opacity-80" 
          />
        )}
      </div>

      {/* Gradients for Text Readability & Blending - Reduced Opacity */}
      {/* Left-to-Right Side Fade: Softened significantly to make the video clear */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#121212]/70 via-[#121212]/30 to-transparent w-full md:w-[60%]" />
      
      {/* Bottom-to-Top Vertical Fade: Toned down heavily so mobile screens aren't blacked out */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/80 via-[#121212]/10 to-transparent" />

      {/* Content Layer */}
      <div className="absolute inset-0 flex flex-col justify-end md:justify-center pb-8 sm:pb-12 md:pb-0 pt-20 z-10">
        <div className="w-full px-4 sm:px-6 md:pl-16 lg:pl-24 max-w-3xl">
          
          <div className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 mb-3 md:mb-5 border border-cyan-500/40 rounded-full bg-cyan-500/10 backdrop-blur-sm w-max">
            <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-cyan-500"></span>
            </span>
            <span className="text-[9px] md:text-xs font-bold tracking-widest text-cyan-400 uppercase">
              Trending #1
            </span>
          </div>

          {/* Enhanced drop-shadow so text is crystal clear over the high-visibility video background */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black italic tracking-tighter uppercase mb-4 md:mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] line-clamp-2 leading-none">
            {name}
          </h1>

          <div className="flex flex-wrap gap-2.5 md:gap-4">
            <button className="flex items-center gap-1.5 md:gap-2 px-4 sm:px-5 md:px-8 py-2 md:py-3 bg-white text-black font-black uppercase tracking-wider text-xs md:text-base rounded hover:bg-cyan-400 transition-all duration-300 hover:scale-105 shadow-lg">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-6 md:h-6 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              Play Now
            </button>
            <button className="flex items-center gap-1.5 md:gap-2 px-4 sm:px-5 md:px-8 py-2 md:py-3 bg-gray-900/60 text-white font-bold tracking-wider uppercase text-xs md:text-base rounded backdrop-blur-md hover:bg-gray-800/80 transition-all duration-300 border border-gray-500/40 shadow-lg">
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