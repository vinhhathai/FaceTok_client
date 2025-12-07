import { apiClient } from '@httpClient';

/**
 * Get the current user's friends list
 * @returns {Promise} Promise with friends data
 */
export const getFriends = async () => {
  try {
    const response = await apiClient.get('/friend/my-friends');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get received friend requests
 * @returns {Promise} Promise with friend requests data
 */
export const getReceivedFriendRequests = async () => {
  try {
    const response = await apiClient.get('/friend/received-requests');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get sent/pending friend requests
 * @returns {Promise} Promise with sent friend requests data
 */
export const getSentFriendRequests = async () => {
  try {
    const response = await apiClient.get('/friend/pending-requests');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Check relationship status with another user
 * @param {string} targetUserId - ID of the user to check relationship with
 * @returns {Promise} Promise with relationship status information
 */
export const checkRelationship = async (targetUserId) => {
  try {
    const response = await apiClient.get(`/friend/relationship/${targetUserId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Search for friends
 * @param {string} query - Search query
 * @param {number} page - Page number (optional, default: 1)
 * @param {number} limit - Items per page (optional, default: 10)
 * @returns {Promise} Promise with search results
 */
export const searchFriends = async (query, page = 1, limit = 10) => {
  try {
    const response = await apiClient.get(`/friend/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Search for users (system-wide)
 * @param {string} query - Search query
 * @param {number} page - Page number (optional, default: 1)
 * @param {number} limit - Items per page (optional, default: 10)
 * @returns {Promise} Promise with search results
 */
export const searchUsers = async (query, page = 1, limit = 10) => {
  try {
    const response = await apiClient.get(`/user/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Send a friend request to another user
 * @param {string} recipientId - The ID of the user to send request to
 * @returns {Promise} Promise with request result
 */
export const sendFriendRequest = async (recipientId) => {
  try {
    const response = await apiClient.post('/friend/send-request', { recipientId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Cancel a sent friend request
 * @param {string} requestId - The ID of the friend request to cancel
 * @returns {Promise} Promise with cancel result
 */
export const cancelFriendRequest = async (requestId) => {
  try {
    const response = await apiClient.delete('/friend/cancel-request', { 
      data: { requestId } 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Accept a friend request
 * @param {string} requestId - The ID of the friend request
 * @returns {Promise} Promise with accept result
 */
export const acceptFriendRequest = async (requestId) => {
  try {
    const response = await apiClient.post('/friend/accept-request', { requestId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Reject a friend request
 * @param {string} requestId - The ID of the friend request
 * @returns {Promise} Promise with reject result
 */
export const rejectFriendRequest = async (requestId) => {
  try {
    const response = await apiClient.post('/friend/reject-request', { requestId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Remove a friend
 * @param {string} friendId - The ID of the friend to remove
 * @returns {Promise} Promise with remove result
 */
export const removeFriend = async (friendId) => {
  try {
    const response = await apiClient.post('/friend/unfriend', { friendId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}; 