import authReducer, {
  login,
  logout, 
  clearError
} from './authSlice';

// Stub functions for now (not implemented)
const register = () => ({ type: 'auth/register/pending' });
const forgotPassword = () => ({ type: 'auth/forgotPassword/pending' });
const verifyOTP = () => ({ type: 'auth/verifyOTP/pending' });
const resetPassword = () => ({ type: 'auth/resetPassword/pending' });
const resetPasswordState = () => ({ type: 'auth/resetPasswordState' });

// Export all actions
export {
  login,
  logout, 
  clearError,
  // Export stub functions
  register,
  forgotPassword,
  verifyOTP,
  resetPassword,
  resetPasswordState
};

// Export reducer mặc định
export default authReducer; 