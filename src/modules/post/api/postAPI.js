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
   * Cập nhật bài viết (hỗ trợ thêm/xóa media)
   * @param {string} postId
   * @param {Object} updateData - { content?, privacy? }
   * @param {Object} options - { mediaFiles?: File[], mediaRemove?: string[] }
   */
  updatePost: async (postId, updateData, options = {}) => {
    try {
      const hasFiles = Array.isArray(options.mediaFiles) && options.mediaFiles.length > 0;
      const hasRemovals = Array.isArray(options.mediaRemove) && options.mediaRemove.length > 0;

      if (!hasFiles && !hasRemovals) {
        // Simple JSON update
        const response = await apiClient.put(`${API_ENDPOINTS.UPDATE_POST}/${postId}`, updateData);
        return response.data;
      }

      // Multipart update to handle files/removals
      const formData = new FormData();
      if (typeof updateData?.content === 'string') formData.append('content', updateData.content);
      if (typeof updateData?.privacy === 'string') formData.append('privacy', updateData.privacy);

      if (hasRemovals) {
        // send as JSON string for server to parse
        formData.append('mediaRemove', JSON.stringify(options.mediaRemove));
      }

      if (hasFiles) {
        options.mediaFiles.forEach((file) => {
          formData.append('media', file);
        });
      }

      const response = await apiClient.put(`${API_ENDPOINTS.UPDATE_POST}/${postId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
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
   * Lấy danh sách bình luận của một bài viết
   */
  getComments: async (postId, params = { page: 1, limit: 50 }) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.COMMENT_POST}/${postId}/comments`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy danh sách replies của một comment
   */
  getReplies: async (commentId, params = { page: 1, limit: 20 }) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.COMMENT_POST}/comment/${commentId}/replies`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Xóa bình luận (chỉ chủ sở hữu)
   */
  deleteComment: async (commentId) => {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.COMMENT_POST}/comment/${commentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cập nhật nội dung bình luận (chỉ chủ comment)
   */
  updateComment: async (commentId, content) => {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.COMMENT_POST}/comment/${commentId}`, { content });
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
  },

  /**
   * Like/Unlike comment
   * @param {string} commentId - ID của comment
   * @returns {Promise} - Promise chứa kết quả
   */
  toggleCommentLike: async (commentId) => {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.COMMENT_POST}/comment/${commentId}/like/toggle`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default postAPI;
