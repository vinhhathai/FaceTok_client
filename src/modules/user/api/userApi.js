import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const userApi = {
  /**
   * Lấy thông tin profile người dùng
   * @param {string} userId - ID của người dùng
   * @returns {Promise} - Promise chứa dữ liệu người dùng
   */
  getUserProfile: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cập nhật thông tin profile người dùng
   * @param {object} userData - Dữ liệu cần cập nhật
   * @returns {Promise} - Promise chứa dữ liệu người dùng đã được cập nhật
   */
  updateUserProfile: async (userData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${userData.id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy danh sách bài viết của người dùng
   * @param {string} userId - ID của người dùng
   * @param {object} params - Tham số phân trang và lọc
   * @returns {Promise} - Promise chứa danh sách bài viết
   */
  getUserPosts: async (userId, params = { page: 1, limit: 10 }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/posts`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy danh sách bạn bè của người dùng
   * @param {string} userId - ID của người dùng
   * @param {object} params - Tham số phân trang
   * @returns {Promise} - Promise chứa danh sách bạn bè
   */
  getUserFriends: async (userId, params = { page: 1, limit: 20 }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/friends`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Gửi lời mời kết bạn
   * @param {string} userId - ID của người dùng được mời
   * @returns {Promise} - Promise chứa kết quả
   */
  sendFriendRequest: async (userId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/friends/requests`, { userId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Trả lời lời mời kết bạn
   * @param {string} requestId - ID của lời mời
   * @param {string} status - Trạng thái ('accepted', 'rejected')
   * @returns {Promise} - Promise chứa kết quả
   */
  respondToFriendRequest: async (requestId, status) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/friends/requests/${requestId}`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default userApi; 