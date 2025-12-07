import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../../../shared/utils/auth';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL,
  credentials: 'include', // Send httpOnly cookies
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
  tagTypes: ['User', 'Post', 'Report', 'Statistics', 'Announcement'],
  endpoints: (builder) => ({
    // Verify admin access
    verifyAdmin: builder.query({
      query: () => ({
        url: 'user/admin/verify',
      }),
      transformResponse: (response) => response,
    }),

    // User management - use admin API endpoints
    getAllUsers: builder.query({
      query: ({ page = 1, limit = 10, search = '', role = '', isActive = '', isEmailVerified = '' }) => ({
        url: 'user/admin/users',
        params: { page, limit, search, role, isActive, isEmailVerified },
      }),
      transformResponse: (response) => {
        // Backend returns { success, data: { users, pagination }, message }
        return {
          data: response.data?.users || [],
          pagination: response.data?.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 10,
            hasNextPage: false,
            hasPrevPage: false
          },
          total: response.data?.pagination?.totalItems || 0,
          page: response.data?.pagination?.currentPage || 1,
          limit: response.data?.pagination?.itemsPerPage || 10,
        };
      },
      providesTags: ['User'],
    }),
    
    getUserById: builder.query({
      query: (userId) => `user/admin/users/${userId}`,
      providesTags: ['User'],
    }),
    
    banUser: builder.mutation({
      query: (userId) => ({
        url: `user/admin/users/${userId}/ban`,
        method: 'PUT',
      }),
      invalidatesTags: ['User', 'Statistics'],
    }),
    
    unbanUser: builder.mutation({
      query: (userId) => ({
        url: `user/admin/users/${userId}/unban`,
        method: 'PUT',
      }),
      invalidatesTags: ['User', 'Statistics'],
    }),
    
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `user/admin/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'Statistics'],
    }),

    sendEmailToUser: builder.mutation({
      query: ({ userId, subject, message }) => ({
        url: 'user/admin/send-email',
        method: 'POST',
        body: { userId, subject, message },
      }),
    }),

    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `user/admin/users/${userId}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: ['User', 'Statistics'],
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
    
    // Statistics
    getStatistics: builder.query({
      query: () => 'user/admin/statistics',
      transformResponse: (response) => {
        // Backend returns { success, data: { totalUsers, activeUsers, ... }, message }
        return response.data || {
          totalUsers: 0,
          activeUsers: 0,
          inactiveUsers: 0,
          usersByRole: {
            admin: 0,
            staff: 0,
            member: 0
          },
          newUsersThisMonth: 0,
        };
      },
      providesTags: ['Statistics'],
    }),

    // Announcement management
    createAnnouncement: builder.mutation({
      query: (announcementData) => {
        // If there's an image file, use FormData
        if (announcementData.imageFile) {
          const formData = new FormData();
          formData.append('title', announcementData.title);
          formData.append('message', announcementData.message);
          formData.append('type', announcementData.type);
          formData.append('targetAudience', announcementData.targetAudience);
          if (announcementData.startsAt) formData.append('startsAt', announcementData.startsAt);
          if (announcementData.expiresAt) formData.append('expiresAt', announcementData.expiresAt);
          formData.append('image', announcementData.imageFile);
          
          return {
            url: 'user/admin/announcements',
            method: 'POST',
            body: formData,
          };
        }
        // Otherwise send JSON
        return {
          url: 'user/admin/announcements',
          method: 'POST',
          body: announcementData,
        };
      },
      invalidatesTags: ['Announcement'],
    }),

    getAllAnnouncements: builder.query({
      query: ({ page = 1, limit = 10, isActive, type, targetAudience }) => ({
        url: 'user/admin/announcements',
        params: { page, limit, isActive, type, targetAudience },
      }),
      transformResponse: (response) => {
        return {
          data: response.data?.announcements || [],
          pagination: response.data?.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 10,
            hasNextPage: false,
            hasPrevPage: false
          },
        };
      },
      providesTags: ['Announcement'],
    }),

    getAnnouncementById: builder.query({
      query: (id) => `user/admin/announcements/${id}`,
      providesTags: ['Announcement'],
    }),

    updateAnnouncement: builder.mutation({
      query: ({ id, ...data }) => {
        // If there's an image file, use FormData
        if (data.imageFile) {
          const formData = new FormData();
          formData.append('title', data.title);
          formData.append('message', data.message);
          formData.append('type', data.type);
          formData.append('targetAudience', data.targetAudience);
          if (data.startsAt) formData.append('startsAt', data.startsAt);
          if (data.expiresAt) formData.append('expiresAt', data.expiresAt);
          formData.append('image', data.imageFile);
          
          return {
            url: `user/admin/announcements/${id}`,
            method: 'PUT',
            body: formData,
          };
        }
        // Otherwise send JSON
        return {
          url: `user/admin/announcements/${id}`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['Announcement'],
    }),

    deleteAnnouncement: builder.mutation({
      query: (id) => ({
        url: `user/admin/announcements/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Announcement'],
    }),

    // Report Management
    getReportStatistics: builder.query({
      query: () => ({
        url: 'user/admin/reports/statistics',
      }),
      transformResponse: (response) => response.data,
      providesTags: ['Report'],
    }),

    getAllReports: builder.query({
      query: ({ page = 1, limit = 10, status = '', reportType = '' }) => ({
        url: 'user/admin/reports',
        params: { page, limit, status, reportType },
      }),
      transformResponse: (response) => {
        return {
          data: response.data?.reports || [],
          pagination: response.data?.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 10,
            hasNextPage: false,
            hasPrevPage: false
          },
          total: response.data?.total || 0,
        };
      },
      providesTags: ['Report'],
    }),

    getReportById: builder.query({
      query: (id) => ({
        url: `user/admin/reports/${id}`,
      }),
      transformResponse: (response) => response.data,
      providesTags: ['Report'],
    }),

    updateReportStatus: builder.mutation({
      query: ({ id, status, adminNote }) => ({
        url: `user/admin/reports/${id}/status`,
        method: 'PATCH',
        body: { status, adminNote },
      }),
      invalidatesTags: ['Report'],
    }),

    deleteReport: builder.mutation({
      query: (id) => ({
        url: `user/admin/reports/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Report'],
    }),

    // User Report Endpoints
    createReport: builder.mutation({
      query: (data) => {
        const { imageFile, ...reportData } = data;
        
        // If there's an image, send as FormData
        if (imageFile) {
          const formData = new FormData();
          formData.append('image', imageFile);
          
          // Append other fields
          Object.keys(reportData).forEach(key => {
            if (reportData[key] !== null && reportData[key] !== undefined && reportData[key] !== '') {
              formData.append(key, reportData[key]);
            }
          });
          
          return {
            url: 'user/reports',
            method: 'POST',
            body: formData,
          };
        }
        
        // Otherwise send JSON
        return {
          url: 'user/reports',
          method: 'POST',
          body: reportData,
        };
      },
      invalidatesTags: ['Report'],
    }),

    getUserReports: builder.query({
      query: ({ page = 1, limit = 10, status = '' }) => ({
        url: 'user/reports',
        params: { page, limit, status },
      }),
      transformResponse: (response) => {
        return {
          data: response.data?.reports || [],
          pagination: response.data?.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 10,
            hasNextPage: false,
            hasPrevPage: false
          },
          total: response.data?.total || 0,
        };
      },
      providesTags: ['Report'],
    }),
  }),
});

export const {
  useVerifyAdminQuery,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useBanUserMutation,
  useUnbanUserMutation,
  useDeleteUserMutation,
  useSendEmailToUserMutation,
  useUpdateUserRoleMutation,
  useGetAllPostsQuery,
  useDeletePostMutation,
  useGetStatisticsQuery,
  useCreateAnnouncementMutation,
  useGetAllAnnouncementsQuery,
  useGetAnnouncementByIdQuery,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  // Report hooks
  useGetReportStatisticsQuery,
  useGetAllReportsQuery,
  useGetReportByIdQuery,
  useUpdateReportStatusMutation,
  useDeleteReportMutation,
  useCreateReportMutation,
  useGetUserReportsQuery,
} = administratorAPI;