import React from "react";
import GameCard from "./GameCard";

const GameList = ({ title, games, isLargeRow = false }) => {
  if (!games || games.length === 0) return null;

  return (
    <div className="mb-4 md:mb-8 pl-4 md:pl-12 relative group">
      
      {/* Header Area */}
      <div className="flex items-end justify-between pr-6 md:pr-8 mb-3 md:mb-4">
        <h2 className="text-lg md:text-2xl font-black text-white uppercase tracking-wider drop-shadow-lg border-l-4 border-cyan-500 pl-3">
          {title}
        </h2>
        <span className="text-cyan-400 text-[10px] md:text-xs font-bold uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
          Explore All &gt;
        </span>
      </div>

      {/* The Scrollable Row - Added native tailwind scrollbar hiding */}
      <div className="relative">
        <div className="flex space-x-3 md:space-x-5 overflow-x-auto py-2 md:py-4 pr-12 snap-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {games.map((game) => (
            <div key={game.id} className="snap-start shrink-0">
              <GameCard
                id={game.id}
                cover={game.cover}
                name={game.name}
                rating={game.rating}
                isLarge={isLargeRow}
              />
            </div>
          ))}
        </div>
        
        {/* Right side fade to indicate scrolling */}
        <div className="absolute top-0 right-0 h-full w-12 md:w-16 bg-gradient-to-l from-[#121212] to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default GameList;

