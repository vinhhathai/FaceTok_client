import { apiClient } from '../../../shared/httpClient';
import { getCookie } from '../../../shared/utils/cookieUtils';

// Get token from cookie
const TOKEN_COOKIE_NAME = 'auth_token';
const getToken = () => getCookie(TOKEN_COOKIE_NAME) || '';

/**
 * Create or get private chat room between two users
 * @param {string} targetUserId - ID of the user to chat with
 * @returns {Promise} Promise resolving to the created/existing room
 */
export const createPrivateRoom = async (targetUserId) => {
  try {
    const response = await apiClient.post('/message/room/private/create', {
      targetUserId: targetUserId
    });
    return response.data;
  } catch (error) {
    console.error('Error creating private room:', error);
    throw error;
  }
};

/**
 * Get recent conversations for the current user
 * @returns {Promise} Promise resolving to array of conversations
 */
export const getRecentConversations = async () => {
  try {
    const response = await apiClient.get('/message/rooms');
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

/**
 * Get conversation with specific user
 * @param {string} userId - ID of the user to get conversation with
 * @returns {Promise} Promise resolving to conversation data
 */
export const getConversation = async (userId) => {
  try {
    const response = await apiClient.get(`/message/room/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
};

/**
 * Get count of unread messages
 * @returns {Promise} Promise resolving to count of unread messages
 */
export const getUnreadCount = async () => {
  try {
    const response = await apiClient.get('/message/unread/count');
    return response.data;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }
};

/**
 * Get messages for a specific conversation
 * @param {string} conversationId - ID of the conversation
 * @returns {Promise} Promise resolving to array of messages
 */
export const getMessages = async (roomId) => {
  try {
    // In the new API structure, messages are part of room details
    // so we use the room details endpoint
    const response = await apiClient.get(`/message/room/${roomId}`);
    
    // Return messages array if available in the response
    if (response.data && response.data.data && response.data.data.messages) {
      return response.data.data.messages;
    } else if (response.data && response.data.data && response.data.data.room) {
      // If the room has an array of messages, return those
      return response.data.data.room.messages || [];
    }
    
    // Return empty array if messages not available
    return [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

/**
 * Send a new message
 * @param {Object} messageData - Contains receiverId and message content
 * @returns {Promise} Promise resolving to the sent message
 */
export const sendMessage = async (messageData) => {
  try {
    const response = await apiClient.post('/message/messages', messageData);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Mark a message as read
 * @param {string} roomId - ID of the room to mark messages as read
 * @returns {Promise} Promise resolving to updated message
 */
export const markAsRead = async (roomId) => {
  try {
    const response = await apiClient.put(`/message/room/${roomId}/read`, {});
    return response.data;
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
}; 