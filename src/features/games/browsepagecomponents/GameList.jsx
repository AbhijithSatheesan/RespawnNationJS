import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameCard from "./GameCard";

const GameList = ({ title, games, categoryName, isLargeRow = false }) => {
  const navigate = useNavigate();
  
  // --- DRAG TO SCROLL LOGIC ---
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false); // NEW: Tracks actual movement
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setHasDragged(false); // Reset drag state on every new click
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault(); 
    
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; 
    
    // If the mouse moves more than 5px, it's a drag, not a click!
    if (Math.abs(x - startX) > 5) {
      setHasDragged(true);
    }
    
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };
  // -----------------------------

  if (!games || games.length === 0) return null;

  const handleExploreAll = () => {
    if (categoryName) {
      navigate(`/category/${categoryName}`);
    }
  };

  return (
    <div className="mb-4 md:mb-8 pl-4 md:pl-12 relative group">
      
      {/* Header Area */}
      <div className="flex items-end justify-between pr-6 md:pr-8 mb-3 md:mb-4">
        <h2 className="text-lg md:text-2xl font-black text-white uppercase tracking-wider drop-shadow-lg border-l-4 border-cyan-500 pl-3">
          {title}
        </h2>
        {categoryName && (
          <span 
            onClick={handleExploreAll}
            className="text-cyan-400 text-[10px] md:text-xs font-bold uppercase tracking-widest cursor-pointer hover:text-white transition-colors"
          >
            Explore All &gt;
          </span>
        )}
      </div>

      {/* The Scrollable Row */}
      <div className="relative">
        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex space-x-3 md:space-x-5 overflow-x-auto py-2 md:py-4 pr-12 pb-6 snap-x 
            /* --- CUSTOM SCROLLBAR STYLES --- */
            [&::-webkit-scrollbar]:h-2
            [&::-webkit-scrollbar-track]:bg-[#0a0a0c]
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-700
            hover:[&::-webkit-scrollbar-thumb]:bg-cyan-600
            [&::-webkit-scrollbar-thumb]:rounded-full
            /* Firefox fallback */
            [scrollbar-color:#374151_#0a0a0c] [scrollbar-width:thin]
            ${isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab'}
          `}
        >
          {games.map((game) => (
            <div 
              key={game.id} 
              className="snap-start shrink-0"
              // NEW: Intercept the click before it reaches the GameCard. 
              // If we dragged, stop the click. If we didn't drag, let it pass.
              onClickCapture={(e) => {
                if (hasDragged) {
                  e.stopPropagation();
                }
              }}
            >
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
        
        {/* Right side fade */}
        <div className="absolute top-0 right-0 h-[calc(100%-1.5rem)] w-12 md:w-16 bg-gradient-to-l from-[#121212] to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default GameList;