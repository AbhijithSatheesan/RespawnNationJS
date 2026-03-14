import { createSlice } from "@reduxjs/toolkit";
import TechBackground from "./TechBackground";


const initialState = {
    color: "#6366F1",  // this is the initial background which is the welcome page's background
};


const techBackgroundSlice = createSlice({
    name: "techBackground",
    initialState,
    reducers: {
        setWelcome(state) {
            state.color = "#FFFF"
        },
        setBrowse(state) {
            state.color = "#06f3ffff"
        },
        setTournament(state) {
            state.color = "#F59E0B"
        },
        setLive(state) {
            state.color = "#EF4444"
        },
        setCommunity(state) {
            state.color = "#10B981"
        },
    },
});



export const {
    setWelcome,
    setBrowse,
    setTournament,
    setLive,
    setCommunity,
} = techBackgroundSlice.actions;

export default techBackgroundSlice.reducer;


// #6366F1 #22D3EE #F59E0B #EF4444 #10B981