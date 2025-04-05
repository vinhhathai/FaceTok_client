import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk actions
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching notifications from API");
      const response = await axios.get("/notification/list");
      console.log("API returned notifications:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      return rejectWithValue(
        error.response?.data?.message || "Không thể tải thông báo"
      );
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/notification/read/${notificationId}`);
      return { notificationId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể đánh dấu đã đọc"
      );
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.put("/notification/read-all");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể đánh dấu tất cả đã đọc"
      );
    }
  }
);

export const getUnreadCount = createAsyncThunk(
  "notifications/getUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching unread count...");
      const response = await axios.get("/notification/unread-count");
      console.log("Unread count response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
      return rejectWithValue(
        error.response?.data?.message || "Không thể lấy số thông báo chưa đọc"
      );
    }
  }
);

// Notification slice
const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
    unreadCount: 0
  },
  reducers: {
    addNotification: (state, action) => {
      console.log('Redux: addNotification action received', action.payload);
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
      console.log('Redux: State after adding notification', { 
        count: state.notifications.length, 
        unreadCount: state.unreadCount 
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        
        // Nếu có dữ liệu từ API
        if (action.payload.data && action.payload.data.length > 0) {
          // Lấy ID của các thông báo hiện tại
          const existingIds = state.notifications.map(n => n.id);
          
          // Chỉ thêm thông báo mới mà chưa có trong danh sách
          const newNotifications = action.payload.data.filter(n => !existingIds.includes(n.id));
          
          // Gộp thông báo mới với thông báo hiện tại, ưu tiên thông báo mới lên đầu
          state.notifications = [...newNotifications, ...state.notifications];
        }
        
        // Cập nhật số lượng thông báo chưa đọc
        if (action.payload.unreadCount !== undefined) {
          state.unreadCount = action.payload.unreadCount;
        } else {
          // Tính số lượng thông báo chưa đọc từ danh sách hiện tại
          state.unreadCount = state.notifications.filter(n => !n.isRead).length;
        }
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Mark notification as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(
          (n) => n.id === action.payload.notificationId
        );
        if (index !== -1) {
          state.notifications[index].isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      
      // Mark all notifications as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach((notification) => {
          notification.isRead = true;
        });
        state.unreadCount = 0;
      })
      
      // Get unread count
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.count;
      });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer; 