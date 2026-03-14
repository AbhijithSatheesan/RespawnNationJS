import { createSlice } from "@reduxjs/toolkit";


const trendingRandomGameSlice= createSlice({
    name:'trending_random_game',
    initialState: {
        trending_random_game: null,
    },
    reducers: {
        addTrendingRandomGame: (state,action) => {
            state.trending_random_game = action.payload;
        },
    },
});

export const { addTrendingRandomGame } = trendingRandomGameSlice.actions;
export default trendingRandomGameSlice.reducer;