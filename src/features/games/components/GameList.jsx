import React from "react";
import GameCard from "./GameCard";



const GameList = ({ title, games }) => {
  if (!games || games.length === 0) return null;

  return (
    <div className="mb-10 px-4">
      <h2 className="text-xl font-bold text-white mb-3">
        {title}
      </h2>

      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {games.map((game) => (
          <GameCard
            key={game.id}
            id={game.id}
            cover={game.cover}     // ✅ correct
            name={game.name}
            rating={game.rating}
          />
        ))}
      </div>
    </div>
  );
};

export default GameList;
