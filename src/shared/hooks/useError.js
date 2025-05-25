import { useState, useCallback } from 'react';
import { ERROR_CODES } from '../../common/constants';
import { 
  AppError, 
  createError, 
  logError, 
  handleApiError, 
  processError 
} from '../utils/errorUtils';
import { showSuccess, showError } from '../utils/toastMessageUtils';

/**
 * Simple error handling hook for login
 */
const useError = () => {
  const [error, setError] = useState(null);
  
  /**
   * Clear current error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Handle any error and show notification
   */
  const handleError = useCallback((err, context = '') => {
    // Convert to AppError if needed
    const appError = err instanceof AppError
      ? err
      : createError(
          ERROR_CODES.UNKNOWN,
          err?.message
        );
    
    // Log the error
    logError(appError, context);
    
    // Update error state
    setError(appError);
    
    // Show notification
    showError(appError.message);
    
    return appError;
  }, []);
  
  /**
   * Wrapper for login API call
   */
  const handleLogin = useCallback(async (loginFn) => {
    try {
      clearError();
      return await loginFn();
    } catch (err) {
      const appError = handleError(err, 'Login');
      return { error: appError };
    }
  }, [handleError, clearError]);
  
  return {
    error,
    clearError,
    handleError,
    handleLogin,
    showSuccess,
    showError,
    // Export error utility methods
    createError,
    handleApiError,
    processError,
    logError
  };
};

export default useError; 