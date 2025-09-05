import { apiClient } from '@httpClient';

/**
 * Get all notifications for the current user
 * @param {Object} params - Query parameters like page, limit
 * @returns {Promise} Promise with notifications data
 */
export const getNotifications = async (params = {}) => {
  try {
    const response = await apiClient.get('/notification/notifications', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Mark a notification as read
 * @param {string} notificationId - The ID of the notification
 * @returns {Promise} Promise with the updated notification
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await apiClient.put(`/notification/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Mark all notifications as read
 * @returns {Promise} Promise with the result
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await apiClient.put('/notification/read-all');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete a notification
 * @param {string} notificationId - The ID of the notification
 * @returns {Promise} Promise with the result
 */
export const deleteNotification = async (notificationId) => {
  try {
    const response = await apiClient.delete(`/api/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get unread notification count
 * @returns {Promise} Promise with the count
 */
export const getUnreadCount = async () => {
  try {
    const response = await apiClient.get('/api/notifications/unread-count');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}; 