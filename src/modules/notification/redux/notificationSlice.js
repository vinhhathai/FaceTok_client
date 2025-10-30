import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification(state, action) {
      const notification = action.payload;
      // Thêm vào đầu danh sách
      state.notifications.unshift(notification);
      state.unreadCount += 1;
    },
    setNotifications(state, action) {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.isRead).length;
    },
    markAsRead(state, action) {
      const notificationId = action.payload;
      const noti = state.notifications.find(n => n._id === notificationId);
      if (noti && !noti.isRead) {
        noti.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAsReadNotification(state, action) {
      const notificationId = action.payload;
      const noti = state.notifications.find(n => n._id === notificationId);
      if (noti && !noti.isRead) {
        noti.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsReadNotification(state) {
      state.notifications.forEach(n => { n.isRead = true; });
      state.unreadCount = 0;
    },
    clearNotifications(state) {
      state.notifications = [];
      state.unreadCount = 0;
    }
  }
});

export const { addNotification, setNotifications, markAsRead, clearNotifications, markAsReadNotification, markAllAsReadNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
