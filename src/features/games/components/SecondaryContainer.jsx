import React from 'react'
import GameList from './GameList'
import { useSelector } from 'react-redux'

const SecondaryContainer = () => {

  const games = useSelector((store) => store.gameList?.gameListContents)

  if (!games) {
    return <p>Loading ....</p>
  }

  const Main_category = games.Main_category

  return (
    <div className='py-20 bg-gray-900 text-white'>
      <h1>secondary container</h1>
      <GameList title={"Trending"} games={games.Trending_games} />
      <GameList title={"Top Rated"} games={games.Top_rated_games} />

      {/* now add dynamic categories here */}

      {/* the props given in map is actually key and value resepectively */}

      {Main_category && Object.entries(Main_category).map(([categoryName, games]) => (
        <GameList
        key={categoryName}
        title = {`${categoryName}`}
        games= {games}

        // if we want to make url out of the category
        category= {categoryName.toLowerCase().replace(/\s+/g, '-')}   
        />
      )) }




      {/* <GameList title={"Trending"} games={games.Main_category.Story} /> */}
      {/* the naming and the way in main category in redux should be changed */}
    </div>
  )
}

export default SecondaryContainer