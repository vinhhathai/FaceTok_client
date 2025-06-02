import { apiClient } from '../../../shared/httpClient';

// Get token from local storage
const getToken = () => localStorage.getItem('token') || '';

/**
 * Get recent conversations for the current user
 * @returns {Promise} Promise resolving to array of conversations
 */
export const getRecentConversations = async () => {
  try {
    const response = await apiClient.get('/message/conversations');
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
    const response = await apiClient.get(`/message/conversation/${userId}`);
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
export const getMessages = async (conversationId) => {
  try {
    const response = await apiClient.get(`/message/messages/${conversationId}`);
    return response.data;
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
 * @param {string} messageId - ID of the message to mark as read
 * @returns {Promise} Promise resolving to updated message
 */
export const markAsRead = async (messageId) => {
  try {
    const response = await apiClient.put(`/message/read/${messageId}`, {});
    return response.data;
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
}; 