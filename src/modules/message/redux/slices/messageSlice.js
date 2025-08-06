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

const initialState = {
  messages: []
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addReceivedMessage(state, action) {
      const newMessage = action.payload;
      
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
        state.messages = action.payload.data || [];
      })
      
      // sendMessage
      .addCase(sendMessage.fulfilled, (state, action) => {
        // Chỉ thêm tin nhắn nếu chưa tồn tại
        const newMessage = action.payload.data;
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