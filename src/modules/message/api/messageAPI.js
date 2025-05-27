import { apiClient } from '../../../shared/httpClient';

/**
 * Get all conversations for the current user
 * @returns {Promise} Promise with conversations data
 */
export const getConversations = async () => {
  try {
    const response = await apiClient.get('/api/conversations');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get messages for a specific conversation
 * @param {string} conversationId - The ID of the conversation
 * @param {Object} params - Query parameters like page, limit
 * @returns {Promise} Promise with messages data
 */
export const getMessages = async (conversationId, params = {}) => {
  try {
    const response = await apiClient.get(`/api/conversations/${conversationId}/messages`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Send a new message in a conversation
 * @param {string} conversationId - The ID of the conversation
 * @param {Object} messageData - The message data (content, attachments, etc)
 * @returns {Promise} Promise with the created message
 */
export const sendMessage = async (conversationId, messageData) => {
  try {
    const response = await apiClient.post(`/api/conversations/${conversationId}/messages`, messageData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create a new conversation
 * @param {Object} conversationData - The conversation data (participants, title, etc)
 * @returns {Promise} Promise with the created conversation
 */
export const createConversation = async (conversationData) => {
  try {
    const response = await apiClient.post('/api/conversations', conversationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Mark messages as read
 * @param {string} conversationId - The ID of the conversation
 * @returns {Promise} Promise with the result
 */
export const markAsRead = async (conversationId) => {
  try {
    const response = await apiClient.put(`/api/conversations/${conversationId}/read`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}; 