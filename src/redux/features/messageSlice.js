import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Hàm trợ giúp để xử lý dữ liệu từ API mới
const getDataFromResponse = (response) => {
  console.log('Response data:', response.data);
  return response.data.data !== undefined ? response.data.data : response.data;
};

// Thunks
export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/message/conversations');
      const data = getDataFromResponse(response);
      console.log('Fetched conversations:', data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      const errorData = error.response?.data?.error || error.response?.data || 'Failed to fetch conversations';
      return rejectWithValue(errorData);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/message/messages/${conversationId}`);
      const data = getDataFromResponse(response);
      console.log(`Fetched messages for conversation ${conversationId}:`, data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error(`Error fetching messages for conversation ${conversationId}:`, error);
      const errorData = error.response?.data?.error || error.response?.data || 'Failed to fetch messages';
      return rejectWithValue(errorData);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ conversationId, text }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/message/messages`, { conversationId, text });
      const data = getDataFromResponse(response);
      console.log(`Sent message to conversation ${conversationId}:`, data);
      return data;
    } catch (error) {
      console.error(`Error sending message to conversation ${conversationId}:`, error);
      const errorData = error.response?.data?.error || error.response?.data || 'Failed to send message';
      return rejectWithValue(errorData);
    }
  }
);

// Initial state
const initialState = {
  conversations: [],
  messages: [],
  activeConversation: null,
  loading: false,
  error: null,
  onlineUsers: [],
  typingUsers: {} // { userId: boolean }
};

// Slice
const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    // Real-time actions
    addMessage: (state, action) => {
      const message = action.payload;
      
      // Add message to messages array if it's for the current conversation
      if (state.activeConversation && message.conversationId === state.activeConversation.id) {
        // Check if message already exists
        if (!state.messages.some(m => m.id === message.id)) {
          state.messages.push(message);
        }
      }
      
      // Update conversation with the latest message
      const conversationIndex = state.conversations.findIndex(
        c => c.id === message.conversationId
      );
      
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].lastMessage = message.text;
        state.conversations[conversationIndex].timestamp = message.timestamp;
        
        // Update unread count if user is not in this conversation
        if (state.activeConversation?.id !== message.conversationId) {
          state.conversations[conversationIndex].unread += 1;
        }
      } else {
        // If conversation doesn't exist yet, we should fetch all conversations
        // This will be handled by the component
      }
    },
    updateMessageRead: (state, action) => {
      const messageId = action.payload;
      const messageIndex = state.messages.findIndex(m => m.id === messageId);
      
      if (messageIndex !== -1) {
        state.messages[messageIndex].read = true;
      }
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setTypingStatus: (state, action) => {
      const { userId, typing } = action.payload;
      state.typingUsers[userId] = typing;
      
      // Remove typing status after a while if true
      if (!typing) {
        delete state.typingUsers[userId];
      }
    },
    resetUnreadCount: (state, action) => {
      const conversationId = action.payload;
      const conversationIndex = state.conversations.findIndex(
        c => c.id === conversationId
      );
      
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].unread = 0;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchConversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle fetchMessages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle sendMessage via HTTP (will usually be handled by socket now)
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.messages.push(action.payload);
          
          // Update the last message in the conversation
          const conversationIndex = state.conversations.findIndex(
            c => c.id === action.payload.conversationId
          );
          
          if (conversationIndex !== -1) {
            state.conversations[conversationIndex].lastMessage = action.payload.text;
            state.conversations[conversationIndex].timestamp = action.payload.timestamp;
          }
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  setActiveConversation, 
  clearMessages,
  addMessage,
  updateMessageRead,
  setOnlineUsers,
  setTypingStatus,
  resetUnreadCount
} = messageSlice.actions;

export default messageSlice.reducer; 