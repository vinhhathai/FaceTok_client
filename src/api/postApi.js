import axios from 'axios';
import { BASE_URL } from '../config/config';
import getCookieToken from '../utils/getCookieToken';

/**
 * Hàm tạo bài viết mới
 * @param {Object} postData - Dữ liệu bài viết (content, mediaFiles)
 * @returns {Promise} Promise với dữ liệu phản hồi
 */
export const createPost = async (postData) => {
  try {
    const token = getCookieToken();
    
    if (!token) {
      throw new Error('Bạn cần đăng nhập để thực hiện chức năng này.');
    }

    // Không cần kiểm tra userId nữa vì server sẽ lấy từ token
    // const userId = localStorage.getItem('userId');
    // if (!userId) {
    //   throw new Error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
    // }

    // Tạo form data nếu có file đính kèm
    let formData = null;
    if (postData.mediaFiles && postData.mediaFiles.length > 0) {
      // Kiểm tra chỉ cho phép file ảnh
      const file = postData.mediaFiles[0];
      if (!file.type.match('image.*')) {
        throw new Error('Chỉ hỗ trợ upload ảnh, không hỗ trợ video.');
      }
      
      formData = new FormData();
      // Map content thành caption để phù hợp với API backend
      formData.append('caption', postData.content || '');
      // Không cần gửi userId vì server lấy từ token
      
      // Đính kèm file ảnh
      formData.append('file', file);
      
      const response = await axios.post(
        `${BASE_URL}/post/create`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      return response;
    } else {
      // Gửi request JSON thông thường nếu không có file
      const response = await axios.post(
        `${BASE_URL}/post/create`,
        { 
          caption: postData.content || ''
          // Không cần gửi userId vì server lấy từ token
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      return response;
    }
  } catch (error) {
    console.error('Post API error:', error);
    
    if (error.response) {
      // Phản hồi có mã lỗi từ server
      const errorMsg = error.response.data.error?.name || 
                      error.response.data.error?.message ||
                      error.response.data.message || 
                      'Không thể tạo bài viết';
      throw new Error(errorMsg);
    } else if (error.request) {
      // Request được gửi nhưng không nhận được phản hồi
      throw new Error('Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối.');
    } else {
      // Lỗi trong quá trình thiết lập request
      throw error;
    }
  }
};

/**
 * Lấy danh sách bài viết trên timeline
 * @param {Number} page - Số trang
 * @param {Number} limit - Số lượng bài viết mỗi trang
 * @returns {Promise} Promise với dữ liệu phản hồi
 */
export const getTimelinePosts = async (page = 1, limit = 10) => {
  try {
    const token = getCookieToken();
    
    if (!token) {
      throw new Error('Bạn cần đăng nhập để xem bài viết.');
    }
    
    const response = await axios.get(
      `${BASE_URL}/post?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response;
  } catch (error) {
    console.error('Get timeline posts error:', error);
    
    if (error.response) {
      const errorMsg = error.response.data.error?.name || 
                      error.response.data.error?.message ||
                      error.response.data.message || 
                      'Không thể tải bài viết';
      throw new Error(errorMsg);
    } else if (error.request) {
      throw new Error('Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối.');
    } else {
      throw error;
    }
  }
};

/**
 * Lấy bài viết của người dùng cụ thể
 * @param {String} userId - ID của người dùng cần lấy bài viết
 * @param {Number} page - Số trang
 * @param {Number} limit - Số lượng bài viết mỗi trang
 * @returns {Promise} Promise với dữ liệu phản hồi
 */
export const getUserPosts = async (userId, page = 1, limit = 10) => {
  try {
    const token = getCookieToken();
    
    if (!token) {
      throw new Error('Bạn cần đăng nhập để xem bài viết.');
    }
    
    if (!userId) {
      throw new Error('Không tìm thấy ID người dùng');
    }
    
    const response = await axios.get(
      `${BASE_URL}/post/user/${userId}?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response;
  } catch (error) {
    console.error('Get user posts error:', error);
    
    if (error.response) {
      const errorMsg = error.response.data.error?.name || 
                      error.response.data.error?.message ||
                      error.response.data.message || 
                      'Không thể tải bài viết';
      throw new Error(errorMsg);
    } else if (error.request) {
      throw new Error('Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối.');
    } else {
      throw error;
    }
  }
}; 