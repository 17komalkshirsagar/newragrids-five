import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const AdminDashApi = createApi({
    reducerPath: "Admindashapi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEND_URL}/substations`, credentials: "include", }),
    tagTypes: ["Admindashapi"],
    endpoints: (builder) => {
        return {
            getAllPartners: builder.query({
                query: () => ({
                    url: "/partners",
                    method: "GET",
                    credentials: "include",
                }),
                providesTags: ["Admindashapi"],
            }),

            getAllAssociates: builder.query({
                query: () => ({
                    url: "/associates",
                    method: "GET",
                    credentials: "include",
                }),
                providesTags: ["Admindashapi"],
            }),

            getAllEpc: builder.query({
                query: () => ({
                    url: "/epc",
                    method: "GET",
                    credentials: "include",
                }),
                providesTags: ["Admindashapi"],
            }),

        }
    }
})

export const { useGetAllPartnersQuery,
    useGetAllAssociatesQuery,
    useGetAllEpcQuery, } = AdminDashApi
