import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const epcdashboardApi = createApi({
    reducerPath: "epcdashboardApi",

    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL}/epc`,
        credentials: "include",
    }),

    tagTypes: ["EPC", "SolarFarm", "EpcProfile"],

    endpoints: (builder) => ({


        addSolarFarm: builder.mutation({
            query: ({ id, data }) => ({
                url: `/solarfarm/${id}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["SolarFarm"],
        }),

        
        getEpcProfile: builder.query({
            query: (id) => `/profile/${id}`,
            providesTags: ["EpcProfile"],
        }),
    }),
});

export const {
    useAddSolarFarmMutation,
    useGetEpcProfileQuery
} = epcdashboardApi;


