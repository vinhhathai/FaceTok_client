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
 * Get messages for a specific conversation
 * @param {string} roomId - ID of the room
 * @returns {Promise} Promise resolving to array of messages
 */
export const getMessages = async (roomId) => {
  try {
    // Check if roomId is a MongoDB ObjectId (24 hex chars)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(roomId);
    
    // Use the appropriate endpoint based on ID format
    const endpoint = isValidObjectId 
      ? `/message/room/id/${roomId}` // New endpoint for valid MongoDB ObjectId
      : `/message/room/${roomId}`;    // Old endpoint for other formats (for backward compatibility)
    
    const response = await apiClient.get(endpoint);
    
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