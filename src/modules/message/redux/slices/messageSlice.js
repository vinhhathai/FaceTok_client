import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { allMessages, currentUserId } from '../../mock/mockData';
// We'll use the real API now
import { getMessages, sendMessage as sendMessageApi, markAsRead } from '../../api/messageAPI';

// Async thunks with real API calls
export const fetchMessages = createAsyncThunk(
  'message/fetchMessages',
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await getMessages(roomId);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch messages");
    }
  }
);

export const sendMessage = createAsyncThunk(
  'message/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await sendMessageApi(messageData);
      const messageResponse = response.data && response.data.message 
        ? response.data.message 
        : (response.data && response.data.data && response.data.data.message 
          ? response.data.data.message 
          : response.data);
          
      return {
        success: true,
        data: messageResponse
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to send message");
    }
  }
);

export const markMessageAsRead = createAsyncThunk(
  'message/markAsRead',
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await markAsRead(roomId);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to mark message as read");
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
      // Don't auto-load messages here anymore, we'll use the fetchMessages thunk
      state.messages = [];
    },
    clearCurrentConversation(state) {
      state.currentConversation = null;
      state.messages = [];
    },
    addReceivedMessage(state, action) {
      // Handle incoming message from socket - ensure we have a proper format
      const message = action.payload.message || action.payload;
      
      // Make sure we're only adding messages to the current conversation
      if (state.currentConversation && 
          ((message.senderId === state.currentConversation.participant._id) || 
           (message.roomId === state.currentConversation._id) ||
           (message.room && message.room._id === state.currentConversation._id))) {
        
        // Check if message already exists to avoid duplicates
        const messageExists = state.messages.some(m => m._id === message._id);
        if (!messageExists) {
          state.messages.push(message);
        }
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
        
        // Only add message if it's not already in the list
        const newMessage = action.payload.data;
        const messageExists = state.messages.some(m => m._id === newMessage._id);
        if (!messageExists) {
          state.messages.push(newMessage);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload || 'Failed to send message';
      })
      
      // markMessageAsRead
      .addCase(markMessageAsRead.fulfilled, (state, action) => {
        const updatedMessage = action.payload.data;
        if (updatedMessage && updatedMessage._id) {
          const index = state.messages.findIndex(msg => msg._id === updatedMessage._id);
          if (index !== -1) {
            state.messages[index].isRead = true;
          }
        }
      });
  }
});

export const { addReceivedMessage, setCurrentConversation, clearCurrentConversation } = messageSlice.actions;

export default messageSlice.reducer; 