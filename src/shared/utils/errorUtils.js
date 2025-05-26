/**
 * Error utilities for handling and formatting errors
 */
import { ERROR_CODES } from '../../common/constants';
import { ERROR_MESSAGES } from '../../common/constants/errorConstants';

export { ERROR_CODES };

/**
 * Tạo lỗi chuẩn hóa đơn giản
 */
export const createError = (code, message = '', data = null, status = 400) => {
  return {
    code,
    message,
    data,
    status,
    timestamp: new Date().toISOString()
  };
}; 

/**
 * Lấy thông báo lỗi từ mã lỗi
 * @param {string} code - Mã lỗi
 * @param {string} defaultMessage - Thông báo mặc định nếu không tìm thấy mã lỗi
 * @returns {string} Thông báo lỗi
 */
export const getErrorMessage = (code, defaultMessage = '') => {
  // Kiểm tra nếu code không tồn tại trong danh sách thông báo
  if (!code || !ERROR_MESSAGES[code]) {
    if (defaultMessage) {
      return defaultMessage;
    }
    console.warn(`Chưa có thông báo cho mã lỗi: ${code}`);
    return ERROR_MESSAGES[ERROR_CODES.UNKNOWN];
  }
  
  return ERROR_MESSAGES[code];
};

/**
 * Format thông báo lỗi từ API response
 * @param {Object} payload - Payload từ API response
 * @param {string} defaultMessage - Thông báo mặc định nếu không có lỗi
 * @returns {string} Thông báo lỗi đã được format
 */
export const formatErrorMessage = (payload, defaultMessage = 'Đã xảy ra lỗi') => {
  const errorCode = payload?.code;
  const errorMessage = payload?.message;
  const errorStatus = payload?.status;

  let displayMessage = '';
  
  // Ưu tiên dùng mã lỗi để lấy thông báo tiếng Việt
  if (errorCode) {
    displayMessage = getErrorMessage(errorCode, errorMessage);
  } else {
    // Nếu không có mã lỗi, sử dụng thông báo từ server hoặc mặc định
    displayMessage = errorMessage || defaultMessage;
  }
  
  // Thêm mã status nếu có
  if (errorStatus) {
    displayMessage = `[${errorStatus}] ${displayMessage}`;
  }
  
  return displayMessage;
}; 