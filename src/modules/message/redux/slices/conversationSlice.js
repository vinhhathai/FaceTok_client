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
      const existingConversation = state.conversations.find(
        (conv) => conv._id === conversationId
      );

      if (existingConversation) {
        existingConversation.lastMessage = message;
        existingConversation.updatedAt = new Date().toISOString();

        // Sắp xếp lại cuộc trò chuyện theo thời gian cập nhật
        state.conversations.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
      } else {
        // debug removed
        // Nếu conversation không tồn tại, có thể đã bị xóa trước đó
        // Sẽ được refresh từ API khi có tin nhắn mới
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
        // debug removed
        // Cập nhật tên nhóm
        if (conversation.participant) {
          conversation.participant.fullName = newName;
        }
        if (conversation.groupId) {
          conversation.groupId.name = newName;
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
} = conversationSlice.actions;

export default conversationSlice.reducer;
