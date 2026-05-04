import React from 'react';

const GameHero = ({ game, bgImage, onOpenTrailer }) => {
  return (
    <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden bg-black flex items-end">
      {bgImage && (
        <img 
          src={bgImage} 
          alt={game.name} 
          className="absolute inset-0 w-full h-full object-cover object-top opacity-80"
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] mb-2">
            {game.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-300">
            <span className="bg-cyan-900/40 text-cyan-400 px-3 py-1 border border-cyan-800/50 backdrop-blur-sm rounded">
              ★ {game.rating || 'Unrated'}
            </span>
            {game.developer && <span>Dev: {game.developer}</span>}
            {game.price === 0 ? <span className="text-yellow-400">Free to Play</span> : <span>Paid</span>}
          </div>
        </div>

        {game.trailer_1 && (
          <button 
            onClick={onOpenTrailer}
            className="w-full md:w-auto px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-sm rounded hover:bg-cyan-400 hover:text-black transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)]"
          >
            ▶ Watch Trailer
          </button>
        )}
      </div>
    </div>
  );
};

export default GameHero;







