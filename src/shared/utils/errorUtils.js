/**
 * Error utilities for handling, logging, and displaying errors
 */
import { showError } from './toastMessageUtils';
import { ERROR_CODES, getErrorMessage } from '../../common/constants';

/**
 * Re-export ERROR_CODES để các module khác không phải thay đổi import path
 */
export { ERROR_CODES };

/**
 * AppError: Lớp lỗi chuẩn của ứng dụng
 */
export class AppError extends Error {
  constructor(code, message = null, data = null) {
    // Sử dụng thông báo tùy chỉnh hoặc thông báo từ bảng mã lỗi
    super(message || getErrorMessage(code));
    this.code = code;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Tạo lỗi chuẩn hóa
 */
export const createError = (code, message = null, data = null) => {
  return new AppError(code, message, data);
};

/**
 * Xử lý lỗi từ API response
 * @param {Object} error - Lỗi axios
 */
export const handleApiError = (error) => {
  // Lỗi mạng (không có response)
  if (!error.response) {
    return createError(ERROR_CODES.API.NETWORK_ERROR);
  }
  
  const { status, data } = error.response;
  
  // Nếu server trả về mã lỗi và thông báo rõ ràng, sử dụng trực tiếp
  if (data?.error?.code) {
    return createError(
      data.error.code,
      data.error.message,
      data.error.details
    );
  }
  
  // Nếu không, ánh xạ HTTP status code sang mã lỗi
  const statusToErrorCode = {
    400: ERROR_CODES.API.BAD_REQUEST,
    401: ERROR_CODES.AUTH.UNAUTHORIZED,
    403: ERROR_CODES.AUTH.UNAUTHORIZED,
    404: ERROR_CODES.API.NOT_FOUND,
    500: ERROR_CODES.API.SERVER_ERROR,
  };
  
  const errorCode = statusToErrorCode[status] || ERROR_CODES.UNKNOWN;
  return createError(errorCode, data?.message);
};

/**
 * Ghi log lỗi vào console
 */
export const logError = (error, context = '') => {
  console.error(`[${context}] Lỗi:`, error);
  return error; // Cho phép gọi theo chuỗi
};

/**
 * Hiển thị thông báo lỗi và trả về lỗi field (nếu có)
 * 
 * @param {any} error - Lỗi từ API hoặc Redux
 * @returns {Object} Đối tượng chứa các lỗi theo field
 */
export const handleError = (error) => {
  // Log để debug
  console.log('Error object:', error);
  
  // Xử lý trường hợp error là AppError
  if (error?.code) {
    // Xử lý các mã lỗi cụ thể cho form field
    if (error.code === ERROR_CODES.AUTH.INVALID_CREDENTIALS) {
      // Đối với lỗi đăng nhập sai, hiển thị lỗi tại trường password
      return {
        password: 'Email hoặc mật khẩu không đúng'
      };
    }
    
    if (error.code === ERROR_CODES.VALIDATION.INVALID_EMAIL) {
      return { email: 'Email không hợp lệ' };
    }
    
    if (error.code === ERROR_CODES.VALIDATION.INVALID_PASSWORD) {
      return { password: 'Mật khẩu không hợp lệ' };
    }
    
    // Hiển thị thông báo lỗi từ error
    showError(error.message || 'Đã xảy ra lỗi');
    return {};
  }
  
  // Trường hợp 1: Lỗi từ API với format chuẩn
  if (error?.response?.data?.error) {
    const { message, details } = error.response.data.error;
    
    // Nếu có lỗi validation với các field cụ thể
    if (details?.fields) {
      return details.fields;
    }
    
    // Lỗi chung, hiển thị thông báo và trả về rỗng
    showError(message || 'Đã xảy ra lỗi');
    return {};
  }
  
  // Trường hợp 2: Lỗi từ Redux action payload
  if (error?.error) {
    const { message, details } = error.error;
    
    // Nếu có lỗi validation với các field cụ thể
    if (details?.fields) {
      return details.fields;
    }
    
    // Lỗi chung, hiển thị thông báo và trả về rỗng
    showError(message || 'Đã xảy ra lỗi');
    return {};
  }
  
  // Trường hợp 3: Lỗi không xác định
  logError(error, 'Unhandled');
  showError('Đã xảy ra lỗi hệ thống');
  return {};
};

/**
 * Xử lý lỗi đầy đủ - chuyển đổi, hiển thị và log
 * @returns {AppError} Đối tượng lỗi đã xử lý
 */
export const processError = (error, context = '') => {
  const appError = error instanceof AppError 
    ? error 
    : handleApiError(error);
  
  showError(appError.message);
  return logError(appError, context);
};

/**
 * Kiểm tra xem object có rỗng hay không
 * 
 * @param {Object} obj - Object cần kiểm tra
 * @returns {boolean} true nếu object rỗng
 */
export const isEmptyObject = (obj) => {
  return obj ? Object.keys(obj).length === 0 : true;
}; 