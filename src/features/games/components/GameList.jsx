import React from "react";
import GameCard from "./GameCard";

// Added isLargeRow prop so you can make the top row stand out if you want
const GameList = ({ title, games, isLargeRow = false }) => {
  if (!games || games.length === 0) return null;

  return (
    <div className="mb-8 pl-4 md:pl-12 relative group">
      
      {/* Header Area */}
      <div className="flex items-end justify-between pr-8 mb-4">
        <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider drop-shadow-lg border-l-4 border-cyan-500 pl-3">
          {title}
        </h2>
        <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
          Explore All &gt;
        </span>
      </div>

      {/* The Scrollable Row */}
      <div className="relative">
        <div className="flex space-x-6 overflow-x-auto scrollbar-hide py-4 pr-12 snap-x">
          {games.map((game) => (
            <div key={game.id} className="snap-start">
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
        <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-[#121212] to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default GameList;




// import React from "react";
// import GameCard from "./GameCard";



// const GameList = ({ title, games }) => {
//   if (!games || games.length === 0) return null;

//   return (
//     <div className="mb-10 px-4">
//       <h2 className="text-xl font-bold text-white mb-3">
//         {title}
//       </h2>

//       <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
//         {games.map((game) => (
//           <GameCard
//             key={game.id}
//             id={game.id}
//             cover={game.cover}     // ✅ correct
//             name={game.name}
//             rating={game.rating}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default GameList;
