import axios from 'axios';
import Cookies from 'js-cookie';

// Đặt URL cơ sở cho tất cả các yêu cầu
axios.defaults.baseURL = 'http://localhost:3000'; // Thay đổi URL server của bạn nếu cần

// Thêm một interceptor yêu cầu
axios.interceptors.request.use(
  (config) => {
    // Lấy token từ cookie
    const token = getTokenFromCookie();
    
    // Nếu có token, thêm vào header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Hàm để lấy token từ cookie
function getTokenFromCookie() {
  try {
    const accountInfo = Cookies.get('accountInformation');
    if (accountInfo) {
      const parsedInfo = JSON.parse(accountInfo);
      return parsedInfo.accessToken || '';
    }
    return '';
  } catch (error) {
    console.error('Error getting token from cookie:', error);
    return '';
  }
}

export default axios; 