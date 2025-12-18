import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const substationsApi = createApi({
  reducerPath: "substationsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/substations`,
    credentials: "include",
  }),

  keepUnusedDataFor: 0,
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: false,

  tagTypes: ["Substations", "Partners"],

  endpoints: (builder) => ({

    // ------------------ MSEDCL ---------------------
    getMsedclSubstations: builder.query({
      query: () => "/getAllSubstations",

      transformResponse: (response) => {
        /**
         * backend returns:
         * { message, total, data: [...] }
         */
        if (response?.data && Array.isArray(response.data)) {
          return response.data;
        }
        if (Array.isArray(response)) return response;
        return [];
      },

      providesTags: ["Substations"],
    }),

    // ------------------ MSETCL ----------------------
    getMsetclSubstations: builder.query({
      query: () => "/MsetclSubstations",

      transformResponse: (response) => {
        console.log("RAW MSETCL RESPONSE :: ", response);

        /**
         * backend returns this ALWAYS:
         * { message, total, data: [...] }
         */
        if (response?.data && Array.isArray(response.data)) {
          return response.data; // FINAL FIX
        }

        if (Array.isArray(response)) return response;

        return [];
      },

      providesTags: ["Substations"],
    }),

    // ------------------ PARTNERS ----------------------
    getAllPartners: builder.query({
      query: () => "/partners",

      transformResponse: (response) => {
        if (response?.data && Array.isArray(response.data)) {
          return response.data;
        }
        if (Array.isArray(response)) return response;
        return [];
      },

      providesTags: ["Partners"],
    }),
  }),
});

export const {
  useGetMsedclSubstationsQuery,
  useGetMsetclSubstationsQuery,
  useGetAllPartnersQuery,
} = substationsApi;
