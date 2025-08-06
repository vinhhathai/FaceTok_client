import { apiClient } from '@httpClient';

// API endpoints
const API_ENDPOINTS = {
  PROFILE: '/user/profile',
  UPLOAD_THUMBNAIL: '/user/upload-thumbnail',
  UPLOAD_AVATAR: '/user/upload-avatar',
  UPDATE_FULLNAME: '/user/update-fullname',
  SEARCH: '/user/search',
  BLOCK_USER: '/user/block-user',
  UNBLOCK_USER: '/user/unblock-user',
  GET_BLOCKED_USERS: '/user/blocked-users'
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
  },

  /**
   * Update user's fullname
   * @param {string} fullName - New fullname for the user
   * @returns {Promise} - Promise containing the result of the update
   */
  updateFullname: async (fullName) => {
    try {
      // Send the fullName in the correct format expected by the API
      const response = await apiClient.put(API_ENDPOINTS.UPDATE_FULLNAME, { fullName });
      
      console.log('Fullname update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Fullname update error:', error);
      
      // Nếu có response từ server
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        
        // Trường hợp lỗi thời gian chờ
        if (errorData.error && errorData.error.code === 'USER_NAME_UPDATE_TIME_LIMIT') {
          // Lấy thời gian còn lại từ detail (không phải details)
          const timeRemaining = errorData.error.detail?.timeRemaining;
          
          throw {
            message: errorData.error.message || 'You need to wait more minutes to update your name',
            status: error.response.status || 400,
            code: errorData.error.code,
            timeRemaining: timeRemaining
          };
        }
        
        // Các lỗi khác từ server
        throw {
          message: errorData.error?.message || errorData.message || 'Failed to update fullname',
          status: error.response.status || 500,
          code: errorData.error?.code
        };
      }
      
      // Lỗi không có response từ server
      throw {
        message: error.message || 'Failed to update fullname',
        status: 500
      };
    }
  },

  /**
   * Search for users by keyword
   * @param {string} query - Search keyword
   * @param {object} params - Pagination parameters
   * @returns {Promise} - Promise containing search results
   */
  searchUsers: async (query, params = { page: 1, limit: 10 }) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SEARCH, { 
        params: { 
          query,
          page: params.page, 
          limit: params.limit 
        } 
      });
      return response.data;
    } catch (error) {
      console.error('Search API error:', error);
      throw error;
    }
  },

  /**
   * Block a user
   * @param {string} blockedUserId - ID of the user to block
   * @returns {Promise} - Promise containing the result
   */
  blockUser: async (blockedUserId) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.BLOCK_USER, { blockedUserId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Unblock a user
   * @param {string} blockedUserId - ID of the user to unblock
   * @returns {Promise} - Promise containing the result
   */
  unblockUser: async (blockedUserId) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.UNBLOCK_USER, { blockedUserId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get blocked users for the current user
   * @returns {Promise} - Promise containing the list of blocked users
   */
  getBlockedUsers: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_BLOCKED_USERS);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default userApi; 