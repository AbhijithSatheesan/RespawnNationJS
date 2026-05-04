import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setBrowse } from '../../services/TechBackGround/techBackgroundSlice';
import useGameListHook from '../games/useGameListHook';
import useTrendingRandomGameHook from '../games/useTrendingRandomGameHook';
import TrendingGameTrailer from './browsepagecomponents/TrendingGameTrailer';
import SecondaryContainer from './browsepagecomponents/SecondaryContainer';

const BrowseGames = () => {
    const dispatch = useDispatch();

    useGameListHook();
    useTrendingRandomGameHook();

    useEffect(() => {
        dispatch(setBrowse());
    }, [dispatch]);

    return (
        <div className="bg-[#121212] min-h-screen w-full overflow-x-hidden flex flex-col">
            <TrendingGameTrailer />
            <SecondaryContainer />
        </div>
    )
}

export default BrowseGames