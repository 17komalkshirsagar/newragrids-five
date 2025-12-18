import { createSlice } from "@reduxjs/toolkit";
import { epcApi } from "../../Epc.api";

// -----------------------------
// GET USER FROM LOCALSTORAGE
// -----------------------------
const getStoredEpc = () => {
  try {
    const saved = localStorage.getItem("EpcAuth");
    if (!saved || saved === "undefined") return null;
    return JSON.parse(saved);
  } catch (err) {
    console.error("LOCAL STORAGE PARSE ERROR:", err);
    return null;
  }
};

// -----------------------------
// INITIAL STATE
// -----------------------------
const initialState = {
  user: getStoredEpc() || null,
  token: getStoredEpc()?.token || null,
  role: getStoredEpc()?.role || "",
  sessionExpiredOpen: false,
};

// -----------------------------
// EPC SLICE
// -----------------------------
const epcSlice = createSlice({
  name: "epcSlice",
  initialState,

  reducers: {
    logoutEpcUser: (state) => {
      state.user = null;
      state.role = "";
      state.token = null;
      localStorage.removeItem("EpcAuth");
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
      // -----------------------------------------------------
      // ⭐ EPC LOGIN
      // -----------------------------------------------------
      .addMatcher(
        epcApi.endpoints.loginEpc.matchFulfilled,
        (state, { payload }) => {
          const epcData = {
            ...payload,
            role: "epc",
            token: payload.token || null,
          };

          state.user = epcData;
          state.token = payload.token || null;
          state.role = "epc";

          localStorage.setItem("EpcAuth", JSON.stringify(epcData));
        }
      )

      // -----------------------------------------------------
      // ⭐ EPC REGISTER
      // -----------------------------------------------------
      .addMatcher(
        epcApi.endpoints.registerEpc.matchFulfilled,
        (state, { payload }) => {
          const epcData = {
            ...payload,
            role: "epc",
            token: payload.token || null,
          };

          state.user = epcData;
          state.token = payload.token || null;
          state.role = "epc";

          localStorage.setItem("EpcAuth", JSON.stringify(epcData));
        }
      )

      // -----------------------------------------------------
      // ⭐ LOGOUT EPC
      // -----------------------------------------------------
      .addMatcher(epcApi.endpoints.logoutEpc.matchFulfilled, (state) => {
        state.user = null;
        state.role = "";
        state.token = null;
        localStorage.removeItem("EpcAuth");
      });
  },
});

export const {
  logoutEpcUser,
  openSessionExpiredModal,
  closeSessionExpiredModal,
} = epcSlice.actions;

export default epcSlice.reducer;
