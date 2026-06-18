import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setBrowse } from '../../services/TechBackGround/techBackgroundSlice';
import useGameListHook from '../games/useGameListHook';
import useTrendingRandomGameHook from '../games/useTrendingRandomGameHook';
import TrendingGameTrailer from './browsepagecomponents/TrendingGameTrailer';
import SecondaryContainer from './browsepagecomponents/SecondaryContainer';
import BrowseShimmer from './browsepagecomponents/BrowseShimmer';

const BrowseGames = () => {
    const dispatch = useDispatch();

    // Trigger API calls
    useGameListHook();
    useTrendingRandomGameHook();

    useEffect(() => {
        dispatch(setBrowse());
    }, [dispatch]);

    // Check if the critical data has arrived in Redux yet
    const trendingGame = useSelector((store) => store.trendingRandomGame?.trending_random_game?.trending_game);
    const gameList = useSelector((store) => store.gameList?.gameListContents);

    // If either piece of data is missing, show the unified page shimmer
    if (!trendingGame || !gameList) {
        return <BrowseShimmer />;
    }

    // Once data is here, render the real components
    return (
        <div className="bg-[#121212] min-h-screen w-full overflow-x-hidden flex flex-col">
            <TrendingGameTrailer />
            <SecondaryContainer />
        </div>
    )
}

export default BrowseGames;