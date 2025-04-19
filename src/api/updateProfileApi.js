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
    
    // Gửi request PUT để cập nhật thông tin - đã bỏ ID khỏi URL
    const response = await axios.put(
      `${BASE_URL}/user/update-profile`,
      profileData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Update profile response:', response.data);
    
    // Kiểm tra và xử lý cấu trúc phản hồi mới
    if (response.data && response.data.data) {
      return response.data.data; // Trả về data từ cấu trúc mới
    }
    
    return response.data; // Trả về dữ liệu theo cấu trúc cũ
  } catch (error) {
    console.error('Update profile API error:', error);
    
    if (error.response) {
      // Phản hồi có mã lỗi từ server
      console.error('Error response:', error.response.data);
      
      // Cấu trúc lỗi mới: error.response.data.error
      if (error.response.data.error) {
        throw new Error(error.response.data.error.message || 'Không thể cập nhật thông tin cá nhân');
      } else {
        throw new Error(error.response.data.message || 'Không thể cập nhật thông tin cá nhân');
      }
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