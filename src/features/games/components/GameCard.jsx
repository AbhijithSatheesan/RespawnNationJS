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

  // If it's the top row, make it slightly larger!
  const cardWidth = isLarge ? "min-w-[260px] w-[260px]" : "min-w-[200px] w-[200px]";
  const cardHeight = isLarge ? "h-[380px]" : "h-[290px]";

  return (
    <div
      onClick={() => navigate(`/game/${id}`)}
      className={`${cardWidth} bg-[#0a0a0a] rounded-lg overflow-hidden transition-all duration-300 cursor-pointer relative group border border-gray-800 hover:border-cyan-500/50 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(8,145,178,0.4)] z-10 hover:z-20`}
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
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white text-lg font-black uppercase tracking-tight truncate drop-shadow-md mb-1">
          {name}
        </h3>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded border border-gray-700/50 backdrop-blur-sm">
                <span className="text-yellow-500 text-xs">★</span>
                <span className="text-gray-200 text-xs font-bold">{rating || "N/A"}</span>
            </div>
            
            {/* Hidden subtle icon that appears on hover */}
            <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs font-bold uppercase tracking-wider">
                View
            </span>
        </div>
      </div>
    </div>
  );
};

export default GameCard;












// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { django_media_url } from '../../../services/BackendConfig';

// const GameCard = ({ cover, name, rating, id }) => {
//   const navigate = useNavigate();

//   // Robust URL construction
//   let imageUrl = 'https://via.placeholder.com/220x330?text=No+Image';
  
//   if (cover) {
//      let rawUrl = '';
     
//      // 1. Extract the raw path from either the object or the string
//      if (typeof cover === 'object' && cover.medium) {
//         rawUrl = cover.medium;
//      } else if (typeof cover === 'string') {
//         rawUrl = cover;
//      }

//      // 2. THE FIX: Check if Cloudinary already gave us the full web address
//      if (rawUrl.startsWith('http')) {
//          imageUrl = rawUrl; // Use the Cloudinary URL exactly as it is
//      } else {
//          imageUrl = `${django_media_url}${rawUrl}`; // Fallback for local files
//      }
//   }

//   return (
//     <div
//       onClick={() => navigate(`/game/${id}`)}
//       className="min-w-[220px] w-[220px] bg-[#1f1f1f] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer relative group"
//     >
//       <div className="h-[330px] w-full relative">
//         <img
//           src={imageUrl}
//           alt={name}
//           className="w-full h-full object-cover"
//           loading="lazy"
//           onError={(e) => {
//             e.target.onerror = null;
//             e.target.src = 'https://via.placeholder.com/220x330?text=No+Image';
//           }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-[#1f1f1f] via-transparent to-transparent opacity-80" />
//       </div>

//       <div className="absolute bottom-0 left-0 w-full p-3 pt-8 bg-gradient-to-t from-black to-transparent">
//         <h3 className="text-white text-md font-bold truncate drop-shadow-md">
//           {name}
//         </h3>
//         <div className="flex items-center gap-1">
//             <span className="text-yellow-400 text-xs">⭐</span>
//             <span className="text-gray-300 text-xs font-mono">{rating}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GameCard;