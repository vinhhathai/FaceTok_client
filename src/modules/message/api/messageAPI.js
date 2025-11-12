import { apiClient } from "@httpClient";

// Token is handled by apiClient interceptors

/**
 * Tạo nhóm chat mới
 * @param {string} name - Tên nhóm
 * @param {Array} members - Danh sách ID thành viên
 * @returns {Promise} Promise trả về thông tin nhóm đã tạo
 */
export const createGroup = async (name, members) => {
  try {
    const response = await apiClient.post("/message/group", {
      name,
      members,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating group:", error);
    throw error;
  }
};

/**
 * Đổi tên nhóm chat
 * @param {string} groupId - ID của nhóm
 * @param {string} name - Tên mới của nhóm
 * @returns {Promise} Promise trả về thông tin nhóm đã cập nhật
 */
export const renameGroup = async (groupId, name) => {
  try {
    const response = await apiClient.put("/message/group/rename", {
      id: groupId,
      name,
    });
    return response.data;
  } catch (error) {
    console.error("Error renaming group:", error);
    throw error;
  }
};

/**
 * Lấy hoặc tạo phòng chat giữa hai người dùng
 * @param {string} targetUserId - ID của người dùng muốn chat cùng
 * @returns {Promise} Promise trả về thông tin phòng chat
 */
export const getOrCreateRoom = async (targetUserId) => {
  try {
    const response = await apiClient.post("/message/room/get-or-create", {
      targetUserId: targetUserId,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting or creating room:", error);
    throw error;
  }
};

/**
 * Lấy danh sách phòng chat của người dùng hiện tại
 * @returns {Promise} Promise trả về mảng các phòng chat
 */
export const getUserRooms = async () => {
  try {
    const response = await apiClient.get("/message/rooms");
    return response.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};

/**
 * Lấy thông tin chi tiết phòng chat
 * @param {string} roomId - ID của phòng chat
 * @returns {Promise} Promise trả về thông tin phòng chat
 */
export const getRoomById = async (roomId) => {
  try {
    const response = await apiClient.get(`/message/room/${roomId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching room:", error);
    throw error;
  }
};

/**
 * Lấy tin nhắn trong phòng chat
 * @param {string} roomId - ID của phòng chat
 * @param {number} limit - Số lượng tin nhắn tối đa
 * @param {number} skip - Số tin nhắn bỏ qua (phân trang)
 * @returns {Promise} Promise trả về mảng tin nhắn
 */
export const getMessages = async (roomId, limit = 20, skip = 0) => {
  try {
    const response = await apiClient.get(`/message/room/${roomId}/messages`, {
      params: { limit, skip },
    });

    if (response.data && response.data.data && response.data.data.messages) {
      return response.data.data.messages;
    }

    return [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

/**
 * Gửi tin nhắn vào phòng chat
 * @param {string} roomId - ID của phòng chat
 * @param {string} content - Nội dung tin nhắn
 * @returns {Promise} Promise trả về thông tin tin nhắn đã gửi
 */
export const sendMessageToRoom = async (roomId, content, isFormData = false) => {
  try {
    const config = isFormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    } : {};
    
    const payload = isFormData ? content : { content };
    
    const response = await apiClient.post(`/message/room/${roomId}/message`, payload, config);
    return response.data;
  } catch (error) {
    console.error("Error sending message to room:", error);
    throw error;
  }
};

export const deleteConversation = async (roomId) => {
  try {
    const response = await apiClient.delete(`/message/room/${roomId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting conversation:", error);
    throw error;
  }
};

/**
 * Mời người dùng vào nhóm
 * @param {string} roomId - ID của phòng (nhóm)
 * @param {string} userId - ID của người dùng cần mời
 * @returns {Promise}
 */
export const inviteToGroup = async (roomId, userId) => {
  try {
    const response = await apiClient.post("/message/group/invite", {
      roomId,
      userId,
    });
    return response.data;
  } catch (error) {
    console.error("Error inviting user to group:", error);
    throw error;
  }
};

/**
 * Cập nhật ảnh đại diện nhóm qua REST (multipart upload)
 * @param {string} roomId
 * @param {File} file
 */
export const updateGroupAvatar = async (roomId, file) => {
  try {
    const form = new FormData();
    form.append("id", roomId);
    form.append("avatar", file);
    const response = await apiClient.post(
      "/message/group/update-avatar",
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating group avatar:", error);
    throw error;
  }
};
