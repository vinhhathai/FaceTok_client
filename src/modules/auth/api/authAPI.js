import { apiClient } from '@httpClient';
import { ERROR_CODES } from '@common/constants';
import { createError } from '@utils/errorUtils';
import { jwtDecode } from 'jwt-decode';
import { getCookie } from '@utils/cookieUtils';

/**
 * Fetch current user profile from token
 */
export const getCurrentUser = async () => {
  try {
    // Extract user ID from token in cookie
    const TOKEN_COOKIE_NAME = 'auth_token';
    const token = getCookie(TOKEN_COOKIE_NAME);
    
    if (!token) {
      throw createError(
        ERROR_CODES.AUTH.NOT_AUTHENTICATED,
        'Không tìm thấy token xác thực'
      );
    }

    // Decode the token to get the user ID
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId || decodedToken._id;
    
    if (!userId) {
      throw createError(
        ERROR_CODES.AUTH.INVALID_TOKEN,
        'Token không hợp lệ hoặc thiếu thông tin người dùng'
      );
    }

    // Call the profile endpoint with the extracted user ID
    const response = await apiClient.get(`user/profile/${userId}`);
    
    // Add isOwner flag since we're requesting our own profile
    if (response.data && response.data.data) {
      response.data.data.isOwner = true;
    }
    
    return response.data;
  } catch (error) {
    // Nếu server trả về response có lỗi cụ thể
    if (error.response) {
      console.log('Get current user API error:', error.response);
      const status = error.response.status;
      let errorCode = error.response.data?.error?.code;
      const errorData = error.response.data;
      const message = errorData?.message || errorData?.error?.message || 'Lỗi không xác định từ máy chủ';
      
      // Xử lý lỗi 404 nếu không có mã lỗi cụ thể
      if (status === 404 && !errorCode) {
        errorCode = ERROR_CODES.API.RESOURCE_NOT_FOUND;
      }

      // Các lỗi khác từ phía server
      throw createError(
        errorCode,
        message,
        errorData,
        status
      );
    }

    // Lỗi không có response (ví dụ mất mạng, server không phản hồi...)
    if (error.request) {
      throw createError(
        ERROR_CODES.API.NETWORK_ERROR,
        'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.'
      );
    }

    // If it's our custom error, just rethrow it
    if (error.code && error.message) {
      throw error;
    }

    // Lỗi không xác định (do mã, bug, không liên quan đến API)
    throw createError(
      ERROR_CODES.UNKNOWN,
      'Đã xảy ra lỗi không xác định. Vui lòng thử lại.'
    );
  }
};

/**
 * API function cho đăng nhập
 */
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('auth/login/', {
      email: credentials.email,
      password: credentials.password
    });
    return response.data;
  } catch (error) {
    // Nếu server trả về response có lỗi cụ thể
    if (error.response) {
      console.log('Login API error:', error.response);
      const status = error.response.status;
      let errorCode = error.response.data?.error?.code;
      const errorData = error.response.data;
      const message = errorData?.message || errorData?.error?.message || 'Lỗi không xác định từ máy chủ';
      
      // Xử lý lỗi 404 nếu không có mã lỗi cụ thể
      if (status === 404 && !errorCode) {
        errorCode = ERROR_CODES.API.RESOURCE_NOT_FOUND;
      }

      // Các lỗi khác từ phía server
      throw createError(
        errorCode,
        message,
        errorData,
        status
      );
    }

    // Lỗi không có response (ví dụ mất mạng, server không phản hồi...)
    if (error.request) {
      throw createError(
        ERROR_CODES.API.NETWORK_ERROR,
        'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.'
      );
    }

    // Lỗi không xác định (do mã, bug, không liên quan đến API)
    throw createError(
      ERROR_CODES.UNKNOWN,
      'Đã xảy ra lỗi không xác định. Vui lòng thử lại.'
    );
  }
};

/**
 * API function stubs (empty implementations for now)
 */

// Register API stub
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('auth/sign-up', {
      fullName: userData.username,
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.confirmPassword
    });
    return response.data;
  } catch (error) {
    // Nếu server trả về response có lỗi cụ thể
    if (error.response) {
      console.log('Register API error:', error.response);
      const status = error.response.status;
      let errorCode = error.response.data?.error?.code;
      const errorData = error.response.data;
      const message = errorData?.message || errorData?.error?.message || 'Lỗi không xác định từ máy chủ';
      
      // Xử lý lỗi 404 nếu không có mã lỗi cụ thể
      if (status === 404 && !errorCode) {
        errorCode = ERROR_CODES.API.RESOURCE_NOT_FOUND;
      }
      
      // Các lỗi khác từ phía server
      throw createError(
        errorCode,
        message,
        errorData,
        status
      );
    }

    // Lỗi không có response (ví dụ mất mạng, server không phản hồi...)
    if (error.request) {
      throw createError(
        ERROR_CODES.API.NETWORK_ERROR,
        'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.'
      );
    }

    // Lỗi không xác định (do mã, bug, không liên quan đến API)
    throw createError(
      ERROR_CODES.UNKNOWN,
      'Đã xảy ra lỗi không xác định. Vui lòng thử lại.'
    );
  }
};

