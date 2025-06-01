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
  toast.error(message, { ...defaultConfig, ...options });
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
  toast(message, { ...defaultConfig, ...options });
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
  
  // Show the error toast
  showError(message, options);
  
  // Log the error for debugging
  console.error('API Error:', error);
}; 