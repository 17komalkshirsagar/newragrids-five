import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEND_URL}/auth`,  credentials: "include", }),
    tagTypes: ["Admin"],
    endpoints: (builder) => ({


        registerAdmin: builder.mutation({
            query: (adminData) => ({
                url: "/admin/register",
                method: "POST",
                body: adminData,
                credentials: "include",
            }),
            invalidatesTags: ["Admin"],
            transformResponse: (data) => {
                if (data?.result) {
                    localStorage.setItem("AdminToken", JSON.stringify(data.result));
                }
                return data;
            },
            transformErrorResponse: (error) => {

                return error?.data?.message || "Something went wrong!";
            },
        }),
        signIn: builder.mutation({
            query: (credentials) => ({
                url: "/admin/login",
                method: "POST",
                body: credentials,
                credentials: "include",
            }),
            invalidatesTags: ["Admin"],
            transformResponse: (response) => {
                // Save admin info + token safely
                if (response?.data && response?.token) {
                    const adminData = { ...response.data, token: response.token };
                    localStorage.setItem("AdminToken", JSON.stringify(adminData));
                    return adminData;
                }
                return null;
            },
            transformErrorResponse: (error) => {
                return error?.data?.message || "Invalid credentials!";
            },
        }),
        signOut: builder.mutation({
            query: () => ({
                url: "/admin/logout",
                method: "POST",
                credentials: "include",
            }),
            invalidatesTags: ["Admin"],
            transformResponse: (data) => {
                localStorage.removeItem("AdminToken");
                return data;
            },
            transformErrorResponse: (error) => {
                return error?.data?.message || "Logout failed!";
            },
        }),

    }),
});

export const {
    useRegisterAdminMutation,
    useSignInMutation,
    useSignOutMutation,



    
} = authApi;





