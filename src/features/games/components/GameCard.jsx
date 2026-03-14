import React from 'react';
import { useNavigate } from 'react-router-dom';
import { django_media_url } from '../../../services/BackendConfig';

const GameCard = ({ cover, name, rating, id }) => {
  const navigate = useNavigate();

  // Robust URL construction
  let imageUrl = '/placeholder.jpg';
  
  if (cover) {
     // If 'cover' is the object from Redux (small/medium/large)
     if (typeof cover === 'object' && cover.medium) {
        imageUrl = `${django_media_url}${cover.medium}`;
     } 
     // If 'cover' is just a string path (fallback)
     else if (typeof cover === 'string') {
        imageUrl = `${django_media_url}${cover}`;
     }
  }

  return (
    <div
      onClick={() => navigate(`/game/${id}`)}
      // 1. CHANGED: Fixed width (Narrower)
      // 'min-w-[220px] w-[220px]' ensures every card is exactly this wide
      className="min-w-[220px] w-[220px] bg-[#1f1f1f] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer relative group"
    >
      
      {/* 2. CHANGED: Taller Height (Portrait Mode) */}
      {/* h-[330px] creates that tall 'Box Art' look */}
      <div className="h-[330px] w-full relative">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/220x330?text=No+Image';
          }}
        />
        
        {/* Optional: Dark gradient at bottom so text pops */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f1f1f] via-transparent to-transparent opacity-80" />
      </div>

      {/* Content Info */}
      <div className="absolute bottom-0 left-0 w-full p-3 pt-8 bg-gradient-to-t from-black to-transparent">
        <h3 className="text-white text-md font-bold truncate drop-shadow-md">
          {name}
        </h3>
        <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-xs">⭐</span>
            <span className="text-gray-300 text-xs font-mono">{rating}</span>
        </div>
      </div>
    </div>
  );
};

export default GameCard;