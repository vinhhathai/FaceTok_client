import { apiClient } from '../../../shared/httpClient';

// API endpoints
const API_ENDPOINTS = {
  PROFILE: '/user/profile',
  UPLOAD_THUMBNAIL: '/user/upload-thumbnail',
  UPLOAD_AVATAR: '/user/upload-avatar'
};

const userApi = {
  /**
   * Lấy thông tin profile người dùng
   * @param {string} userId - ID của người dùng
   * @returns {Promise} - Promise chứa dữ liệu người dùng
   */
  getUserProfile: async (userId) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PROFILE}/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Upload ảnh bìa (thumbnail) cho người dùng
   * @param {File} file - File ảnh cần upload
   * @param {function} onProgress - Callback để theo dõi tiến trình upload
   * @returns {Promise} - Promise chứa kết quả upload
   */
  uploadThumbnail: async (file, onProgress) => {
    try {
      const formData = new FormData();
      formData.append('coverPhoto', file);
      
      const response = await apiClient.post(
        API_ENDPOINTS.UPLOAD_THUMBNAIL,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onProgress(percentCompleted);
            }
          }
        }
      );
      
      console.log('Thumbnail upload response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      throw error;
    }
  },

  /**
   * Upload ảnh đại diện (avatar) cho người dùng
   * @param {File} file - File ảnh cần upload
   * @param {function} onProgress - Callback để theo dõi tiến trình upload
   * @returns {Promise} - Promise chứa kết quả upload
   */
  uploadAvatar: async (file, onProgress) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await apiClient.post(
        API_ENDPOINTS.UPLOAD_AVATAR,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onProgress(percentCompleted);
            }
          }
        }
      );
      
      console.log('Avatar upload response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Avatar upload error:', error);
      throw error;
    }
  },

  /**
   * Update user profile information
   * @param {object} userData - User data to be updated
   * @returns {Promise} - Promise containing updated user data
   */
  updateUserProfile: async (userData) => {
    try {
      const response = await apiClient.put('/user/update-profile', userData);
      
      // Log successful response for debugging
      console.log('Profile update response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      
      // Enhanced error handling with more details
      const errorMessage = 
        error.response?.data?.error?.message || 
        error.response?.data?.message ||
        error.message ||
        'Failed to update profile information';
        
      throw { 
        message: errorMessage,
        status: error.response?.status || 500,
        details: error.response?.data?.error?.details || null
      };
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
      const response = await apiClient.get(`/users/${userId}/posts`, { params });
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
      const response = await apiClient.get(`/users/${userId}/friends`, { params });
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
      const response = await apiClient.post(`/friends/requests`, { userId });
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
      const response = await apiClient.put(`/friends/requests/${requestId}`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default userApi; 