import { createSlice } from "@reduxjs/toolkit";

const gameListSlice= createSlice({
    name: 'game_list',
    initialState: {
        gameListContents: null,
    },
    reducers: {
        addGameListContents: (state,action) => {
            state.gameListContents = action.payload;
        },
        clearGameListContents: (state,action) => {
            state.gameListContents = null;
        },
    },
});

export const { addGameListContents, clearGameListContents } = gameListSlice.actions;
export default gameListSlice.reducer;