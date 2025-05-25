import axios from 'axios';
import { ERROR_CODES } from '../../common/constants';
import { logError, createError, handleApiError } from '../utils/errorUtils';
import { getCookie, removeCookie } from '../utils/cookieUtils';

// Cookie name constant
const TOKEN_COOKIE_NAME = 'accessToken';

// Tạo instance của axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json',
  },
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
    logError(error, 'API Request');
    return Promise.reject(
      createError(ERROR_CODES.API.BAD_REQUEST, 'Lỗi khi gửi yêu cầu')
    );
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
    
    // Xử lý lỗi API một cách đơn giản
    const appError = handleApiError(error);
    return Promise.reject(appError);
  }
);

export default apiClient; 