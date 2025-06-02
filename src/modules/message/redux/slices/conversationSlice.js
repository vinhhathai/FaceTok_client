import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { conversations } from '../../mock/mockData';
// import { getRecentConversations, getUnreadCount } from '../../api';

// Async thunks with mock data
export const fetchConversations = createAsyncThunk(
  'conversation/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Return mock conversations
      return {
        success: true,
        data: conversations
      };
    } catch (error) {
      return rejectWithValue("Failed to fetch conversations");
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'conversation/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Calculate unread count from mock conversations
      const count = conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
      
      return {
        success: true,
        data: { count }
      };
    } catch (error) {
      return rejectWithValue("Failed to fetch unread count");
    }
  }
);

// Tính tổng số tin nhắn chưa đọc
const totalUnreadCount = conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);

const initialState = {
  conversations: conversations, // Sử dụng trực tiếp dữ liệu mẫu
  unreadCount: totalUnreadCount,
  loading: false,
  error: null
};

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    updateConversationLastMessage(state, action) {
      // Update conversation after new message is sent or received
      const { conversationId, message } = action.payload;
      const existingConversation = state.conversations.find(
        conv => conv._id === conversationId
      );
      
      if (existingConversation) {
        existingConversation.lastMessage = message;
        existingConversation.updatedAt = new Date().toISOString();
        
        // If message is unread, increment unread count
        if (!message.isRead && message.senderId !== localStorage.getItem('currentUserId')) {
          existingConversation.unreadCount = (existingConversation.unreadCount || 0) + 1;
          state.unreadCount += 1;
        }
        
        // Re-sort conversations by updatedAt
        state.conversations.sort((a, b) => 
          new Date(b.updatedAt) - new Date(a.updatedAt)
        );
      }
    },
    markConversationAsRead(state, action) {
      const { conversationId } = action.payload;
      const existingConversation = state.conversations.find(
        conv => conv._id === conversationId
      );
      
      if (existingConversation && existingConversation.unreadCount) {
        state.unreadCount -= existingConversation.unreadCount;
        existingConversation.unreadCount = 0;
        
        if (existingConversation.lastMessage) {
          existingConversation.lastMessage.isRead = true;
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchConversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload.data || [];
        // Count total unread messages
        state.unreadCount = state.conversations.reduce(
          (count, conv) => count + (conv.unreadCount || 0), 0
        );
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch conversations';
      })
      
      // fetchUnreadCount
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.data.count;
      });
  }
});

export const { updateConversationLastMessage, markConversationAsRead } = conversationSlice.actions;

export default conversationSlice.reducer; 