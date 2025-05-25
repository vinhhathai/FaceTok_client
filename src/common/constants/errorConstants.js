/**
 * Error constants used throughout the application
 * Đồng bộ với các mã lỗi từ server
 */

// Error codes mapping
export const ERROR_CODES = {
  // Authentication
  AUTH: {
    LOGIN_FAILED: 'AUTH_LOGIN_FAILED',
    INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
    UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
    REGISTER_FAILED: 'AUTH_REGISTER_FAILED',
    EMAIL_ALREADY_EXISTS: 'AUTH_EMAIL_ALREADY_EXISTS',
    PASSWORD_RESET_FAILED: 'AUTH_PASSWORD_RESET_FAILED',
    ACCOUNT_IS_BANNED: 'AUTH_ACCOUNT_IS_BANNED',
  },
  
  // API
  API: {
    NETWORK_ERROR: 'API_NETWORK_ERROR',
    SERVER_ERROR: 'API_SERVER_ERROR',
    BAD_REQUEST: 'API_BAD_REQUEST',
    NOT_FOUND: 'API_NOT_FOUND'
  },
  
  // Validation
  VALIDATION: {
    INVALID_INPUT: 'VAL_INVALID_INPUT',
    MISSING_FIELDS: 'VAL_MISSING_FIELDS',
    INVALID_EMAIL: 'VAL_INVALID_EMAIL',
    INVALID_PASSWORD: 'VAL_INVALID_PASSWORD',
  },
  
  // Generic
  UNKNOWN: 'UNKNOWN_ERROR',
};

// Error messages corresponding to error codes
export const ERROR_MESSAGES = {
  // Authentication
  [ERROR_CODES.AUTH.LOGIN_FAILED]: 'Đăng nhập không thành công. Vui lòng thử lại.',
  [ERROR_CODES.AUTH.INVALID_CREDENTIALS]: 'Email hoặc mật khẩu không đúng.',
  [ERROR_CODES.AUTH.UNAUTHORIZED]: 'Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.',
  [ERROR_CODES.AUTH.REGISTER_FAILED]: 'Đăng ký không thành công. Vui lòng thử lại.',
  [ERROR_CODES.AUTH.EMAIL_ALREADY_EXISTS]: 'Email này đã được sử dụng.',
  [ERROR_CODES.AUTH.PASSWORD_RESET_FAILED]: 'Đặt lại mật khẩu không thành công.',
  [ERROR_CODES.AUTH.ACCOUNT_IS_BANNED]: 'Tài khoản đã bị khóa.',
  
  // API 
  [ERROR_CODES.API.NETWORK_ERROR]: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối và thử lại.',
  [ERROR_CODES.API.SERVER_ERROR]: 'Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau.',
  [ERROR_CODES.API.BAD_REQUEST]: 'Yêu cầu không hợp lệ.',
  [ERROR_CODES.API.NOT_FOUND]: 'Không tìm thấy tài nguyên yêu cầu.',
  
  // Validation
  [ERROR_CODES.VALIDATION.INVALID_INPUT]: 'Dữ liệu không hợp lệ.',
  [ERROR_CODES.VALIDATION.MISSING_FIELDS]: 'Vui lòng điền đầy đủ thông tin.',
  [ERROR_CODES.VALIDATION.INVALID_EMAIL]: 'Email không đúng định dạng.',
  [ERROR_CODES.VALIDATION.INVALID_PASSWORD]: 'Mật khẩu không đủ mạnh.',
  
  // Generic
  [ERROR_CODES.UNKNOWN]: 'Đã xảy ra lỗi không xác định.',
};

/**
 * Lấy thông báo lỗi từ mã lỗi
 * @param {string} code - Mã lỗi
 * @returns {string} Thông báo lỗi
 */
export const getErrorMessage = (code) => {
  // Kiểm tra nếu code không tồn tại trong danh sách thông báo
  if (!ERROR_MESSAGES[code]) {
    console.warn(`Chưa có thông báo cho mã lỗi: ${code}`);
    return ERROR_MESSAGES[ERROR_CODES.UNKNOWN];
  }
  
  return ERROR_MESSAGES[code];
}; 