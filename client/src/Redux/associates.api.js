import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const associatesApi = createApi({
    reducerPath: "associatesApi",

    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL}/auth`,
        credentials: "include",   // ⭐ cookies/session ke liye
    }),

    tagTypes: ["Associates"],

    endpoints: (builder) => ({

        // -----------------------------------------
        // ADMIN AUTH
        // -----------------------------------------
        adminRegister: builder.mutation({
            query: (payload) => ({
                url: `/admin/register`,
                method: "POST",
                body: payload,
            }),
        }),

        adminLogin: builder.mutation({
            query: (payload) => ({
                url: `/admin/login`,
                method: "POST",
                body: payload,
            }),
        }),

        adminLogout: builder.mutation({
            query: () => ({
                url: `/admin/logout`,
                method: "POST",
            }),
        }),

        // -----------------------------------------
        // USER AUTH
        // -----------------------------------------
        userRegister: builder.mutation({
            query: (payload) => ({
                url: `/user/register`,
                method: "POST",
                body: payload,
            }),
        }),

        userLogin: builder.mutation({
            query: (payload) => ({
                url: `/user/login`,
                method: "POST",
                body: payload,
            }),
        }),

        userLogout: builder.mutation({
            query: () => ({
                url: `/user/logout`,
                method: "POST",
            }),
        }),

        // -----------------------------------------
        // PARTNER AUTH
        // -----------------------------------------
        partnerRegister: builder.mutation({
            query: (payload) => ({
                url: `/partner/register`,
                method: "POST",
                body: payload,
            }),
        }),

        partnerLogin: builder.mutation({
            query: (payload) => ({
                url: `/partner/login`,
                method: "POST",
                body: payload,
            }),
        }),

        partnerLogout: builder.mutation({
            query: () => ({
                url: `/partner/logout`,
                method: "POST",
            }),
        }),

        // -----------------------------------------
        // ASSOCIATE AUTH
        // -----------------------------------------
        associateRegister: builder.mutation({
            query: (payload) => ({
                url: `/associate/register`,
                method: "POST",
                body: payload,
            }),
        }),

        associateLogin: builder.mutation({
            query: (payload) => ({
                url: `/associate/login`,
                method: "POST",
                body: payload,
            }),
        }),

        associateLogout: builder.mutation({
            query: () => ({
                url: `/associate/logout`,
                method: "POST",
            }),
        }),
 getAssociateProfile: builder.query({
            query: (id) => `/profile/${id}`,  
            providesTags: ["Associates"],
        }),
    }),
});


export const {
   
    useAssociateRegisterMutation,
    useAssociateLogoutMutation,
    useAssociateLoginMutation,
usePartnerLoginMutation,
usePartnerLogoutMutation,usePartnerRegisterMutation,
    useOnboardUserMutation,

     useGetAssociateProfileQuery,
} = associatesApi;
