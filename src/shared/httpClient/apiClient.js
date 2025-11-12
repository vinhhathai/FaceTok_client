import axios from 'axios';
import { getCookie, removeCookie } from '@utils/cookieUtils';

// Cookie names
const ACCESS_TOKEN_COOKIE = process.env.REACT_APP_AUTH_TOKEN_NAME || 'auth_token';
const REFRESH_TOKEN_COOKIE = process.env.REACT_APP_REFRESH_TOKEN_NAME || 'refresh_token';

// Tạo instance của axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000, // 10 giây timeout
  withCredentials: true, // Important: Send cookies with requests
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
});

// Variables for token refresh
let isRefreshing = false;
let failedQueue = [];

// Process queued requests after token refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Thêm interceptor để xử lý request
apiClient.interceptors.request.use(
  (config) => {
    // Get token from httpOnly cookie (automatically sent by browser)
    // If server sets httpOnly cookie, browser will auto-send it
    // We just need to add Authorization header from regular cookie as fallback
    const token = getCookie(ACCESS_TOKEN_COOKIE);
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[API Request]', error);
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý response
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Get refresh token from cookie
      const refreshToken = getCookie(REFRESH_TOKEN_COOKIE);

      // If no refresh token, logout user
      if (!refreshToken) {
        // Clear cookies
        removeCookie(ACCESS_TOKEN_COOKIE);
        removeCookie(REFRESH_TOKEN_COOKIE);
        
        // Dispatch unauthorized event
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        // Call refresh token API
        // Server will set new httpOnly cookies in response
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true } // Important: Accept cookies from server
        );

        if (response.data.success) {
          // Server should have set new cookies
          // Get new token from response or cookie
          const newToken = response.data.data?.accessToken || getCookie(ACCESS_TOKEN_COOKIE);
          
          // Update authorization header for future requests
          if (newToken) {
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          }
          
          // Process queued requests
          processQueue(null, newToken);
          
          // Retry original request with new token
          isRefreshing = false;
          return apiClient(originalRequest);
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        console.error('[Token Refresh Failed]', refreshError);
        
        processQueue(refreshError, null);
        
        // Clear all cookies
        removeCookie(ACCESS_TOKEN_COOKIE);
        removeCookie(REFRESH_TOKEN_COOKIE);
        
        // Dispatch unauthorized event
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }
    
    // Log other errors
    console.error('[API Response]', error);
    
    return Promise.reject(error);
  }
);

export default apiClient;