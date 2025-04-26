import { toast } from 'react-toastify';

/**
 * Standardized toast utility functions for the application
 * Provides consistent styling and behavior for all toast notifications
 */

// Default toast configuration
const defaultOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light" // Changed from "dark" to "light" for white background
};

/**
 * Display a success toast notification
 * @param {string} message - The message to display
 * @param {object} options - Optional toast configuration to override defaults
 */
export const showSuccess = (message, options = {}) => {
  return toast.success(message, { ...defaultOptions, ...options });
};

/**
 * Display an error toast notification
 * @param {string} message - The message to display
 * @param {object} options - Optional toast configuration to override defaults
 */
export const showError = (message, options = {}) => {
  return toast.error(message, { ...defaultOptions, ...options });
};

/**
 * Display an info toast notification
 * @param {string} message - The message to display
 * @param {object} options - Optional toast configuration to override defaults
 */
export const showInfo = (message, options = {}) => {
  return toast.info(message, { ...defaultOptions, ...options });
};

/**
 * Display a warning toast notification
 * @param {string} message - The message to display
 * @param {object} options - Optional toast configuration to override defaults
 */
export const showWarning = (message, options = {}) => {
  return toast.warning(message, { ...defaultOptions, ...options });
};

// For advanced use cases, also export the original toast object
export { toast };

export default {
  success: showSuccess,
  error: showError,
  info: showInfo,
  warning: showWarning,
  toast
}; 