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

  // Kiểm tra cấu trúc participant
  console.log('Normalizing participant:', participant);
  
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
  
  // Log dữ liệu raw để debug
  console.log('Raw room data:', room);
  
  // Tìm thông tin participant (người tham gia khác không phải user hiện tại)
  let participantData = null;
  
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
  
  // Chuẩn hóa participant
  const participant = normalizeParticipant(participantData);
  
  // Nếu vẫn không có participant, tạo một giá trị mặc định
  if (!participant) {
    console.warn('No participant found in room:', room._id || room.id);
    return null;
  }
  
  return {
    _id: room._id || room.id || 'unknown',
    participant: participant,
    lastMessage: room.lastMessage || null,
    unreadCount: room.unreadCount || 0,
    updatedAt: room.updatedAt || new Date().toISOString(),
    createdAt: room.createdAt || room.updatedAt || new Date().toISOString(),
  };
};

/**
 * Chuẩn hóa danh sách phòng từ API
 * @param {Array} rooms - Danh sách phòng từ API
 * @param {String} currentUserId - ID của người dùng hiện tại
 * @returns {Array} - Danh sách conversation đã được chuẩn hóa
 */
export const adaptRoomsToConversations = (rooms, currentUserId) => {
  if (!Array.isArray(rooms)) {
    console.error('Expected array of rooms, received:', rooms);
    return [];
  }
  
  return rooms
    .map(room => adaptRoomToConversation(room, currentUserId))
    .filter(conversation => conversation !== null);
}; 