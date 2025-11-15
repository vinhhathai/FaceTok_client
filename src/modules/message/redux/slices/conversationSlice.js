import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { conversations } from '../../mock/mockData';
import { getUserRooms } from "@message/api/messageAPI";
import { adaptRoomsToConversations } from "@message/adapters/conversationAdapter";

// Async thunk để lấy danh sách cuộc trò chuyện
export const fetchConversations = createAsyncThunk(
  "conversation/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserRooms();
      // debug removed
      console.log(response);

      let rooms = [];

      // Xử lý dữ liệu trả về từ API
      if (response.data && Array.isArray(response.data)) {
        rooms = response.data;
      } else if (response.data && Array.isArray(response.data.rooms)) {
        rooms = response.data.rooms;
      } else if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data.rooms)
      ) {
        rooms = response.data.data.rooms;
      }

      // debug removed

      // Lấy currentUserId từ localStorage
      const currentUserId = localStorage.getItem("currentUserId");

      if (!currentUserId) {
        console.error("No currentUserId found in localStorage");
      }

      // Chuẩn hóa dữ liệu
      const conversations = adaptRoomsToConversations(rooms, currentUserId);
      // debug removed

      return {
        success: true,
        data: conversations,
      };
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return rejectWithValue(error.message || "Failed to fetch conversations");
    }
  }
);

const initialState = {
  conversations: [],
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    updateConversationLastMessage(state, action) {
      // Cập nhật cuộc trò chuyện sau khi tin nhắn được gửi hoặc nhận
      const { conversationId, message } = action.payload;
      
      const conversationIndex = state.conversations.findIndex(
        (conv) => conv._id === conversationId || conv._id === conversationId?.toString?.() || conv._id?.toString?.() === conversationId
      );

      if (conversationIndex !== -1) {
        const existingConversation = state.conversations[conversationIndex];
        
        // Tăng unreadCount nếu tin nhắn không phải từ user hiện tại
        const currentUserId = localStorage.getItem('currentUserId');
        
        // Ưu tiên sử dụng flag isFromCurrentUser nếu có
        let isFromCurrentUser = false;
        if (typeof message.isFromCurrentUser === 'boolean') {
          isFromCurrentUser = message.isFromCurrentUser;
        } else {
          // Extract senderId properly
          let extractedSenderId = null;
          if (typeof message.senderId === 'string') {
            extractedSenderId = message.senderId;
          } else if (typeof message.senderId === 'object' && message.senderId !== null) {
            extractedSenderId = message.senderId._id || message.senderId.id;
          } else if (message.sender) {
            if (typeof message.sender === 'string') {
              extractedSenderId = message.sender;
            } else {
              extractedSenderId = message.sender._id || message.sender.id;
            }
          }
          isFromCurrentUser = extractedSenderId && currentUserId && 
            String(extractedSenderId).trim() === String(currentUserId).trim();
        }
        
        const currentUnreadCount = typeof existingConversation.unreadCount === 'number' 
          ? existingConversation.unreadCount 
          : 0;
        const newUnreadCount = !isFromCurrentUser 
          ? currentUnreadCount + 1 
          : currentUnreadCount;

        // Cập nhật conversation tại chỗ với Immer
        state.conversations[conversationIndex].lastMessage = message;
        state.conversations[conversationIndex].updatedAt = new Date().toISOString();
        state.conversations[conversationIndex].unreadCount = newUnreadCount;

        // Di chuyển conversation lên đầu danh sách nếu cần
        if (conversationIndex > 0) {
          const updatedConversation = state.conversations[conversationIndex];
          state.conversations.splice(conversationIndex, 1);
          state.conversations.unshift(updatedConversation);
        }
      }
    },
    markConversationAsRead(state, action) {
      const { conversationId } = action.payload;
      const existingConversation = state.conversations.find(
        (conv) => conv._id === conversationId
      );

      if (existingConversation && existingConversation.unreadCount) {
        existingConversation.unreadCount = 0;

        if (existingConversation.lastMessage) {
          existingConversation.lastMessage.isRead = true;
        }
      }
    },
    removeConversation(state, action) {
      const { roomId } = action.payload;
      state.conversations = state.conversations.filter(
        (conv) => conv._id !== roomId
      );
    },
    addConversation(state, action) {
      const { conversation } = action.payload;
      // Kiểm tra xem conversation đã tồn tại chưa
      const existingIndex = state.conversations.findIndex(
        (conv) => conv._id === conversation._id
      );

      if (existingIndex >= 0) {
        // Cập nhật conversation hiện tại
        state.conversations[existingIndex] = conversation;
      } else {
        // Thêm conversation mới
        state.conversations.unshift(conversation);
      }

      // Sắp xếp lại theo thời gian cập nhật
      state.conversations.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
    },
    updateGroupName(state, action) {
      const { groupId, roomId, newName } = action.payload;
      // debug removed

      // Tìm conversation theo groupId hoặc roomId
      const conversation = state.conversations.find((conv) => {
        const convGroupId =
          conv.groupId?._id || conv.participant?.groupId || conv.groupId;
        const convRoomId = conv._id;
        return (
          (roomId && convRoomId === roomId) ||
          (groupId && convGroupId === groupId)
        );
      });

      // debug removed

      if (conversation) {
        // Cập nhật tên nhóm
        if (conversation.participant) {
          conversation.participant.fullName = newName;
        }
        
        // Check if groupId is an object before updating
        if (conversation.groupId && typeof conversation.groupId === 'object') {
          conversation.groupId.name = newName;
        } else if (conversation.groupId && typeof conversation.groupId === 'string') {
          // If groupId is a string, convert to object first
          conversation.groupId = {
            _id: conversation.groupId,
            name: newName
          };
        }

        // Cập nhật thời gian
        conversation.updatedAt = new Date().toISOString();

        // Sắp xếp lại theo thời gian cập nhật
        state.conversations.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        // debug removed
      } else {
        // debug removed
      }
    },
    updateGroupOwner(state, action) {
      const { roomId, newOwnerId } = action.payload;
      const conv = state.conversations.find((c) => c._id === roomId);
      if (conv) {
        conv.groupOwnerId = newOwnerId;
      }
    },
    removeMemberFromConversation(state, action) {
      const { roomId, userId } = action.payload;
      const conv = state.conversations.find((c) => c._id === roomId);
      if (conv && Array.isArray(conv.members)) {
        conv.members = conv.members.filter(
          (m) => (m._id || m.id) !== userId
        );
        conv.updatedAt = new Date().toISOString();
      }
    },
      markGroupDissolved(state, action) {
        const { roomId } = action.payload;
        const conv = state.conversations.find((c) => c._id === roomId);
        if (conv) {
          conv.isGroupDissolved = true;
          const groupRef = conv.groupId;
          if (groupRef && typeof groupRef === "object") {
            groupRef.isDissolved = true;
          } else if (typeof groupRef === "string") {
            // Normalize string groupId to object with isDissolved flag
            conv.groupId = { _id: groupRef, isDissolved: true };
          }
        }
      },
  },
  extraReducers: (builder) => {
    builder
      // fetchConversations
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload.data || [];
      });
  },
});

export const {
  updateConversationLastMessage,
  markConversationAsRead,
  removeConversation,
  addConversation,
  updateGroupName,
  updateGroupOwner,
  removeMemberFromConversation,
  markGroupDissolved,
} = conversationSlice.actions;

export default conversationSlice.reducer;
