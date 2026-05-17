import { createSlice } from "@reduxjs/toolkit";

// 1. Grab the pieces from localStorage before initializing the slice
const storedToken = localStorage.getItem("access_token");
const storedUserInfo = localStorage.getItem("user_info") ? JSON.parse(localStorage.getItem("user_info")) : null;
const storedUserId = localStorage.getItem("id");

// 2. Combine them back together into one object if user info exists
const initialUser = storedUserInfo 
  ? { ...storedUserInfo, id: storedUserId } 
  : null;

const userSlice = createSlice({
    name: 'user',
    initialState: {
        token: storedToken || null,
        userInfo: initialUser, // Now Redux starts with both username AND id!
        loading: false,
        error: null,
    },
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.token = action.payload.token;
            state.userInfo = action.payload.user;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            // clear storage
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user_info");
            localStorage.removeItem("id"); // ADDED: Clear the ID on logout!
            
            // clear state
            state.token = null;
            state.userInfo = null;
            state.error = null;
        }
    }
});

export const { loginStart, loginSuccess, loginFailure, logout } = userSlice.actions;
export default userSlice.reducer;