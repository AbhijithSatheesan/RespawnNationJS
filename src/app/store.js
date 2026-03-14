import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/auth/userSlice"
import techBackgroundReducer from "../services/TechBackGround/techBackgroundSlice";
import gameListReducer from "../features/games/gameListSlice";
import trendingGameReducer from "../features/games/trendingRandomGame";



const store = configureStore({
    reducer: {
        user: userReducer,
        techBackground: techBackgroundReducer,
        gameList: gameListReducer,
        trendingRandomGame: trendingGameReducer
    },
});

export default store;
