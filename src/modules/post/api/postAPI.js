import { apiClient } from '@httpClient';

// API endpoints
const API_ENDPOINTS = {
  CREATE_POST: '/post',
  GET_POST: '/post',
  UPDATE_POST: '/post',
  DELETE_POST: '/post',
  LIKE_POST: '/post',
  COMMENT_POST: '/post',
  SHARE_POST: '/post'
};

const postAPI = {
  /**
   * Tạo bài viết mới
   * @param {Object} postData - Dữ liệu bài viết
   * @param {string} postData.content - Nội dung bài viết
   * @param {string} postData.privacy - Quyền riêng tư (public, friends, private)
   * @param {Array<File>} postData.mediaFiles - Danh sách file media
   * @param {function} onProgress - Callback để theo dõi tiến trình upload
   * @returns {Promise} - Promise chứa kết quả tạo bài viết
   */
  createPost: async (postData, onProgress) => {
    try {
      const formData = new FormData();
      formData.append('content', postData.content || '');
      formData.append('privacy', postData.privacy || 'public');
      
      // Append media files
      if (postData.mediaFiles && postData.mediaFiles.length > 0) {
        postData.mediaFiles.forEach(mediaItem => {
          formData.append('media', mediaItem.file);
        });
      }

      const response = await apiClient.post(
        API_ENDPOINTS.CREATE_POST,
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
      
      return response.data;
    } catch (error) {
      console.error('Create post error:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách bài viết timeline
   * @param {Object} params - Tham số phân trang
   * @returns {Promise} - Promise chứa danh sách bài viết
   */
  getTimelinePosts: async (params = { page: 1, limit: 10 }) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.GET_POST}/timeline`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy bài viết của một user cụ thể (cho profile)
   * @param {string} authorId - ID của tác giả
   * @param {Object} params - Tham số phân trang
   * @returns {Promise} - Promise chứa danh sách bài viết
   */
  getPostsByAuthor: async (authorId, params = { page: 1, limit: 10 }) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.GET_POST}/author/${authorId}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy bài viết theo ID
   * @param {string} postId - ID của bài viết
   * @returns {Promise} - Promise chứa thông tin bài viết
   */
  getPostById: async (postId) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.GET_POST}/${postId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cập nhật bài viết
   * @param {string} postId - ID của bài viết
   * @param {Object} updateData - Dữ liệu cập nhật
   * @returns {Promise} - Promise chứa kết quả cập nhật
   */
  updatePost: async (postId, updateData) => {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.UPDATE_POST}/${postId}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Xóa bài viết
   * @param {string} postId - ID của bài viết
   * @returns {Promise} - Promise chứa kết quả xóa
   */
  deletePost: async (postId) => {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.DELETE_POST}/${postId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Like/Unlike bài viết
   * @param {string} postId - ID của bài viết
   * @returns {Promise} - Promise chứa kết quả
   */
  toggleLike: async (postId) => {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.LIKE_POST}/${postId}/like/toggle`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Bình luận bài viết
   * @param {string} postId - ID của bài viết
   * @param {Object} commentData - Dữ liệu bình luận
   * @returns {Promise} - Promise chứa kết quả
   */
  createComment: async (postId, commentData) => {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.COMMENT_POST}/${postId}/comment`, commentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Chia sẻ bài viết
   * @param {string} postId - ID của bài viết
   * @returns {Promise} - Promise chứa kết quả
   */
  toggleShare: async (postId) => {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.SHARE_POST}/${postId}/share/toggle`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default postAPI;
