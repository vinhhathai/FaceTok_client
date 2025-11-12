import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../utils/auth';

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

export const announcementAPI = createApi({
  reducerPath: 'announcementAPI',
  baseQuery,
  tagTypes: ['UserAnnouncement'],
  endpoints: (builder) => ({
    // Get active announcements for current user
    getActiveAnnouncements: builder.query({
      query: () => ({
        url: 'user/announcements/active',
      }),
      transformResponse: (response) => {
        return response.data || [];
      },
      providesTags: ['UserAnnouncement'],
    }),
  }),
});

export const {
  useGetActiveAnnouncementsQuery,
} = announcementAPI;
