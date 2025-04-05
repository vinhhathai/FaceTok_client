import axios from 'axios';
import Cookies from 'js-cookie';

// Lấy origin của client (đầy đủ domain/host) và thay đổi port nếu cần
const getBaseURL = () => {
  const origin = window.location.origin; // ví dụ: http://localhost:3001
  
  // Nếu đang chạy local, sử dụng port 3000 cho API
  if (origin.includes('localhost')) {
    return origin.replace(/:\d+$/, ':3000'); // Thay thế port bằng 3000
  }
  
  // Khi deploy, sử dụng cùng domain nhưng path khác nhau
  return origin;
};

// Đặt URL cơ sở cho tất cả các yêu cầu
axios.defaults.baseURL = getBaseURL();
console.log('Axios baseURL configured as:', axios.defaults.baseURL);

// Thêm interceptor cho mọi request
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