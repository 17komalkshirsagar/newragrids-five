import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const epcApi = createApi({
    reducerPath: "epcApi",

    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL}`,
        credentials: "include",
    }),

    tagTypes: ["EPC"],

    endpoints: (builder) => ({

        // ⭐ REGISTER EPC
        registerEpc: builder.mutation({
            query: (payload) => ({
                url: `/auth/EPC/register`, // FINAL FIXED
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["EPC"],
        }),

        // ⭐ LOGIN EPC
        loginEpc: builder.mutation({
            query: (payload) => ({
                url: `/auth/EPC/login`, // FINAL FIXED
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["EPC"],
        }),

        // ⭐ LOGOUT EPC
        logoutEpc: builder.mutation({
            query: () => ({
                url: `/auth/EPC/logout`, // FINAL FIXED
                method: "POST",
            }),
            invalidatesTags: ["EPC"],
        }),

    }),
});

export const {
    useRegisterEpcMutation,
    useLoginEpcMutation,
    useLogoutEpcMutation,
} = epcApi;
