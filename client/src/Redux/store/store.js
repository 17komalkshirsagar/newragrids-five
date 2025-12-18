import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../store/slice/auth.slice";
import userSlice from "../store/slice/user.slice";

import { userApi } from "../user.api";
import { authApi } from "../admin.api";
import { userrApi } from "../userr.api";
import { substationsApi } from "../substations.api";
import { associatesApi } from "../associates.api";
import associatePartnerReducer from "../store/slice/associate.partner.slice";
import epcReducer from "../store/slice/epc.slice";
import { epcApi } from "../Epc.api";
import { epcdashboardApi } from "../epcDashboard.api";
import { partnersApi } from "../partners.api";
import { AdminDashApi } from "../admindashApi";
import { associateUpdatesApi } from "../associateUpdate.api";

const reduxStore = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userrApi.reducerPath]: userrApi.reducer,

    // ⭐ Substations API reducer
    [substationsApi.reducerPath]: substationsApi.reducer,

    [associatesApi.reducerPath]: associatesApi.reducer,
    [epcdashboardApi.reducerPath]: epcdashboardApi.reducer,
    [partnersApi.reducerPath]: partnersApi.reducer,
    [AdminDashApi.reducerPath]: AdminDashApi.reducer,
    [associateUpdatesApi.reducerPath]: associateUpdatesApi.reducer,

    [epcApi.reducerPath]: epcApi.reducer,
    associatePartner: associatePartnerReducer,
    epc: epcReducer,
    auth: authSlice,
    user: userSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Fix RTK Query warnings
    }).concat(
      userApi.middleware,
      authApi.middleware,
      userrApi.middleware,

      // ⭐ Substation middleware
      substationsApi.middleware,
      epcdashboardApi.middleware,
      associatesApi.middleware,
      associateUpdatesApi.middleware,
      partnersApi.middleware,
      AdminDashApi.middleware
    ),
});

export default reduxStore;
