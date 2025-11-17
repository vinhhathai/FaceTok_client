import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Default toast configuration
 */
const defaultConfig = {
  position: 'top-right',
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

/**
 * Map common English messages to Vietnamese
 */
const EN_TO_VI_MAP = {
  'Failed to fetch friends': 'Không thể tải danh sách bạn bè',
  'Failed to fetch received friend requests': 'Không thể tải lời mời kết bạn nhận được',
  'Failed to fetch sent friend requests': 'Không thể tải lời mời kết bạn đã gửi',
  'Failed to search friends': 'Không thể tìm kiếm bạn bè',
  'Failed to send friend request': 'Không thể gửi lời mời kết bạn',
  'Failed to accept friend request': 'Không thể chấp nhận lời mời kết bạn',
  'Failed to reject friend request': 'Không thể từ chối lời mời kết bạn',
  'Failed to create post': 'Không thể tạo bài viết',
  'Failed to fetch posts': 'Không thể tải bài viết',
  'Failed to send message': 'Không thể gửi tin nhắn',
  'Failed to fetch messages': 'Không thể tải tin nhắn',
  'Network error': 'Lỗi mạng, vui lòng kiểm tra kết nối',
  'No token found': 'Không tìm thấy phiên đăng nhập',
  'Failed to update fullname': 'Không thể cập nhật tên hiển thị'
};

const normalizeToVietnamese = (msg) => {
  if (!msg || typeof msg !== 'string') return 'Đã xảy ra lỗi';
  // Exact map first
  if (EN_TO_VI_MAP[msg]) return EN_TO_VI_MAP[msg];
  // Generic patterns
  if (msg.startsWith('Failed to ')) return 'Thao tác không thành công. Vui lòng thử lại.';
  if (msg.toLowerCase().includes('unauthorized')) return 'Bạn không có quyền thực hiện thao tác này';
  if (msg.toLowerCase().includes('not found')) return 'Tài nguyên không tồn tại hoặc đã bị xóa';
  return msg; // Assume already Vietnamese or acceptable
};

/**
 * Show a success notification
 * @param {string} message - The message to display
 * @param {object} options - Toast configuration options
 */
export const showSuccess = (message, options = {}) => {
  toast.success(message, { ...defaultConfig, ...options });
};

/**
 * Show an error notification
 * @param {string} message - The message to display
 * @param {object} options - Toast configuration options
 */
export const showError = (message, options = {}) => {
  toast.error(normalizeToVietnamese(message), { ...defaultConfig, ...options });
};

/**
 * Show a warning notification
 * @param {string} message - The message to display
 * @param {object} options - Toast configuration options
 */
export const showWarning = (message, options = {}) => {
  toast.warning(message, { ...defaultConfig, ...options });
};

/**
 * Show an info notification
 * @param {string} message - The message to display
 * @param {object} options - Toast configuration options
 */
export const showInfo = (message, options = {}) => {
  toast.info(message, { ...defaultConfig, ...options });
};

/**
 * Show a default notification
 * @param {string} message - The message to display
 * @param {object} options - Toast configuration options
 */
export const showToast = (message, options = {}) => {
  const msg = normalizeToVietnamese(message);
  toast(msg, { ...defaultConfig, ...options });
};

/**
 * Clear all notifications
 */
export const clearAllToasts = () => {
  toast.dismiss();
};

/**
 * Handle API error and show appropriate toast message
 * @param {object} error - Error object from API call
 * @param {string} fallbackMessage - Fallback message if error doesn't contain specific message
 * @param {object} options - Toast configuration options
 */
export const handleApiError = (error, fallbackMessage = 'Đã xảy ra lỗi', options = {}) => {
  let message = fallbackMessage;
  
  if (error) {
    // Try to get the most specific error message
    if (typeof error === 'string') {
      message = error;
    } else if (error.message) {
      message = error.message;
    } else if (error.error?.message) {
      message = error.error.message;
    } else if (error.response?.data?.error?.message) {
      message = error.response.data.error.message;
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    }
  }
  
  // Show the error toast (normalize to Vietnamese)
  showError(message, options);
  
  // Log the error for debugging
  console.error('API Error:', error);
};