// Password reset request API
export const requestPasswordReset = async (data) => {
  try {
    const response = await apiClient.post('auth/request-reset', {
      email: data.email
    });
    return response.data;
  } catch (error) {
    // Nếu server trả về response có lỗi cụ thể
    if (error.response) {
      console.log('Password reset request API error:', error.response);
      const status = error.response.status;
      let errorCode = error.response.data?.error?.code;
      const errorData = error.response.data;
      const message = errorData?.message || errorData?.error?.message || 'Lỗi không xác định từ máy chủ';
      
      // Xử lý lỗi 404 nếu không có mã lỗi cụ thể
      if (status === 404 && !errorCode) {
        errorCode = ERROR_CODES.API.RESOURCE_NOT_FOUND;
      }
      
      // Các lỗi khác từ phía server
      throw createError(
        errorCode,
        message,
        errorData,
        status
      );
    }

    // Lỗi không có response (ví dụ mất mạng, server không phản hồi...)
    if (error.request) {
      throw createError(
        ERROR_CODES.API.NETWORK_ERROR,
        'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.'
      );
    }

    // Lỗi không xác định (do mã, bug, không liên quan đến API)
    throw createError(
      ERROR_CODES.UNKNOWN,
      'Đã xảy ra lỗi không xác định. Vui lòng thử lại.'
    );
  }
};

// OTP verification API
export const verifyOTP = async (data) => {
  try {
    const response = await apiClient.post('auth/verify-otp', {
      email: data.email,
      otp: data.otp
    });
    return response.data;
  } catch (error) {
    // Nếu server trả về response có lỗi cụ thể
    if (error.response) {
      console.log('Verify OTP API error:', error.response);
      const status = error.response.status;
      let errorCode = error.response.data?.error?.code;
      const errorData = error.response.data;
      const message = errorData?.message || errorData?.error?.message || 'Lỗi không xác định từ máy chủ';
      
      // Xử lý lỗi 404 nếu không có mã lỗi cụ thể
      if (status === 404 && !errorCode) {
        errorCode = ERROR_CODES.API.RESOURCE_NOT_FOUND;
      }
      
      // Các lỗi khác từ phía server
      throw createError(
        errorCode,
        message,
        errorData,
        status
      );
    }

    // Lỗi không có response (ví dụ mất mạng, server không phản hồi...)
    if (error.request) {
      throw createError(
        ERROR_CODES.API.NETWORK_ERROR,
        'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.'
      );
    }

    // Lỗi không xác định (do mã, bug, không liên quan đến API)
    throw createError(
      ERROR_CODES.UNKNOWN,
      'Đã xảy ra lỗi không xác định. Vui lòng thử lại.'
    );
  }
};

// Password reset API
export const resetPassword = async (data) => {
  try {
    // Tạo config với token trong Authorization header
    const config = {
      headers: {
        'Authorization': `Bearer ${data.resetToken}`
      }
    };

    // Gửi request với newPassword và confirmPassword
    const response = await apiClient.post('auth/reset-password', {
      newPassword: data.password,
      confirmPassword: data.confirmPassword
    }, config);
    
    return response.data;
  } catch (error) {
    // Nếu server trả về response có lỗi cụ thể
    if (error.response) {
      console.log('Reset password API error:', error.response);
      const status = error.response.status;
      let errorCode = error.response.data?.error?.code;
      const errorData = error.response.data;
      const message = errorData?.message || errorData?.error?.message || 'Lỗi không xác định từ máy chủ';
      
      // Xử lý lỗi 404 nếu không có mã lỗi cụ thể
      if (status === 404 && !errorCode) {
        errorCode = ERROR_CODES.API.RESOURCE_NOT_FOUND;
      }
      
      // Các lỗi khác từ phía server
      throw createError(
        errorCode,
        message,
        errorData,
        status
      );
    }

    // Lỗi không có response (ví dụ mất mạng, server không phản hồi...)
    if (error.request) {
      throw createError(
        ERROR_CODES.API.NETWORK_ERROR,
        'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.'
      );
    }

    // Lỗi không xác định (do mã, bug, không liên quan đến API)
    throw createError(
      ERROR_CODES.UNKNOWN,
      'Đã xảy ra lỗi không xác định. Vui lòng thử lại.'
    );
  }
}; 