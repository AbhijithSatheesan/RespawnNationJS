import React from 'react';
import { useNavigate } from 'react-router-dom';
import { django_media_url } from '../../../services/BackendConfig';

const GameCard = ({ cover, name, rating, id, isLarge }) => {
  const navigate = useNavigate();

  let imageUrl = 'https://via.placeholder.com/220x330?text=No+Image';
  
  if (cover) {
     let rawUrl = '';
     if (typeof cover === 'object' && cover.medium) {
        rawUrl = cover.medium;
     } else if (typeof cover === 'string') {
        rawUrl = cover;
     }

     if (rawUrl.startsWith('http')) {
         imageUrl = rawUrl; 
     } else {
         imageUrl = `${django_media_url}${rawUrl}`;
     }
  }

  // Responsive sizes: smaller on mobile, larger on desktop
  const cardWidth = isLarge 
    ? "w-[160px] md:w-[260px]" 
    : "w-[140px] md:w-[200px]";
    
  const cardHeight = isLarge 
    ? "h-[240px] md:h-[380px]" 
    : "h-[200px] md:h-[290px]";

  return (
    <div
      onClick={() => navigate(`/game/${id}`)}
      className={`${cardWidth} bg-[#0a0a0a] rounded-lg overflow-hidden transition-all duration-300 cursor-pointer relative group border border-gray-800 hover:border-cyan-500/50 hover:-translate-y-1 hover:md:-translate-y-2 hover:shadow-[0_0_20px_rgba(8,145,178,0.4)] z-10 hover:z-20`}
    >
      <div className={`${cardHeight} w-full relative`}>
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/220x330?text=No+Image';
          }}
        />
        
        {/* Darker gradient on hover so text is super readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-90 transition-opacity duration-300" />
      </div>

      <div className="absolute bottom-0 left-0 w-full p-3 md:p-4 transform translate-y-1 md:translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white text-sm md:text-lg font-black uppercase tracking-tight truncate drop-shadow-md mb-1.5 md:mb-2">
          {name}
        </h3>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 md:gap-1.5 bg-black/80 px-1.5 py-0.5 md:px-2 md:py-1 rounded border border-gray-700/50 backdrop-blur-sm">
                <span className="text-yellow-500 text-[10px] md:text-xs">★</span>
                <span className="text-gray-200 text-[10px] md:text-xs font-bold">{rating || "N/A"}</span>
            </div>
            
            {/* Hidden subtle icon that appears on hover */}
            <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] md:text-xs font-black uppercase tracking-widest">
                View
            </span>
        </div>
      </div>
    </div>
  );
};

export default GameCard;












