import { apiClient } from '../../../shared/httpClient';

/**
 * Get the current user's friends list
 * @returns {Promise} Promise with friends data
 */
export const getFriends = async () => {
  try {
    const response = await apiClient.get('/api/friends');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get pending friend requests
 * @returns {Promise} Promise with friend requests data
 */
export const getFriendRequests = async () => {
  try {
    const response = await apiClient.get('/api/friends/requests');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Send a friend request to another user
 * @param {string} userId - The ID of the user to send request to
 * @returns {Promise} Promise with request result
 */
export const sendFriendRequest = async (userId) => {
  try {
    const response = await apiClient.post('/api/friends/requests', { userId });
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
    const response = await apiClient.put(`/api/friends/requests/${requestId}/accept`);
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
    const response = await apiClient.put(`/api/friends/requests/${requestId}/reject`);
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
    const response = await apiClient.delete(`/api/friends/${friendId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}; 