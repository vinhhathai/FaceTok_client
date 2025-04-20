import axios from 'axios';
import { BASE_URL } from '../config/config';
import getCookieToken from '../utils/getCookieToken';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';
import { store } from '../redux/store';
import { updateUserAvatar } from '../redux/features/userSlice';

/**
 * Upload a new avatar image directly to Cloudinary and update profile in the database
 * @param {File} file - The image file to upload
 * @param {Function} progressCallback - Optional callback for progress updates
 * @returns {Promise} - Promise with the response data
 */
const updateAvatarApi = async (file, progressCallback = null) => {
  try {
    // Get auth token
    const token = getCookieToken();
    
    // Debug - log token (safe version)
    console.log('Token exists:', !!token);
    if (token) {
      console.log('Token preview:', token.substring(0, 15) + '...');
    }

    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    // Debug - log file details
    console.log('Processing file for upload:', {
      name: file.name,
      type: file.type,
      size: file.size
    });
    
    // Tạo URL tạm thời và cập nhật UI ngay lập tức - URL này chỉ hiển thị và không lưu vào localStorage
    const tempURL = URL.createObjectURL(file);
    store.dispatch(updateUserAvatar(tempURL));

    // 1. Upload file directly to Cloudinary from client
    const cloudinaryUrl = await uploadToCloudinary(file, progressCallback);
    console.log('File uploaded to Cloudinary:', cloudinaryUrl);

    // 2. Send the Cloudinary URL to our server API to update user profile
    console.log('Sending URL to server API:', `${BASE_URL}/user/update-avatar-url`);
    
    const response = await axios.put(
      `${BASE_URL}/user/update-avatar-url`,
      { avatarUrl: cloudinaryUrl },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    // 3. Cập nhật avatar trong Redux store với URL chính thức từ Cloudinary
    // URL này sẽ được tự động lưu vào localStorage trong reducer
    store.dispatch(updateUserAvatar(cloudinaryUrl));

    // 4. Giải phóng URL tạm thời
    URL.revokeObjectURL(tempURL);

    console.log('Server response:', response.data);
    
    // Kiểm tra và xử lý cấu trúc phản hồi mới
    let responseData = response.data;
    if (response.data && response.data.data) {
      responseData = response.data.data;
    }
    
    return {
      ...responseData,
      avatarUrl: cloudinaryUrl
    };
  } catch (error) {
    console.error('Avatar upload API error:', error);
    
    // Nếu có lỗi, khôi phục lại avatar từ localStorage
    const savedAvatar = localStorage.getItem('userProfilePicture');
    if (savedAvatar) {
      store.dispatch(updateUserAvatar(savedAvatar));
    }
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response:', error.response.data);
      
      // Cấu trúc lỗi mới: error.response.data.error
      if (error.response.data.error) {
        throw new Error(error.response.data.error.message || 'Failed to update avatar');
      } else {
        throw new Error(error.response.data.message || 'Failed to update avatar');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response from server');
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw error;
    }
  }
};

export default updateAvatarApi; 