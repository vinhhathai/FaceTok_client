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
    INVALID_INPUT: 'VAL_INVALID_INPUT',
    MISSING_FIELDS: 'VAL_MISSING_FIELDS',
    INVALID_EMAIL: 'VAL_INVALID_EMAIL',
    INVALID_PASSWORD: 'VAL_INVALID_PASSWORD',
    REQUEST_PASSWORD_RESET_FAILED: 'AUTH_REQUEST_PASSWORD_RESET_FAILED',
    VERIFY_OTP_FAILED: 'AUTH_VERIFY_OTP_FAILED',
    INVALID_OTP: 'AUTH_INVALID_OTP',
    OTP_EXPIRED: 'AUTH_OTP_EXPIRED',
    TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED'
  },
  
  // API
  API: {
    NETWORK_ERROR: 'API_NETWORK_ERROR',
    SERVER_ERROR: 'API_SERVER_ERROR',
    BAD_REQUEST: 'API_BAD_REQUEST',
    NOT_FOUND: 'API_NOT_FOUND',
    RESOURCE_NOT_FOUND: 'API_RESOURCE_NOT_FOUND'
  },
  
  // Data
  DATA: {
    DATA_NOT_FOUND: 'DATA_NOT_FOUND',
    USER_NOT_FOUND: 'DATA_USER_NOT_FOUND',
    POST_NOT_FOUND: 'DATA_POST_NOT_FOUND',
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
  [ERROR_CODES.AUTH.INVALID_INPUT]: 'Tài khoản hoặc mật khẩu không hợp lệ',
  [ERROR_CODES.AUTH.MISSING_FIELDS]: 'Vui lòng điền đầy đủ thông tin.',
  [ERROR_CODES.AUTH.INVALID_EMAIL]: 'Email không đúng định dạng.',
  [ERROR_CODES.AUTH.INVALID_PASSWORD]: 'Mật khẩu không đủ mạnh.',
  [ERROR_CODES.AUTH.REQUEST_PASSWORD_RESET_FAILED]: 'Yêu cầu đặt lại mật khẩu thất bại.',
  [ERROR_CODES.AUTH.VERIFY_OTP_FAILED]: 'Xác thực mã OTP thất bại.',
  [ERROR_CODES.AUTH.INVALID_OTP]: 'Mã OTP không chính xác.',
  [ERROR_CODES.AUTH.OTP_EXPIRED]: 'Mã OTP đã hết hạn.',
  [ERROR_CODES.AUTH.TOKEN_EXPIRED]: 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.',
  
  // API 
  [ERROR_CODES.API.NETWORK_ERROR]: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối và thử lại.',
  [ERROR_CODES.API.SERVER_ERROR]: 'Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau.',
  [ERROR_CODES.API.BAD_REQUEST]: 'Yêu cầu không hợp lệ.',
  [ERROR_CODES.API.NOT_FOUND]: 'Không tìm thấy tài nguyên yêu cầu.',
  [ERROR_CODES.API.RESOURCE_NOT_FOUND]: 'Không tìm thấy tài nguyên. Vui lòng kiểm tra lại đường dẫn.',
  
  // Data
  [ERROR_CODES.DATA.DATA_NOT_FOUND]: 'Không tìm thấy dữ liệu yêu cầu.',
  [ERROR_CODES.DATA.USER_NOT_FOUND]: 'Không tìm thấy tài khoản với email này.',
  [ERROR_CODES.DATA.POST_NOT_FOUND]: 'Không tìm thấy bài viết.',
  
  // Generic
  [ERROR_CODES.UNKNOWN]: 'Đã xảy ra lỗi không xác định.',
};

