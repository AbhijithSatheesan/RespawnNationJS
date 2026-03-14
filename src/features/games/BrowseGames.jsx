import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setBrowse } from '../../services/TechBackGround/techBackgroundSlice';
import useGameListHook from '../games/useGameListHook';
import useTrendingRandomGameHook from '../games/useTrendingRandomGameHook';
import TrendingGameTrailer from './components/TrendingGameTrailer';
import SecondaryContainer from './components/SecondaryContainer';

const BrowseGames = () => {
    const dispatch = useDispatch();

    useGameListHook();
    useTrendingRandomGameHook();

    useEffect(() => {
        dispatch(setBrowse());
    }, [dispatch]);

    return (
        <div className="bg-[#121212] min-h-screen w-full overflow-x-hidden">
            {/* Hero Section */}
            <div className="relative w-full">
                <TrendingGameTrailer />
                
                {/* THE FADE: This gradient makes the video fade into the dark background */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#121212] pointer-events-none"></div>
            </div>

            {/* Content Section */}
            {/* We don't need margin-top here because SecondaryContainer handles the overlap */}
            <SecondaryContainer />
        </div>
    )
}

export default BrowseGames