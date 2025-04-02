import axios from 'axios';
import Cookies from 'js-cookie';

// Lấy API URL từ biến môi trường hoặc sử dụng mặc định
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Tạo axios instance với config mặc định
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor request để đính kèm JWT vào header
api.interceptors.request.use(
  (config) => {
    // Lấy JWT từ cookie
    const accountInfo = Cookies.get('accountInformation');
    
    if (accountInfo) {
      try {
        const { accessToken } = JSON.parse(accountInfo);
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (error) {
        console.error('Error parsing account information:', error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor response để xử lý lỗi và refresh token nếu cần
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Nếu lỗi là Unauthorized và chưa thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Lấy thông tin tài khoản từ cookie
        const accountInfo = Cookies.get('accountInformation');
        
        if (accountInfo) {
          const parsedInfo = JSON.parse(accountInfo);
          
          // Gọi API refresh token
          const refreshResponse = await axios.post(`${API_URL}/auth/refresh-token`, {
            refreshToken: parsedInfo.refreshToken,
          });
          
          // Lưu tokens mới vào cookie
          const { accessToken, refreshToken } = refreshResponse.data;
          
          // Cập nhật cookie với token mới
          Cookies.set('accountInformation', JSON.stringify({
            ...parsedInfo,
            accessToken,
            refreshToken,
          }));
          
          // Đính kèm token mới vào request ban đầu
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          // Gửi lại request ban đầu
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        
        // Logout user if refresh token fails
        Cookies.remove('accountInformation');
        window.location.href = '/auth/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Các hàm Helper
const apiUtils = {
  get: (url, params = {}) => {
    return api.get(url, { params });
  },
  
  post: (url, data = {}) => {
    return api.post(url, data);
  },
  
  put: (url, data = {}) => {
    return api.put(url, data);
  },
  
  delete: (url) => {
    return api.delete(url);
  },
  
  // Hàm upload file với form data
  upload: (url, formData) => {
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Xử lý lỗi chung
  handleError: (error) => {
    if (error.response) {
      // Server trả về lỗi với status code
      return {
        status: error.response.status,
        message: error.response.data.message || 'Server error',
        data: error.response.data
      };
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      return {
        status: 0,
        message: 'No response from server. Please check your network connection.',
      };
    } else {
      // Lỗi khi set up request
      return {
        status: 0,
        message: error.message || 'Unknown error occurred',
      };
    }
  }
};

export default apiUtils; 