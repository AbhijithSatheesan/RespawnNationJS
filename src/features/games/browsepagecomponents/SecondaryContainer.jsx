import React from 'react';
import GameList from './GameList';
import { useSelector } from 'react-redux';

const SecondaryContainer = () => {
  const games = useSelector((store) => store.gameList?.gameListContents);

  // Fallback safety catch (should rarely hit because of parent loader)
  if (!games) return null;

  const Main_category = games.Main_category;

  return (
    <div className='relative z-20 flex flex-col gap-6 md:gap-10 -mt-16 sm:-mt-24 md:-mt-32 lg:-mt-52 pb-20'>
      <div className="w-full">
        {/* These don't get a categoryName, so Explore All is hidden */}
        <GameList title={"Trending Now"} games={games.Trending_games} isLargeRow={true} />
        <GameList title={"Top Rated"} games={games.Top_rated_games} />

        {/* These GET the categoryName */}
        {Main_category && typeof Main_category === 'object' && Object.entries(Main_category).map(([categoryName, games]) => (
          <GameList
            key={categoryName}
            title={categoryName}
            games={games}
            categoryName={categoryName} 
          />
        ))}
      </div>
    </div>
  );
};

export default SecondaryContainer;






