import axios from 'axios';
import { BASE_URL } from '../config/config';
import getCookieToken from '../utils/getCookieToken';

/**
 * Cập nhật tên người dùng (giới hạn 60 phút/lần)
 * @param {string} fullName - Tên mới của người dùng
 * @returns {Promise} - Promise với dữ liệu phản hồi
 */
const updateFullNameApi = async (fullName) => {
  try {
    // Lấy token xác thực
    const token = getCookieToken();
    
    if (!token) {
      throw new Error('Cần đăng nhập lại để thực hiện chức năng này.');
    }

    console.log('Sending update fullname request with data:', { fullName });
    
    // Gửi request PUT để cập nhật tên
    const response = await axios.put(
      `${BASE_URL}/user/update-fullname`,
      { fullName },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Update fullname response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update fullname API error:', error);
    
    if (error.response) {
      // Phản hồi có mã lỗi từ server
      console.error('Error response:', error.response.data);
      
      // Xử lý trường hợp đặc biệt khi có timeRemaining
      if (error.response.data.error?.timeRemaining) {
        throw {
          message: error.response.data.error.name,
          timeRemaining: error.response.data.error.timeRemaining
        };
      }
      
      const errorMsg = error.response.data.error?.name || 
                      error.response.data.error?.message ||
                      error.response.data.message || 
                      'Không thể cập nhật tên';
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

export default updateFullNameApi; 