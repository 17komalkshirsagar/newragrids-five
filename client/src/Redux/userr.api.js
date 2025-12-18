import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userrApi = createApi({
  reducerPath: "usereApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BACKEND_URL}/user`, }),
  tagTypes: ["User", "Documents"],
  endpoints: (builder) => ({

    uploadFile: builder.mutation({
      query: ({ userId, file }) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: `/upload/${userId}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Documents"],
      transformResponse: (response) => {
        return {
          uploadedFiles: response.uploadedFiles,
        };
      },
      transformErrorResponse: (error) => {
        return error?.data?.error || "File upload failed!";
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

    updateUserProfile: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/update/${userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
      transformResponse: (response) => ({
        message: response.message || "Profile updated successfully!",
        user: response.user || null,
      }),
      transformErrorResponse: (error) =>
        error?.data?.error || "Profile update failed!",
    }),

  }),
});

export const {
  useUploadFileMutation,
  useGetCustomersQuery,
  useUpdateUserProfileMutation
} = userrApi;