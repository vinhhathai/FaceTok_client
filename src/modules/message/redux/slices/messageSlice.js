import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { allMessages, currentUserId } from '../../mock/mockData';
// We'll use the real API now
import { getMessages, sendMessageToRoom } from '../../api/messageAPI';

// Hàm helper để trích xuất senderId từ message
const extractSenderId = (message) => {
  if (!message) return null;
  
  // Handle different formats of senderId
  if (typeof message.senderId === 'string') {
    return message.senderId;
  } else if (typeof message.senderId === 'object' && message.senderId !== null) {
    return message.senderId._id || message.senderId.id || JSON.stringify(message.senderId);
  } else if (message.sender) {
    if (typeof message.sender === 'string') {
      return message.sender;
    }
    return message.sender._id || message.sender.id || JSON.stringify(message.sender);
  }
  
  return null;
};

// Hàm helper để kiểm tra xem message có phải của current user không
const isOwnMessage = (message, currentUserId) => {
  if (!message || !currentUserId) return false;
  
  const senderId = extractSenderId(message);
  if (!senderId) return false;
  
  return String(senderId) === String(currentUserId) || 
    (typeof senderId === 'string' && senderId.includes(currentUserId));
};

// Async thunks với API mới
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
  async ({ roomId, content }, { rejectWithValue }) => {
    try {
      const response = await sendMessageToRoom(roomId, content);
      return {
        success: true,
        data: response.data?.message || response.data
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to send message");
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
      state.messages = [];
    },
    clearCurrentConversation(state) {
      state.currentConversation = null;
      state.messages = [];
    },
    addReceivedMessage(state, action) {
      // Handle incoming message from socket
      const message = action.payload.message || action.payload;
      
      // Kiểm tra dữ liệu hợp lệ
      if (!message || !message._id) {
        console.warn('Received invalid message data:', message);
        return;
      }
      
      // Lấy userId hiện tại từ localStorage
      const currentUserId = localStorage.getItem('currentUserId');
      
      // Lấy roomId từ message
      const roomIdFromMessage = message.roomId;
      
      // Kiểm tra xem cần thay thế tin nhắn optimistic không
      if (message.replaceOptimisticId) {
        const optimisticIndex = state.messages.findIndex(m => m._id === message.replaceOptimisticId);
        if (optimisticIndex !== -1) {
          // Thay thế tin nhắn optimistic bằng tin nhắn thật
          console.log('Replacing optimistic message in state:', message.replaceOptimisticId, '->', message._id);
          
          // Thêm trường isFromCurrentUser
          const completeMessage = {
            ...message,
            createdAt: message.createdAt || new Date().toISOString(),
            isFromCurrentUser: isOwnMessage(message, currentUserId)
          };
          
          // Thay thế tin nhắn optimistic
          state.messages[optimisticIndex] = completeMessage;
          return;
        }
      }
      
      // Kiểm tra tin nhắn đã tồn tại chưa
      const messageExists = state.messages.some(m => m._id === message._id);
      
      // Nếu tin nhắn không tồn tại, thêm vào danh sách
      if (!messageExists) {
        // Thêm trường isFromCurrentUser
        const completeMessage = {
          ...message,
          createdAt: message.createdAt || new Date().toISOString(),
          isFromCurrentUser: isOwnMessage(message, currentUserId)
        };
        
        // Thêm tin nhắn vào state messages, bất kể có conversation hay không
        // Điều này giúp tin nhắn được hiển thị ngay cả khi mới vào phòng
        state.messages.push(completeMessage);
        
        // Log tin nhắn mới để debug
        console.log('Added new message to state:', completeMessage);
      } else {
        console.log('Message already exists in state, skipping:', message._id);
      }
    },
    forceUpdateMessages(state) {
      // Chỉ trigger rerender mà không thay đổi state
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
        
        // Chỉ thêm tin nhắn nếu chưa tồn tại
        const newMessage = action.payload.data;
        if (newMessage) {
          const messageExists = state.messages.some(m => m._id === newMessage._id);
          if (!messageExists) {
            state.messages.push(newMessage);
          }
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload || 'Failed to send message';
      })
  }
});

export const { addReceivedMessage, setCurrentConversation, clearCurrentConversation, forceUpdateMessages } = messageSlice.actions;

export default messageSlice.reducer; 