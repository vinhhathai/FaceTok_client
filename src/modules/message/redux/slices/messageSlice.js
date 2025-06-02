import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { allMessages, currentUserId } from '../../mock/mockData';
// We'll keep the imports but won't use them until the API is ready
// import { getMessages, sendMessage as sendMessageApi, markAsRead } from '../../api';

// Async thunks with mock data
export const fetchMessages = createAsyncThunk(
  'message/fetchMessages',
  async (conversationId, { rejectWithValue }) => {
    try {
      // Simulate API delay - khi demo giảm delay xuống để thấy tin nhắn nhanh hơn
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Return mock data from our mock data file
      return {
        success: true,
        data: allMessages[conversationId] || []
      };
    } catch (error) {
      return rejectWithValue("Failed to fetch messages");
    }
  }
);

export const sendMessage = createAsyncThunk(
  'message/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      // Simulate API delay - giảm delay khi demo
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Create a new message with mock data
      const newMessage = {
        _id: `msg_${Date.now()}`,
        conversationId: messageData.conversationId || messageData.receiverId,
        content: messageData.content,
        senderId: currentUserId,
        createdAt: new Date().toISOString(),
        isRead: false
      };
      
      return {
        success: true,
        data: newMessage
      };
    } catch (error) {
      return rejectWithValue("Failed to send message");
    }
  }
);

export const markMessageAsRead = createAsyncThunk(
  'message/markAsRead',
  async (messageId, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return {
        success: true,
        data: { _id: messageId, isRead: true }
      };
    } catch (error) {
      return rejectWithValue("Failed to mark message as read");
    }
  }
);

const initialState = {
  messages: [],
  currentConversation: null,
  loading: false,
  sending: false,
  error: null
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setCurrentConversation(state, action) {
      state.currentConversation = action.payload;
      
      // Tự động tải tin nhắn từ dữ liệu mẫu khi chọn hội thoại
      if (action.payload && action.payload._id) {
        const conversationId = action.payload._id;
        state.messages = allMessages[conversationId] || [];
      } else {
        state.messages = [];
      }
    },
    clearCurrentConversation(state) {
      state.currentConversation = null;
      state.messages = [];
    },
    addReceivedMessage(state, action) {
      // Handle incoming message from socket
      if (state.currentConversation && 
          (action.payload.senderId === state.currentConversation.participant._id || 
           action.payload.conversationId === state.currentConversation._id)) {
        state.messages.push(action.payload);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchMessages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.data || [];
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch messages';
      })
      
      // sendMessage
      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        state.messages.push(action.payload.data);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload || 'Failed to send message';
      })
      
      // markMessageAsRead
      .addCase(markMessageAsRead.fulfilled, (state, action) => {
        const updatedMessage = action.payload.data;
        const index = state.messages.findIndex(msg => msg._id === updatedMessage._id);
        if (index !== -1) {
          state.messages[index].isRead = true;
        }
      });
  }
});

export const { addReceivedMessage, setCurrentConversation, clearCurrentConversation } = messageSlice.actions;

export default messageSlice.reducer; 