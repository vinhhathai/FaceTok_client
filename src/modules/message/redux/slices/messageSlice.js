import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { allMessages, currentUserId } from '../../mock/mockData';
// We'll use the real API now
import { getMessages, sendMessage as sendMessageApi } from '../../api/messageAPI';

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
      // Handle incoming message from socket - ensure we have a proper format
      const message = action.payload.message || action.payload;
      
      // Kiểm tra dữ liệu hợp lệ
      if (!message || !message._id) {
        return;
      }
      
      // Nếu chưa có conversation hiện tại thì return
      if (!state.currentConversation) {
        return;
      }
      
      // Lấy userId hiện tại từ localStorage
      const currentUserId = localStorage.getItem('currentUserId');
      
      // Xác định đúng senderId từ message
      const senderId = extractSenderId(message);
      
      // Lấy roomId từ message (xử lý cả hai format từ message_sent và message_received)
      const roomIdFromMessage = 
        message.roomId || 
        (message.room && message.room._id) || 
        (action.payload.room && action.payload.room._id);
      
      const conversationId = state.currentConversation._id;
      
      // Kiểm tra message thuộc về conversation hiện tại không
      const belongsToCurrentConversation = 
        roomIdFromMessage === conversationId || 
        (state.currentConversation.participant && 
         (String(senderId) === String(state.currentConversation.participant._id) || 
          String(senderId) === String(state.currentConversation.participant.id)));
      
      if (belongsToCurrentConversation) {
        // Check if message already exists to avoid duplicates
        const messageExists = state.messages.some(m => m._id === message._id);
        
        if (!messageExists) {
          // Force fix cho các trường bị thiếu
          const completeMessage = {
            ...message,
            createdAt: message.createdAt || new Date().toISOString(),
            senderId: senderId || currentUserId,
            // Gán thêm một flag để đánh dấu message này là từ current user
            isFromCurrentUser: isOwnMessage(message, currentUserId)
          };
          
          state.messages.push(completeMessage);
          
          // Phát sự kiện để UI cập nhật
          try {
            const updateEvent = new CustomEvent('MESSAGE_ADDED_TO_REDUX', {
              detail: completeMessage
            });
            window.dispatchEvent(updateEvent);
          } catch (e) {
            console.error('Error dispatching custom event:', e);
          }
        }
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
  }
});

export const { addReceivedMessage, setCurrentConversation, clearCurrentConversation, forceUpdateMessages } = messageSlice.actions;

export default messageSlice.reducer; 