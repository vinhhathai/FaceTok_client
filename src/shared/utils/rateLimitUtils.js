/**
 * Utility functions for handling rate limit errors
 */

/**
 * Get Vietnamese error message based on rate limit error code
 * @param {Object} errorData - Error data from backend response
 * @returns {string} Vietnamese error message
 */
export const getRateLimitMessage = (errorData) => {
  if (!errorData) {
    return 'Bạn đang thao tác quá nhanh! Vui lòng thử lại sau.';
  }

  const errorCode = errorData.errorCode || errorData.error;
  const details = errorData.details || {};
  const retryMinutes = details.retryAfterMinutes || 15;
  const limit = details.limit || 10;
  const windowMinutes = details.windowMinutes || 15;

  const messages = {
    'CREATE_POST_RATE_LIMIT': 
      `Bạn đã tạo quá nhiều bài viết! Giới hạn ${limit} bài trong ${windowMinutes} phút. Vui lòng thử lại sau ${retryMinutes} phút nữa.`,
    
    'CREATE_COMMENT_RATE_LIMIT': 
      `Bạn đã bình luận quá nhiều! Giới hạn ${limit} bình luận trong ${windowMinutes} phút. Vui lòng chậm lại và thử lại sau ${retryMinutes} phút.`,
    
    'TOGGLE_LIKE_RATE_LIMIT': 
      `Bạn đã thích/bỏ thích quá nhanh! Giới hạn ${limit} lượt trong ${windowMinutes} phút. Hãy chậm lại và thử lại sau ${retryMinutes} phút.`,
    
    'CREATE_REPORT_RATE_LIMIT': 
      `Bạn đã gửi quá nhiều báo cáo! Giới hạn ${limit} báo cáo/giờ. Vui lòng thử lại sau ${retryMinutes} phút.`,
    
    'LOGIN_RATE_LIMIT': 
      `Quá nhiều lần đăng nhập thất bại! Giới hạn ${limit} lần trong 15 phút. Vui lòng thử lại sau ${retryMinutes} phút.`,
    
    'REGISTER_RATE_LIMIT': 
      `Quá nhiều lần đăng ký! Giới hạn ${limit} lần/giờ. Vui lòng thử lại sau ${retryMinutes} phút.`,
    
    'UPLOAD_RATE_LIMIT': 
      `Bạn đã upload quá nhiều file! Giới hạn ${limit} file/giờ. Vui lòng thử lại sau ${retryMinutes} phút.`,
    
    'AVATAR_UPLOAD_RATE_LIMIT': 
      `Bạn đã thay đổi avatar quá nhiều lần! Giới hạn ${limit} lần/giờ. Vui lòng thử lại sau ${retryMinutes} phút.`,
  };

  return messages[errorCode] || `Bạn đang thao tác quá nhanh! Vui lòng chờ ${retryMinutes} phút và thử lại.`;
};

/**
 * Check if error is a rate limit error
 * @param {Object} error - Error object
 * @returns {boolean} True if it's a rate limit error
 */
export const isRateLimitError = (error) => {
  return error?.response?.status === 429;
};

/**
 * Get details from rate limit error
 * @param {Object} error - Error object
 * @returns {Object} Rate limit details
 */
export const getRateLimitDetails = (error) => {
  if (!isRateLimitError(error)) {
    return null;
  }

  const errorData = error.response?.data;
  return {
    errorCode: errorData?.errorCode || errorData?.error,
    message: getRateLimitMessage(errorData),
    details: errorData?.details || {},
    retryAfter: errorData?.details?.retryAfter,
    retryAfterMinutes: errorData?.details?.retryAfterMinutes,
  };
};
