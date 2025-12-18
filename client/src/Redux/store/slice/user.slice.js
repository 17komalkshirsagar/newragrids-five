import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "../../user.api";

const initialState = {
    user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null,
    customers: [],
    isAuthenticated: false,
};

const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("user");
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(userApi.endpoints.registerUser.matchFulfilled, (state, { payload }) => {
                state.user = payload.result || payload.user || payload;
                state.isAuthenticated = true;
                localStorage.setItem("user", JSON.stringify(state.user));
            })
            .addMatcher(userApi.endpoints.loginUser.matchFulfilled, (state, { payload }) => {
                state.user = payload.result || payload.user || payload;
                state.isAuthenticated = true;
                localStorage.setItem("user", JSON.stringify(state.user));
            })
            .addMatcher(userApi.endpoints.logoutUser.matchFulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem("user");
            })
            .addMatcher(userApi.endpoints.getCustomers.matchFulfilled, (state, { payload }) => {
                state.customers = payload.result || payload.customers || payload;
            });
    },
});

export const {
    logoutUser,
    setUser,
} = userSlice.actions;

export default userSlice.reducer;