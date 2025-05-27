import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import * as notificationAPI from '../api/notificationAPI';

// Example async thunk
// export const getNotifications = createAsyncThunk(
//   'notification/getNotifications',
//   async (_, { rejectWithValue }) => {
//     try {
//       const data = await notificationAPI.getNotifications();
//       return data;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // Regular reducers here
    clearError: (state) => {
      state.error = null;
    },
    markAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    }
  },
  extraReducers: (builder) => {
    // Handle async actions here
    // builder
    //   .addCase(getNotifications.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(getNotifications.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.notifications = action.payload;
    //     state.unreadCount = action.payload.filter(n => !n.read).length;
    //   })
    //   .addCase(getNotifications.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   });
  }
});

export const { clearError, markAsRead } = notificationSlice.actions;
export default notificationSlice.reducer; 