import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const partnersApi = createApi({
    reducerPath: "partnersApi",

    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL}/partners`,
        credentials: "include",
    }),

    tagTypes: ["Partners"],

    endpoints: (builder) => ({

     

        getPartnerProfile: builder.query({
            query: (id) => `/profile/partners/${id}`,
            providesTags: ["Partners"],
        }),
    }),
});


export const {
    
    useGetPartnerProfileQuery,
} = partnersApi;
