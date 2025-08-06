/**
 * Adapter để chuẩn hóa cấu trúc dữ liệu conversation từ API
 * Giải quyết vấn đề khi API trả về cấu trúc khác với mong đợi
 */

/**
 * Chuẩn hóa participant từ API
 * @param {Object} participant - Dữ liệu participant từ API
 * @returns {Object} - Participant đã được chuẩn hóa
 */
const normalizeParticipant = (participant) => {
  if (!participant) return null;


  
  return {
    _id: participant._id || participant.id || 'unknown', // Xử lý cả id và _id
    fullName: participant.fullName || participant.fullname || participant.name || 'Unknown User',
    avatar: participant.avatar || participant.avatarUrl || null,
    online: participant.online || false
  };
};

/**
 * Chuyển đổi phòng từ API thành định dạng conversation chuẩn
 * @param {Object} room - Dữ liệu phòng từ API
 * @param {String} currentUserId - ID của người dùng hiện tại
 * @returns {Object} - Conversation đã được chuẩn hóa
 */
export const adaptRoomToConversation = (room, currentUserId) => {
  if (!room) return null;
  

  
  // Kiểm tra xem có phải group không - dựa vào groupId
  const isGroup = !!room.groupId;
  
  let participantData = null;
  
  if (isGroup) {
    // Xử lý group conversation - Sử dụng group info từ groupId
    participantData = {
      _id: room._id || room.id,
      fullName: room.groupId?.name || 'Group Chat', // Lấy tên từ group
      avatar: room.groupId?.avatar || null, // Lấy avatar từ group
      isGroup: true,
      members: room.members || [],
      groupOwnerId: room.groupId?.ownerId || null // Thêm owner info
    };
  } else {
    // Xử lý direct conversation (1-1)
    if (room.members && Array.isArray(room.members)) {
      // Lọc member không phải user hiện tại
      const otherMembers = room.members.filter(
        member => (member._id || member.id) !== currentUserId
      );
      
      if (otherMembers.length > 0) {
        participantData = otherMembers[0];
      }
    }
    
    // Nếu không tìm thấy participant từ members, sử dụng trường participant nếu có
    if (!participantData && room.participant) {
      participantData = room.participant;
    }
  }
  
  // Chuẩn hóa participant
  const participant = normalizeParticipant(participantData);
  
  // Nếu vẫn không có participant, tạo một giá trị mặc định
  if (!participant) {
    return null;
  }
  
  const conversation = {
    _id: room._id || room.id || 'unknown',
    participant: participant,
    members: room.members || [], // Thêm members vào conversation object
    lastMessage: room.lastMessage || null,
    unreadCount: room.unreadCount || 0,
    updatedAt: room.updatedAt || new Date().toISOString(),
    createdAt: room.createdAt || room.updatedAt || new Date().toISOString(),
    isGroup: isGroup
  };
  

  
  return conversation;
};

/**
 * Chuẩn hóa danh sách phòng từ API
 * @param {Array} rooms - Danh sách phòng từ API
 * @param {String} currentUserId - ID của người dùng hiện tại
 * @returns {Array} - Danh sách conversation đã được chuẩn hóa
 */
export const adaptRoomsToConversations = (rooms, currentUserId) => {
  if (!Array.isArray(rooms)) {
    return [];
  }
  
  return rooms
    .map(room => adaptRoomToConversation(room, currentUserId))
    .filter(conversation => conversation !== null);
}; 