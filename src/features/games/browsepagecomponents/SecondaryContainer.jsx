import React from 'react'
import GameList from './GameList'
import { useSelector } from 'react-redux'

const SecondaryContainer = () => {
  const games = useSelector((store) => store.gameList?.gameListContents)

  if (!games) {
    return (
      <div className="flex justify-center items-center py-32 w-full bg-[#121212]">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-cyan-400 font-bold tracking-widest uppercase animate-pulse">
            Connecting to Server...
          </p>
        </div>
      </div>
    )
  }

  const Main_category = games.Main_category

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
            categoryName={categoryName} // <-- Passing the name!
          />
        ))}
      </div>
    </div>
  )
}

export default SecondaryContainer









