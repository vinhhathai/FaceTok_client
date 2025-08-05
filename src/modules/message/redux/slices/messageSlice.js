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
  messages: [],
  currentConversation: null
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setCurrentConversation(state, action) {
      state.currentConversation = action.payload;
      state.messages = [];
    },
    clearCurrentConversation(state) {
      state.currentConversation = null;
    },
    addReceivedMessage(state, action) {
      const newMessage = action.payload;
      
      // Kiểm tra xem tin nhắn đã tồn tại chưa
      const messageExists = state.messages.some(m => m._id === newMessage._id);
      if (!messageExists) {
        // Thêm tin nhắn mới vào cuối mảng
        state.messages.push(newMessage);
        
        // Sắp xếp lại tin nhắn theo thời gian tăng dần (oldest first)
        state.messages.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateA - dateB;
        });
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
            
            // Sắp xếp lại tin nhắn theo thời gian tăng dần (oldest first)
            state.messages.sort((a, b) => {
              const dateA = new Date(a.createdAt).getTime();
              const dateB = new Date(b.createdAt).getTime();
              return dateA - dateB;
            });
          }
        }
      })
  }
});

export const { addReceivedMessage, setCurrentConversation, clearCurrentConversation, forceUpdateMessages } = messageSlice.actions;

export default messageSlice.reducer; 