import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access-token");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const taskApi = createApi({
  reducerPath: "api",
  tagTypes: ["User", "Task", "Jwt"],
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    addUser: builder.mutation({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["User"],
    }),
    addJwt: builder.mutation({
      query: (data) => ({
        url: "/jwt",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Jwt"],
    }),
    getUserQuery: builder.query({
      query: (email) => `/tasks?email=${email}`,
      providesTags: ["Task"],
    }),
    getTasks: builder.query({
      query: () => "/tasks",
      providesTags: ["Task"],
    }),
    addTask: builder.mutation({
      query: (data) => ({
        url: "/tasks",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Task"],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/task/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),
    findTask: builder.query({
      query: (id) => `/task/${id}`,
      providesTags: ["Task"],
    }),
    editTask: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/task/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Task"],
    }),
    updateStatus: builder.mutation({
      query: ({ id, ...data }) => {
        return {
          url: `/task-update/${id}`,
          method: "PATCH",
          body: { status: data?.status },
        };
      },
      invalidatesTags: ["Task"],
    }),
    updateStatusButton: builder.mutation({
      query: ({ id, ...updateStatus }) => ({
        url: `/task-status/${id}`,
        method: "PATCH",
        body: updateStatus,
      }),
      invalidatesTags: ["Task"],
    }),
    updateBackStatusButton: builder.mutation({
      query: ({ id, ...updateBackStatus }) => ({
        url: `/task-back-status/${id}`,
        method: "PATCH",
        body: updateBackStatus,
      }),
      invalidatesTags: ["Task"],
    }),
    getTaskStats: builder.query({
      query: () => "/task-stats",
      providesTags: ["Task"],
    }),
  }),
});

export const {
  useAddUserMutation,
  useAddJwtMutation,
  useGetTasksQuery,
  useAddTaskMutation,
  useDeleteTaskMutation,
  useFindTaskQuery,
  useEditTaskMutation,
  useUpdateStatusMutation,
  useUpdateStatusButtonMutation,
  useUpdateBackStatusButtonMutation,
  useGetUserQueryQuery,
  useGetUsersQuery,
  useGetTaskStatsQuery,
} = taskApi;
export default taskApi;
