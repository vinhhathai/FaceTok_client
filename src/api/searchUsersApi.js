import axios from 'axios';
import { BASE_URL } from '../config/config';
import getCookieToken from '../utils/getCookieToken';

/**
 * Tìm kiếm người dùng
 * @param {string} query - Từ khóa tìm kiếm
 * @param {number} page - Số trang (bắt đầu từ 1)
 * @param {number} limit - Số lượng kết quả mỗi trang
 * @returns {Promise} - Promise với kết quả tìm kiếm
 */
const searchUsersApi = async (query, page = 1, limit = 20) => {
  try {
    // Lấy token xác thực
    const token = getCookieToken();
    
    if (!token) {
      throw new Error('Cần đăng nhập lại để thực hiện chức năng này.');
    }

    console.log(`Searching users with query: "${query}", page: ${page}, limit: ${limit}`);
    
    // Gửi request GET
    const response = await axios.get(
      `${BASE_URL}/user/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Search users response:', response.data);
    
    // Kiểm tra và xử lý cấu trúc phản hồi
    if (response.data && response.data.data) {
      return response.data.data; // Trả về data từ cấu trúc mới
    }
    
    return response.data; // Trả về dữ liệu theo cấu trúc cũ
  } catch (error) {
    console.error('Search users API error:', error);
    
    if (error.response) {
      // Phản hồi có mã lỗi từ server
      console.error('Error response:', error.response.data);
      
      // Cấu trúc lỗi mới: error.response.data.error
      if (error.response.data.error) {
        throw new Error(error.response.data.error.message || 'Không thể tìm kiếm người dùng');
      } else {
        throw new Error(error.response.data.message || 'Không thể tìm kiếm người dùng');
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

export default searchUsersApi; 