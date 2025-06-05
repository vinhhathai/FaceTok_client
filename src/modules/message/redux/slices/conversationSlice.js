import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { conversations } from '../../mock/mockData';
import { getRecentConversations, getUnreadCount } from '../../api/messageAPI';

// Async thunks with real API calls
export const fetchConversations = createAsyncThunk(
  'conversation/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRecentConversations();
      return {
        success: true,
        // Check for the correct data structure in the API response
        data: response.data && Array.isArray(response.data) 
          ? response.data 
          : (response.data && Array.isArray(response.data.rooms) 
              ? response.data.rooms 
              : [])
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch conversations");
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'conversation/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUnreadCount();
      return {
        success: true,
        data: response.data || { count: 0 }
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch unread count");
    }
  }
);

const initialState = {
  conversations: [],
  unreadCount: 0,
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