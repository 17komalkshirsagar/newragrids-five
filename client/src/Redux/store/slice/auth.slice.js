import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../../admin.api";

// Safe localStorage parsing
const getAdminFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem("AdminToken");
    if (!stored || stored === "undefined") return null;
    return JSON.parse(stored);
  } catch (err) {
    console.error("Failed to parse AdminToken:", err);
    return null;
  }
};

const initialState = {
  admin: getAdminFromLocalStorage(),
  sessionExpiredOpen: false,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    logoutAdmin: (state) => {
      state.admin = null;
      localStorage.removeItem("AdminToken");
    },
    openSessionExpiredModal: (state) => {
      state.sessionExpiredOpen = true;
    },
    closeSessionExpiredModal: (state) => {
      state.sessionExpiredOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.signIn.matchFulfilled, (state, { payload }) => {
        // Save the full payload: data + token
        state.admin = payload;
        localStorage.setItem("AdminToken", JSON.stringify(payload));
      })
      .addMatcher(authApi.endpoints.signOut.matchFulfilled, (state) => {
        state.admin = null;
        localStorage.removeItem("AdminToken");
      });
  },
});

export const { logoutAdmin, openSessionExpiredModal, closeSessionExpiredModal } = authSlice.actions;

export default authSlice.reducer;
