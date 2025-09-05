import axios from 'axios';
import { ERROR_CODES } from '@common/constants';
import { getCookie, removeCookie } from '@utils/cookieUtils';

// Cookie name constant
const TOKEN_COOKIE_NAME = 'auth_token';

// Tạo instance của axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000, // 10 giây timeout
});


// Thêm interceptor để xử lý request
apiClient.interceptors.request.use(
  (config) => {
    // Lấy token từ cookie thay vì localStorage
    const token = getCookie(TOKEN_COOKIE_NAME);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Xử lý lỗi request đơn giản hơn
    console.error('[API Request]', error);
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý response
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý lỗi xác thực
    if (error.response && error.response.status === 401) {
      // Xử lý khi token hết hạn - xóa token từ cookie
      removeCookie(TOKEN_COOKIE_NAME);
      
      // Dispatch an event that can be listened to by auth components
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    
    // Ghi log lỗi
    console.error('[API Response]', error);
    
    return Promise.reject(error);
  }
);

export default apiClient; 