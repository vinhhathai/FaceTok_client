import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { conversations } from '../../mock/mockData';
import { getRecentConversations } from '../../api/messageAPI';
import { adaptRoomsToConversations } from '../../adapters/conversationAdapter';

// Async thunk để lấy danh sách cuộc trò chuyện
export const fetchConversations = createAsyncThunk(
  'conversation/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRecentConversations();
      console.log('API response for conversations:', response);
      
      let rooms = [];
      
      // Xử lý dữ liệu trả về từ API
      if (response.data && Array.isArray(response.data)) {
        rooms = response.data;
      } else if (response.data && Array.isArray(response.data.rooms)) {
        rooms = response.data.rooms;
      } else if (response.data && response.data.data && Array.isArray(response.data.data.rooms)) {
        rooms = response.data.data.rooms;
      }
      
      console.log('Parsed rooms from API:', rooms);
      
      // Lấy currentUserId từ localStorage
      const currentUserId = localStorage.getItem('currentUserId');
      
      if (!currentUserId) {
        console.error('No currentUserId found in localStorage');
      }
      
      // Chuẩn hóa dữ liệu
      const conversations = adaptRoomsToConversations(rooms, currentUserId);
      console.log('Normalized conversations:', conversations);
      
      return {
        success: true,
        data: conversations
      };
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return rejectWithValue(error.message || "Failed to fetch conversations");
    }
  }
);

const initialState = {
  conversations: [],
  loading: false,
  error: null
};

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    updateConversationLastMessage(state, action) {
      // Cập nhật cuộc trò chuyện sau khi tin nhắn được gửi hoặc nhận
      const { conversationId, message } = action.payload;
      const existingConversation = state.conversations.find(
        conv => conv._id === conversationId
      );
      
      if (existingConversation) {
        existingConversation.lastMessage = message;
        existingConversation.updatedAt = new Date().toISOString();
        
        // Sắp xếp lại cuộc trò chuyện theo thời gian cập nhật
        state.conversations.sort((a, b) => 
          new Date(b.updatedAt) - new Date(a.updatedAt)
        );
      } else {
        console.warn('Conversation not found for update:', conversationId);
      }
    },
    markConversationAsRead(state, action) {
      const { conversationId } = action.payload;
      const existingConversation = state.conversations.find(
        conv => conv._id === conversationId
      );
      
      if (existingConversation && existingConversation.unreadCount) {
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
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch conversations';
      })
  }
});

export const { updateConversationLastMessage, markConversationAsRead } = conversationSlice.actions;

export default conversationSlice.reducer; 