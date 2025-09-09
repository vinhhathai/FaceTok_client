import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../../../shared/utils/auth';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL + '/api/admin',
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const administratorAPI = createApi({
  reducerPath: 'administratorAPI',
  baseQuery,
  tagTypes: ['User', 'Post', 'Report', 'Statistics'],
  endpoints: (builder) => ({
    // User management
    getAllUsers: builder.query({
      query: ({ page = 1, limit = 10, search = '' }) => ({
        url: '/users',
        params: { page, limit, search },
      }),
      providesTags: ['User'],
    }),
    
    getUserById: builder.query({
      query: (userId) => `/users/${userId}`,
      providesTags: ['User'],
    }),
    
    updateUserStatus: builder.mutation({
      query: ({ userId, status }) => ({
        url: `/users/${userId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['User'],
    }),
    
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    
    // Post management
    getAllPosts: builder.query({
      query: ({ page = 1, limit = 10, search = '' }) => ({
        url: '/posts',
        params: { page, limit, search },
      }),
      providesTags: ['Post'],
    }),
    
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'],
    }),
    
    // Reports management
    getAllReports: builder.query({
      query: ({ page = 1, limit = 10, status = 'all' }) => ({
        url: '/reports',
        params: { page, limit, status },
      }),
      providesTags: ['Report'],
    }),
    
    updateReportStatus: builder.mutation({
      query: ({ reportId, status, action }) => ({
        url: `/reports/${reportId}`,
        method: 'PATCH',
        body: { status, action },
      }),
      invalidatesTags: ['Report'],
    }),
    
    // Statistics
    getStatistics: builder.query({
      query: () => '/statistics',
      providesTags: ['Statistics'],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useGetAllPostsQuery,
  useDeletePostMutation,
  useGetAllReportsQuery,
  useUpdateReportStatusMutation,
  useGetStatisticsQuery,
} = administratorAPI;