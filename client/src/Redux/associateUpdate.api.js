import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const associateUpdatesApi = createApi({
    reducerPath: "associateUpdatesApi",

    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL}/associates`,
        credentials: "include",
    }),

    tagTypes: ["Associates"],

    endpoints: (builder) => ({

        onboardUser: builder.mutation({
            query: ({ id, payload }) => ({
                url: `/onboard/${id}`,
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: ["Associates"],
        }),


        getAssociateProfile: builder.query({
            query: (id) => `/profile/${id}`,  
            providesTags: ["Associates"],
        }),
    }),
});


export const {


    useOnboardUserMutation,
useGetAssociateProfileQuery

} = associateUpdatesApi;
