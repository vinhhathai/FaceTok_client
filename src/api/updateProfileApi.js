import axios from 'axios';
import { BASE_URL } from '../config/config';
import getCookieToken from '../utils/getCookieToken';

/**
 * Cập nhật thông tin cá nhân của người dùng
 * @param {Object} profileData - Thông tin cá nhân sẽ cập nhật
 * @returns {Promise} - Promise với dữ liệu phản hồi
 */
const updateProfileApi = async (profileData) => {
  try {
    // Lấy token xác thực
    const token = getCookieToken();
    
    if (!token) {
      throw new Error('Cần đăng nhập lại để thực hiện chức năng này.');
    }

    console.log('Sending update profile request with data:', profileData);
    
    // Gửi request PUT để cập nhật thông tin
    const response = await axios.put(
      `${BASE_URL}/user/update-profile/${profileData.id}`,
      profileData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Update profile response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update profile API error:', error);
    
    if (error.response) {
      // Phản hồi có mã lỗi từ server
      console.error('Error response:', error.response.data);
      const errorMsg = error.response.data.error?.name || 
                      error.response.data.error?.message ||
                      error.response.data.message || 
                      'Không thể cập nhật thông tin cá nhân';
      throw new Error(errorMsg);
    } else if (error.request) {
      // Request được gửi nhưng không nhận được phản hồi
      console.error('No response from server');
      throw new Error('Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối.');
    } else {
      // Lỗi trong quá trình thiết lập request
      throw error;
    }
  }
};

export default updateProfileApi; 