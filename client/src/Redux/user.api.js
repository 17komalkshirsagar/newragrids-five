import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEND_URL}/auth`,credentials:"include" }),

    tagTypes: ["User"],
    endpoints: (builder) => ({

        registerUser: builder.mutation({
            query: (userData) => ({
                url: "/user/register",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["User"],
            transformResponse: (data) => {
                if (data?.result) {
                    localStorage.setItem("user", JSON.stringify(data.result));
                }
                return data;
            },
            transformErrorResponse: (error) => {
                return error?.data?.message || "User registration failed!";
            },
        }),

        loginUser: builder.mutation({
            query: (credentials) => ({
                url: "/user/login",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["User"],
            transformResponse: (data) => {
                if (data?.result) {
                    localStorage.setItem("user", JSON.stringify(data.result));
                }
                return data;
            },
            transformErrorResponse: (error) => {
                return error?.data?.message || "Invalid login credentials!";
            },
        }),

        logoutUser: builder.mutation({
            query: () => ({
                url: "/user/logout",
                method: "POST",
            }),
            invalidatesTags: ["User"],
            transformResponse: (data) => {
                localStorage.removeItem("user");
                return data;
            },
            transformErrorResponse: (error) => {
                return error?.data?.message || "Logout failed!";
            },
        }),

        uploadFile: builder.mutation({
            query: ({ userId, file }) => {
                const formData = new FormData();
                formData.append("file", file);

                return {
                    url: `/upload/${userId}`, // ✅ backtick fixed
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["User"],
            transformResponse: (data) => data,
            transformErrorResponse: (error) => {
                return error?.data?.message || "File upload failed!";
            },
        }),

        getCustomers: builder.query({
            query: () => "/customers",
            providesTags: ["User"],
            transformResponse: (data) => data?.result || data,
            transformErrorResponse: (error) => {
                return error?.data?.message || "Failed to fetch customers!";
            },
        }),

        registerPartner: builder.mutation({
         query: (formData) => ({
        url: "/partner/register",
        method: "POST",
        body: formData,   // ⚡ MUST BE FormData
    }),
    invalidatesTags: ["User"],
    transformResponse: (data) => data,
    transformErrorResponse: (error) =>
        error?.data?.message || "Something went wrong!",
}),
       registerAssociate: builder.mutation({
            query: (userData) => ({
                url: "/associate/register",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["User"],
            transformResponse: (data) => {
                if (data?.result) {
                    localStorage.setItem("user", JSON.stringify(data.result));
                }
                return data;
            },
            transformErrorResponse: (error) => {
                return error?.data?.message || "User registration failed!";
            },
        }),
        loginPartner: builder.mutation({
            query: (userData) => ({
                url: "/partner/login",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["User"],
            transformResponse: (data) => {
                if (data?.result) {
                    localStorage.setItem("user", JSON.stringify(data.result));
                }
                return data;
            },
            transformErrorResponse: (error) => {
                return error?.data?.message || "User registration failed!";
            },
        }),
        logoutPartner: builder.mutation({
    query: (userData) => ({
        url: "/partner/logout",
        method: "POST",
        body: userData,
    }),
    invalidatesTags: ["User"],
    transformResponse: (data) => {
        localStorage.removeItem("user");

        return data;
    },
    transformErrorResponse: (error) => {
        return error?.data?.message || "User registration failed!";
    },
}),

        //    loginAssociate: builder.mutation({
        //     query: (userData) => ({
        //         url: "/associate/login",
        //         method: "POST",
        //         body: userData,
        //     }),
        //     invalidatesTags: ["User"],
        //     transformResponse: (data) => {
        //         if (data?.result) {
        //             localStorage.setItem("user", JSON.stringify(data.result));
        //         }
        //         return data;
        //     },
        //     transformErrorResponse: (error) => {
        //         return error?.data?.message || "User registration failed!";
        //     },
        // }),
            logoutAssociate: builder.mutation({
            query: (userData) => ({
                url: "/associate/logout",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["User"],
            transformResponse: (data) => {
                if (data?.result) {
                    localStorage.setItem("user", JSON.stringify(data.result));
                }
                return data;
            },
            transformErrorResponse: (error) => {
                return error?.data?.message || "User registration failed!";
            },
        }),
        loginAssociate: builder.mutation({
  query: (userData) => ({
    url: "/associate/login",
    method: "POST",
    body: userData,
  }),
  invalidatesTags: ["User"],

  transformResponse: (response) => {
   
    return response;
  },

  transformErrorResponse: (error) => {
    return error?.data?.error || "Login failed!";
  },
}),

    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useUploadFileMutation,
    useGetCustomersQuery,
    useRegisterPartnerMutation,useRegisterAssociateMutation,
    useLoginPartnerMutation,
    useLogoutPartnerMutation,
    useLoginAssociateMutation,
    useLogoutAssociateMutation,
} = userApi;



