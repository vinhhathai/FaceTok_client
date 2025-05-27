import { apiClient } from '../../../shared/httpClient';

/**
 * Get posts for the feed
 * @param {Object} params - Query parameters like page, limit
 * @returns {Promise} Promise with posts data
 */
export const getPosts = async (params = {}) => {
  try {
    const response = await apiClient.get('/api/posts', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get a single post by ID
 * @param {string} postId - The ID of the post
 * @returns {Promise} Promise with post data
 */
export const getPostById = async (postId) => {
  try {
    const response = await apiClient.get(`/api/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create a new post
 * @param {Object} postData - The post data (content, media, etc)
 * @returns {Promise} Promise with the created post
 */
export const createPost = async (postData) => {
  try {
    const response = await apiClient.post('/api/posts', postData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update an existing post
 * @param {string} postId - The ID of the post
 * @param {Object} postData - The updated post data
 * @returns {Promise} Promise with the updated post
 */
export const updatePost = async (postId, postData) => {
  try {
    const response = await apiClient.put(`/api/posts/${postId}`, postData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete a post
 * @param {string} postId - The ID of the post
 * @returns {Promise} Promise with the result
 */
export const deletePost = async (postId) => {
  try {
    const response = await apiClient.delete(`/api/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Like or unlike a post
 * @param {string} postId - The ID of the post
 * @returns {Promise} Promise with the updated like status
 */
export const toggleLike = async (postId) => {
  try {
    const response = await apiClient.post(`/api/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Add a comment to a post
 * @param {string} postId - The ID of the post
 * @param {Object} commentData - The comment data
 * @returns {Promise} Promise with the created comment
 */
export const addComment = async (postId, commentData) => {
  try {
    const response = await apiClient.post(`/api/posts/${postId}/comments`, commentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get comments for a post
 * @param {string} postId - The ID of the post
 * @param {Object} params - Query parameters like page, limit
 * @returns {Promise} Promise with comments data
 */
export const getComments = async (postId, params = {}) => {
  try {
    const response = await apiClient.get(`/api/posts/${postId}/comments`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}; 