import { apiClient } from '../../../shared/httpClient';
import { ERROR_CODES } from '../../../common/constants';
import { createError } from '../../../shared/utils/errorUtils';

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
    console.log('Login API error:', error);
    
    // Nếu server trả về response có lỗi cụ thể
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      const message = errorData?.message || errorData?.error?.message || 'Lỗi không xác định từ máy chủ';
      
      // Xử lý các mã lỗi cụ thể
      if (status === 401 || status === 400) {
        // Kiểm tra nếu server trả về mã lỗi cụ thể
        if (errorData?.error?.code) {
          throw createError(
            errorData.error.code,
            message,
            errorData.error.details
          );
        }
        
        // Nếu không có mã lỗi cụ thể, sử dụng INVALID_CREDENTIALS
        throw createError(
          ERROR_CODES.AUTH.INVALID_CREDENTIALS,
          'Email hoặc mật khẩu không đúng'
        );
      }

      // Các lỗi khác từ phía server
      throw createError(
        ERROR_CODES.AUTH.LOGIN_FAILED,
        message
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
export const registerUser = async () => {
  throw createError(
    ERROR_CODES.AUTH.UNAUTHORIZED,
    'Chức năng đăng ký tạm thời đang được bảo trì'
  );
};

// Password reset request API stub
export const requestPasswordReset = async () => {
  throw createError(
    ERROR_CODES.AUTH.UNAUTHORIZED, 
    'Chức năng quên mật khẩu tạm thời đang được bảo trì'
  );
};

// OTP verification API stub
export const verifyOTP = async () => {
  throw createError(
    ERROR_CODES.AUTH.UNAUTHORIZED,
    'Chức năng xác thực OTP tạm thời đang được bảo trì'
  );
};

// Password reset API stub
export const resetPassword = async () => {
  throw createError(
    ERROR_CODES.AUTH.UNAUTHORIZED,
    'Chức năng đặt lại mật khẩu tạm thời đang được bảo trì'
  );
}; 