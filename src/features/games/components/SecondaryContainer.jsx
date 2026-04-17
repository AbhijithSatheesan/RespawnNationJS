import React from 'react'
import GameList from './GameList'
import { useSelector } from 'react-redux'

const SecondaryContainer = () => {
  const games = useSelector((store) => store.gameList?.gameListContents)

  if (!games) {
    return (
      <div className="flex justify-center items-center py-32 w-full">
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
    /* CHANGED: -mt-48 pulls the rows UP over the video. pb-20 gives space at the bottom */
    <div className='-mt-48 pb-20 relative z-20 flex flex-col gap-8'>
      
      {/* Placed inside a container to control max width if needed */}
      <div className="w-full">
        <GameList title={"Trending Now"} games={games.Trending_games} isLargeRow={true} />
        <GameList title={"Top Rated"} games={games.Top_rated_games} />

        {Main_category && typeof Main_category === 'object' && Object.entries(Main_category).map(([categoryName, games]) => (
          <GameList
            key={categoryName}
            title={categoryName}
            games={games}
            category={categoryName.toLowerCase().replace(/\s+/g, '-')}   
          />
        ))}
      </div>
    </div>
  )
}

export default SecondaryContainer













// import React from 'react'
// import GameList from './GameList'
// import { useSelector } from 'react-redux'

// const SecondaryContainer = () => {

//   const games = useSelector((store) => store.gameList?.gameListContents)

//   // 1. CHANGED: A clear, styled loading state that fits your dark theme
//   if (!games) {
//     return (
//       <div className="flex justify-center items-center py-32 bg-[#121212] w-full">
//         <div className="flex flex-col items-center">
//           <div className="h-12 w-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
//           <p className="text-cyan-400 font-bold tracking-widest uppercase animate-pulse">
//             Connecting to Server...
//           </p>
//           <p className="text-gray-500 text-xs mt-2 uppercase tracking-wider">
//             (Please wait)
//           </p>
//         </div>
//       </div>
//     )
//   }

//   const Main_category = games.Main_category

//   return (
//     <div className='py-20 bg-[#121212] text-white relative z-20'>
      
//       <GameList title={"Trending"} games={games.Trending_games} />
//       <GameList title={"Top Rated"} games={games.Top_rated_games} />

//       {/* 2. CHANGED: Added a safety check (Main_category && typeof Main_category === 'object') 
//           to prevent React from crashing if the database ever returns an empty category list */}
//       {Main_category && typeof Main_category === 'object' && Object.entries(Main_category).map(([categoryName, games]) => (
//         <GameList
//           key={categoryName}
//           title={`${categoryName}`}
//           games={games}
//           category={categoryName.toLowerCase().replace(/\s+/g, '-')}   
//         />
//       ))}

//     </div>
//   )
// }

// export default SecondaryContainer