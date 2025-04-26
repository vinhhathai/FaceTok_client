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
      // Lấy dữ liệu từ cấu trúc mới: response.data.data
      return {
        data: response.data.data || [],
        unreadCount: response.data.unreadCount
      };
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      return rejectWithValue(
        error.response?.data?.error?.message || "Không thể tải thông báo"
      );
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/notification/read/${notificationId}`);
      return { 
        notificationId, 
        data: response.data.data 
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || "Không thể đánh dấu đã đọc"
      );
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.put("/notification/read-all");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || "Không thể đánh dấu tất cả đã đọc"
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
      // Lấy dữ liệu từ cấu trúc mới: response.data.data.count
      return { 
        count: response.data.data ? response.data.data.count : 0 
      };
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
      return rejectWithValue(
        error.response?.data?.error?.message || "Không thể lấy số thông báo chưa đọc"
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
      
      // Kiểm tra dữ liệu notification
      if (!action.payload) {
        console.error('Redux: Received invalid notification data (undefined or null)');
        return;
      }
      
      // Đảm bảo notification có id và các trường cần thiết
      if (!action.payload.id) {
        console.error('Redux: Notification is missing required id field', action.payload);
        // Tạo ID tạm thời nếu không có
        action.payload.id = `temp-${Date.now()}`;
      }
      
      // Đảm bảo type tồn tại
      if (!action.payload.type) {
        console.error('Redux: Notification is missing type field', action.payload);
        action.payload.type = 'system';
      }
      
      // Đảm bảo các trường khác có giá trị mặc định nếu không tồn tại
      const safeNotification = {
        isRead: false,
        timestamp: new Date().toISOString(),
        text: 'Thông báo mới',
        ...action.payload
      };
      
      // Thêm thông báo vào danh sách
      state.notifications.unshift(safeNotification);
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
        
        // Đảm bảo dữ liệu là một mảng hợp lệ
        const notifications = Array.isArray(action.payload?.data) ? action.payload.data : [];
        
        if (notifications.length > 0) {
          // Tạo notifications an toàn có đầy đủ các trường cần thiết
          const safeNotifications = notifications.map(notification => {
            // Kiểm tra và đảm bảo các trường cần thiết tồn tại
            return {
              id: notification.id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: notification.type || 'system',
              isRead: Boolean(notification.isRead),
              timestamp: notification.timestamp || new Date().toISOString(),
              text: notification.text || 'Thông báo mới',
              user: notification.user || null,
              link: notification.link || '/',
              ...notification
            };
          });
          
          // Lấy ID của các thông báo hiện tại
          const existingIds = new Set(state.notifications.map(n => n.id));
          
          // Chỉ thêm thông báo mới mà chưa có trong danh sách
          const newNotifications = safeNotifications.filter(n => !existingIds.has(n.id));
          
          // Gộp thông báo mới với thông báo hiện tại, ưu tiên thông báo mới lên đầu
          state.notifications = [...newNotifications, ...state.notifications];
        }
        
        // Cập nhật số lượng thông báo chưa đọc
        if (action.payload?.unreadCount !== undefined) {
          state.unreadCount = action.payload.unreadCount;
        } else {
          // Tính số lượng thông báo chưa đọc từ danh sách hiện tại
          state.unreadCount = state.notifications.filter(n => !n.isRead).length;
        }
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        // Đảm bảo action.payload tồn tại
        state.error = action?.payload || "Không thể tải thông báo";
      })
      
      // Mark notification as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        if (!action?.payload?.notificationId) return;
        
        const index = state.notifications.findIndex(
          (n) => n.id === action.payload.notificationId
        );
        if (index !== -1) {
          state.notifications[index].isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        // Xử lý lỗi nếu cần
        console.error("Failed to mark notification as read:", action?.payload || "Unknown error");
      })
      
      // Mark all notifications as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach((notification) => {
          notification.isRead = true;
        });
        state.unreadCount = 0;
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        // Xử lý lỗi nếu cần
        console.error("Failed to mark all notifications as read:", action?.payload || "Unknown error");
      })
      
      // Get unread count
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload?.count || 0;
      })
      .addCase(getUnreadCount.rejected, (state, action) => {
        // Xử lý lỗi nếu cần
        console.error("Failed to get unread count:", action?.payload || "Unknown error");
      });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer; 