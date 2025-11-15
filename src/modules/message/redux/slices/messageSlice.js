import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { allMessages, currentUserId } from '../../mock/mockData';
import { toast } from 'react-toastify';
import { getMessages, sendMessageToRoom } from '@message/api/messageAPI';

// Async thunk để lấy tin nhắn
export const fetchMessages = createAsyncThunk(
  'message/fetchMessages',
  async (roomId, { rejectWithValue }) => {
    try {
      const messages = await getMessages(roomId);
      return { data: messages };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch messages');
    }
  }
);

// Async thunk để gửi tin nhắn
export const sendMessage = createAsyncThunk(
  'message/sendMessage',
  async ({ roomId, content }, { rejectWithValue }) => {
    try {
      const response = await sendMessageToRoom(roomId, content);
      return { data: response.data.message };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to send message");
    }
  }
);

/**
 * Normalize message data to ensure consistent format
 * Especially for senderId which can be string or object
 */
const normalizeMessage = (message) => {
  if (!message) return message;
  
  // If message already has isFromCurrentUser flag (from socket), keep it
  if (typeof message.isFromCurrentUser === 'boolean') {
    return message;
  }
  
  const currentUserId = localStorage.getItem('currentUserId');
  
  // Extract senderId if it's an object (populated from API)
  let extractedSenderId = null;
  if (typeof message.senderId === 'string') {
    extractedSenderId = message.senderId;
  } else if (typeof message.senderId === 'object' && message.senderId !== null) {
    extractedSenderId = message.senderId._id || message.senderId.id;
  }
  
  // Determine if message is from current user
  const isFromCurrentUser = extractedSenderId && currentUserId && 
    String(extractedSenderId).trim() === String(currentUserId).trim();
  
  return {
    ...message,
    isFromCurrentUser
  };
};

const initialState = {
  messages: []
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addReceivedMessage(state, action) {
      const newMessage = normalizeMessage(action.payload);
      
      // Kiểm tra xem tin nhắn đã tồn tại chưa
      const messageExists = state.messages.some(m => m._id === newMessage._id);
      if (!messageExists) {
        // Thêm tin nhắn mới vào cuối mảng
        state.messages.push(newMessage);
      }
    },
    updateMessageAsRevoked(state, action) {
      const { messageId } = action.payload;
      const messageIndex = state.messages.findIndex(m => m._id === messageId);
      if (messageIndex !== -1) {
        state.messages[messageIndex].isRevoked = true;
      }
    },
    forceUpdateMessages(state) {
      // Chỉ trigger rerender mà không thay đổi state
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchMessages
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const messages = action.payload.data || [];
        // Normalize all messages to ensure consistent format
        state.messages = messages.map(normalizeMessage);
      })
      
      // sendMessage
      .addCase(sendMessage.fulfilled, (state, action) => {
        // Chỉ thêm tin nhắn nếu chưa tồn tại
        const newMessage = normalizeMessage(action.payload.data);
        if (newMessage) {
          const messageExists = state.messages.some(m => m._id === newMessage._id);
          if (!messageExists) {
            state.messages.push(newMessage);
          }
        }
      })
  }
});

export const { addReceivedMessage, updateMessageAsRevoked, forceUpdateMessages } = messageSlice.actions;

export default messageSlice.reducer; 